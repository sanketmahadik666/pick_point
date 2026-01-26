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
            }
        });

        socket.on('make_guess', ({ gameId, location }) => {
            const game = manager.getGame(gameId);
            if (game) {
                 const command = new MakeGuessCommand(game, socket, { location });
                 command.execute();
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
                    }
                }
                manager.removePlayerMapping(socket.id);
            }
        });
    });
}

module.exports = { configureSockets };
