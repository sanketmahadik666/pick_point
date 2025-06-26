const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");
const haversine = require('haversine-distance');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve the client-side file
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Game State Management ---
let games = {}; // { gameId: gameState }

const MAX_ROUNDS = 6;
const ROUND_DELAY = 5000; // 5 seconds between rounds

// --- Helper Functions ---

function createNewGame(gameId) {
    return {
        gameId: gameId,
        players: {},
        playerOrder: [],
        round: 0,
        maxRounds: MAX_ROUNDS,
        phase: 'WAITING', // WAITING, SETTING, GUESSING, ROUND_END
        setterId: null,
        guesserId: null,
        actualLocation: null,
        hint: null,
        attemptsLeft: 3,
        lastGuess: null
    };
}

function getSanitizedGameState(game, playerId) {
    // Prevents leaking the actualLocation to the guesser during the GUESSING phase
    const state = { ...game };
    if (state.phase === 'GUESSING' && state.guesserId === playerId) {
        delete state.actualLocation;
    }
    return state;
}

function emitGameState(gameId) {
    const game = games[gameId];
    if (!game) return;
    
    // Send a tailored game state to each player
    Object.keys(game.players).forEach(playerId => {
        io.to(playerId).emit('game_state', getSanitizedGameState(game, playerId));
    });
}

function startRound(gameId) {
    const game = games[gameId];
    if (!game) return;

    if (game.round >= game.maxRounds) {
        endGame(gameId);
        return;
    }

    game.round++;
    game.phase = 'SETTING';
    game.attemptsLeft = 3;
    game.actualLocation = null;
    game.hint = null;
    game.lastGuess = null;

    // Switch roles. Setter is determined by (round - 1) % 2
    const setterIndex = (game.round - 1) % 2;
    game.setterId = game.playerOrder[setterIndex];
    game.guesserId = game.playerOrder[1 - setterIndex];
    
    console.log(`[${gameId}] Starting Round ${game.round}. Setter: ${game.setterId}, Guesser: ${game.guesserId}`);
    
    emitGameState(gameId);
}

function calculatePoints(distance) {
    // distance is in meters
    if (distance <= 50) return 5000; // Perfect guess
    if (distance > 1500000) return 0; // Over 1500km away
    
    // Use a logarithmic scale to make closer guesses much more valuable
    const points = 5000 - Math.floor(Math.log(distance) * 500);
    return Math.max(0, points);
}


function endRound(gameId, distance) {
    const game = games[gameId];
    if (!game) return;

    game.phase = 'ROUND_END';
    const points = calculatePoints(distance);
    game.players[game.guesserId].score += points;

    console.log(`[${gameId}] Round ended. Distance: ${distance.toFixed(2)}m. Points: ${points}`);

    io.to(gameId).emit('round_end', {
        actualLocation: [game.actualLocation.lat, game.actualLocation.lon],
        lastGuess: game.lastGuess,
        distance: distance / 1000, // send in km
        roundPoints: points,
    });

    // Wait for a few seconds, then start the next round
    setTimeout(() => {
        startRound(gameId);
    }, ROUND_DELAY);
}

function endGame(gameId) {
    const game = games[gameId];
    if (!game) return;

    game.phase = 'GAME_END';

    const p1 = game.players[game.playerOrder[0]];
    const p2 = game.players[game.playerOrder[1]];
    
    let winnerId = null;
    let isDraw = false;

    if (p1.score > p2.score) {
        winnerId = p1.id;
    } else if (p2.score > p1.score) {
        winnerId = p2.id;
    } else {
        isDraw = true;
    }
    
    console.log(`[${gameId}] Game ended. Winner: ${winnerId}, Draw: ${isDraw}`);

    io.to(gameId).emit('game_end', { winnerId, isDraw });
    
    // Clean up the game room after a short delay
    setTimeout(() => {
        delete games[gameId];
    }, 10000);
}


// --- Socket.IO Connection Handler ---
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_game', ({ gameId }) => {
        gameId = gameId.toUpperCase();
        
        let game = games[gameId];
        if (!game) {
            game = createNewGame(gameId);
            games[gameId] = game;
        }

        const numPlayers = Object.keys(game.players).length;
        if (numPlayers >= 2) {
            socket.emit('error_message', { message: 'This game room is full.' });
            return;
        }

        socket.join(gameId);
        game.players[socket.id] = { id: socket.id, name: `Player ${numPlayers + 1}`, score: 0 };
        game.playerOrder.push(socket.id);

        console.log(`[${gameId}] Player ${socket.id} joined. Total players: ${numPlayers + 1}`);

        if (Object.keys(game.players).length === 2) {
            startRound(gameId); // This will also emit the first game state
        } else {
            emitGameState(gameId); // Update waiting screen for the first player
        }
    });

    socket.on('set_location', ({ gameId, location, radius, hint }) => {
        const game = games[gameId];
        if (!game || socket.id !== game.setterId || game.phase !== 'SETTING') return;
        
        // Ellipse parameters
        const radiusX = radius * 1.5;
        const radiusY = radius;
        const rotation = Math.random() * Math.PI; // random rotation in radians

        game.actualLocation = { lat: location[0], lon: location[1] };
        game.hint = {
            center: location,
            radius: radius, // keep for reference
            radiusX: radiusX,
            radiusY: radiusY,
            rotation: rotation,
            message: hint
        };
        game.phase = 'GUESSING';
        
        console.log(`[${gameId}] Location set by ${socket.id} with hint: ${hint}, ellipse: (${radiusX}, ${radiusY}, ${rotation})`);
        emitGameState(gameId);
    });

    socket.on('make_guess', ({ gameId, location }) => {
        const game = games[gameId];
        if (!game || socket.id !== game.guesserId || game.phase !== 'GUESSING') return;
        
        game.attemptsLeft--;
        game.lastGuess = location;
        
        const guess = { lat: location[0], lon: location[1] };
        const distance = haversine(guess, game.actualLocation);

        console.log(`[${gameId}] Guess made by ${socket.id}. Distance: ${distance.toFixed(2)}m. Attempts left: ${game.attemptsLeft}`);

        // Emit result of the guess back to the guesser only
        socket.emit('guess_result', {
            distance: distance / 1000, // km
            attemptsLeft: game.attemptsLeft,
            guessLocation: location
        });

        // End round if guess is very close or no attempts left
        if (distance <= 50 || game.attemptsLeft <= 0) {
            endRound(gameId, distance);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Find which game the user was in and handle their departure
        for (const gameId in games) {
            const game = games[gameId];
            if (game.players[socket.id]) {
                console.log(`[${gameId}] Player ${socket.id} disconnected.`);
                // Notify the other player
                io.to(gameId).emit('error_message', { message: 'Your opponent has disconnected. The game is over.' });
                // Clean up the game
                delete games[gameId];
                break;
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on *:${PORT}`);
});