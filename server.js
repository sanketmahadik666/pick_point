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
let socketToGame = {}; // { socketId: gameId } - O(1) lookup

const MAX_ROUNDS = 6;
const ROUND_DELAY = 5000; // 5 seconds between rounds

// --- Game Class with State Machine ---
class Game {
    constructor(gameId, io) {
        this.gameId = gameId;
        this.io = io;
        this.players = {}; // { socketId: { id, name, score } }
        this.playerOrder = [];
        this.round = 0;
        this.maxRounds = MAX_ROUNDS;
        this.phase = 'WAITING'; // WAITING, SETTING, GUESSING, ROUND_END, GAME_END
        this.setterId = null;
        this.guesserId = null;
        this.actualLocation = null;
        this.hint = null;
        this.attemptsLeft = 3;
        this.lastGuess = null;
    }

    transitionTo(newPhase) {
        console.log(`[${this.gameId}] Transition: ${this.phase} -> ${newPhase}`);
        this.phase = newPhase;
    }

    addPlayer(socket) {
        const numPlayers = Object.keys(this.players).length;
        if (numPlayers >= 2) return false;

        this.players[socket.id] = { id: socket.id, name: `Player ${numPlayers + 1}`, score: 0 };
        this.playerOrder.push(socket.id);
        socket.join(this.gameId);
        
        console.log(`[${this.gameId}] Player ${socket.id} joined. Total: ${numPlayers + 1}`);
        
        if (Object.keys(this.players).length === 2) {
            this.startRound();
        } else {
            this.emitGameState();
        }
        return true;
    }

    startRound() {
        if (this.round >= this.maxRounds) {
            this.endGame();
            return;
        }

        this.round++;
        this.transitionTo('SETTING');
        this.attemptsLeft = 3;
        this.actualLocation = null;
        this.hint = null;
        this.lastGuess = null;

        const setterIndex = (this.round - 1) % 2;
        this.setterId = this.playerOrder[setterIndex];
        this.guesserId = this.playerOrder[1 - setterIndex];
        
        this.emitGameState();
    }

    setLocation(socketId, location, radius, hint) {
        if (socketId !== this.setterId || this.phase !== 'SETTING') return;
        
        const radiusX = radius * 1.5;
        const radiusY = radius;
        const rotation = Math.random() * Math.PI;

        this.actualLocation = { lat: location[0], lon: location[1] };
        this.hint = {
            center: location,
            radius: radius,
            radiusX: radiusX,
            radiusY: radiusY,
            rotation: rotation,
            message: hint
        };
        this.transitionTo('GUESSING');
        
        console.log(`[${this.gameId}] Location set.`);
        this.emitGameState();
    }

    makeGuess(socketId, location) {
        if (socketId !== this.guesserId || this.phase !== 'GUESSING') return;
        
        this.attemptsLeft--;
        this.lastGuess = location;
        
        const guess = { lat: location[0], lon: location[1] };
        const distance = haversine(guess, this.actualLocation);

        console.log(`[${this.gameId}] Guess: ${distance.toFixed(2)}m. Attempts: ${this.attemptsLeft}`);

        // Emit result only to guesser
        this.io.to(socketId).emit('guess_result', {
            distance: distance / 1000,
            attemptsLeft: this.attemptsLeft,
            guessLocation: location
        });

        if (distance <= 50 || this.attemptsLeft <= 0) {
            this.endRound(distance);
        }
    }

    calculatePoints(distance) {
        if (distance <= 50) return 5000;
        if (distance > 1500000) return 0;
        const points = 5000 - Math.floor(Math.log(distance) * 500);
        return Math.max(0, points);
    }

    endRound(distance) {
        this.transitionTo('ROUND_END');
        const points = this.calculatePoints(distance);
        this.players[this.guesserId].score += points;

        this.io.to(this.gameId).emit('round_end', {
            actualLocation: [this.actualLocation.lat, this.actualLocation.lon],
            lastGuess: this.lastGuess,
            distance: distance / 1000,
            roundPoints: points,
        });

        setTimeout(() => {
            // Check if game still exists before starting next round
            if (games[this.gameId]) {
                this.startRound();
            }
        }, ROUND_DELAY);
    }

    endGame() {
        this.transitionTo('GAME_END');
        const p1 = this.players[this.playerOrder[0]];
        const p2 = this.players[this.playerOrder[1]];
        
        let winnerId = null;
        let isDraw = false;

        if (p1.score > p2.score) winnerId = p1.id;
        else if (p2.score > p1.score) winnerId = p2.id;
        else isDraw = true;

        this.io.to(this.gameId).emit('game_end', { winnerId, isDraw });
        
        setTimeout(() => {
            this.cleanup();
        }, 10000);
    }

    cleanup() {
        if (games[this.gameId]) {
             Object.keys(this.players).forEach(pid => {
                 delete socketToGame[pid];
             });
             delete games[this.gameId];
             console.log(`[${this.gameId}] Game cleaned up.`);
        }
    }

    getSanitizedState(playerId) {
        const state = {
            gameId: this.gameId,
            players: this.players,
            round: this.round,
            maxRounds: this.maxRounds,
            phase: this.phase,
            setterId: this.setterId,
            guesserId: this.guesserId,
            hint: this.hint,
            attemptsLeft: this.attemptsLeft,
            lastGuess: this.lastGuess,
            role: null // will be set by client or we could set it here
        };
        
        if (state.phase === 'GUESSING' && state.guesserId === playerId) {
            // No actual location for guesser
        } else if (state.phase === 'ROUND_END' || state.phase === 'GAME_END') {
             // everyone can see location
             state.actualLocation = this.actualLocation;
        }
        // Note: We don't send actualLocation in SETTING or GUESSING normally unless round end
        
        return state;
    }

    emitGameState() {
        Object.keys(this.players).forEach(playerId => {
            this.io.to(playerId).emit('game_state', this.getSanitizedState(playerId));
        });
    }
}


// --- Socket.IO Connection Handler ---
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_game', ({ gameId }) => {
        gameId = gameId.toUpperCase();
        
        let game = games[gameId];
        if (!game) {
            game = new Game(gameId, io);
            games[gameId] = game;
        }

        const added = game.addPlayer(socket);
        if (added) {
            socketToGame[socket.id] = gameId;
        } else {
            socket.emit('error_message', { message: 'This game room is full.' });
        }
    });

    socket.on('set_location', ({ gameId, location, radius, hint }) => {
        const game = games[gameId];
        if (game) {
            game.setLocation(socket.id, location, radius, hint);
        }
    });

    socket.on('make_guess', ({ gameId, location }) => {
        const game = games[gameId];
        if (game) {
            game.makeGuess(socket.id, location);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const gameId = socketToGame[socket.id];
        if (gameId) {
            const game = games[gameId];
            if (game) {
                game.removePlayer(socket.id); // This will handle cleanup trigger if needed
                game.cleanup();
            }
            delete socketToGame[socket.id];
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on *:${PORT}`);
});