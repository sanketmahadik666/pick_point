const { Game } = require('../game/Game');
const { getGameManager } = require('../game/GameManager');
const { SetLocationCommand, MakeGuessCommand } = require('../game/Commands');

function configureSockets(io) {
    const manager = getGameManager();

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join_game', ({ gameId }) => {
            gameId = gameId.toUpperCase();
            
            let game = manager.getGame(gameId);
            if (!game) {
                game = new Game(gameId, io);
                manager.createGame(gameId, game);
            }

            const added = game.addPlayer(socket);
            if (added) {
                manager.mapSocketToGame(socket.id, gameId);
            } else {
                socket.emit('error_message', { message: 'This game room is full.' });
            }
        });

        socket.on('set_location', ({ gameId, location, radius, hint }) => {
            const game = manager.getGame(gameId);
            if (game) {
                const command = new SetLocationCommand(game, socket, { location, radius, hint });
                command.execute();
            } else {
                socket.emit('error_message', { message: 'Game not found.' });
            }
        });

        socket.on('make_guess', ({ gameId, location }) => {
            const game = manager.getGame(gameId);
            if (game) {
                 const command = new MakeGuessCommand(game, socket, { location });
                 command.execute();
            } else {
                socket.emit('error_message', { message: 'Game not found.' });
            }
        });

        socket.on('quiz_answer', ({ gameId, selectedIndex, correctIndex }) => {
            const game = manager.getGame(gameId);
            if (game && selectedIndex === correctIndex) {
                // Award bonus points for correct quiz answer
                const bonusPoints = 50;
                if (game.players[socket.id]) {
                    game.players[socket.id].score += bonusPoints;
                    game.emitGameState();
                    socket.emit('quiz_result', { correct: true, points: bonusPoints });
                }
            } else {
                socket.emit('quiz_result', { correct: false, points: 0 });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            const gameId = manager.getGameIdBySocket(socket.id);
            if (gameId) {
                const game = manager.getGame(gameId);
                if (game) {
                    game.removePlayer(socket.id);
                    // If game needs cleanup, it handles it internally via timeouts or we can check here
                    if (Object.keys(game.players).length === 0) {
                        game.cleanup();
                    } else {
                        // Notify remaining player
                        game.io.to(gameId).emit('error_message', { 
                            message: 'Your opponent has disconnected. The game will end.' 
                        });
                        setTimeout(() => {
                            if (game && Object.keys(game.players).length < 2) {
                                game.cleanup();
                            }
                        }, 5000);
                    }
                }
                manager.removePlayerMapping(socket.id);
            }
        });
    });
}

module.exports = { configureSockets };
