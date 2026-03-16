const haversine = require('haversine-distance');
const { LogarithmicScoring } = require('../utils/Scoring');
const { getGameManager } = require('./GameManager');
const { fetchFunFact, getCountry, generateCountryQuiz } = require('../utils/LocationData');

const MAX_ROUNDS = 6;
const ROUND_DELAY = 5000;

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
        this.scoringStrategy = new LogarithmicScoring(); // Default strategy
    }

    setScoringStrategy(strategy) {
        this.scoringStrategy = strategy;
    }
    
    // Observer Pattern: Notify players
    notifyPlayers(event, data) {
         Object.keys(this.players).forEach(playerId => {
            this.io.to(playerId).emit(event, data);
        });
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
    
    removePlayer(socketId) {
        if (this.players[socketId]) {
            delete this.players[socketId];
            this.playerOrder = this.playerOrder.filter(id => id !== socketId);
        }
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
            guessLocation: location,
            // Optionally expand hint radius on each guess (progressive difficulty)
            newHintRadius: this.hint ? this.hint.radius * 1.2 : null
        });

        if (distance <= 50 || this.attemptsLeft <= 0) {
            this.endRound(distance).catch(err => {
                console.error(`[${this.gameId}] Error in endRound:`, err);
            });
        }
    }

    calculatePoints(distance) {
        return this.scoringStrategy.calculate(distance);
    }

    async endRound(distance) {
        this.transitionTo('ROUND_END');
        const points = this.calculatePoints(distance);
        this.players[this.guesserId].score += points;

        const actualLoc = [this.actualLocation.lat, this.actualLocation.lon];
        
        // Emit round end data
        this.io.to(this.gameId).emit('round_end', {
            actualLocation: actualLoc,
            lastGuess: this.lastGuess,
            distance: distance / 1000,
            roundPoints: points,
        });

        // Fetch and emit fun fact (async, non-blocking)
        fetchFunFact(this.actualLocation.lat, this.actualLocation.lon)
            .then(fact => {
                if (fact) {
                    this.io.to(this.gameId).emit('fun_fact', { text: fact });
                }
            })
            .catch(() => {}); // Silently fail if fetch fails

        // Generate and emit quiz (70% chance)
        if (Math.random() < 0.7) {
            getCountry(this.actualLocation.lat, this.actualLocation.lon)
                .then(country => {
                    if (country) {
                        const quiz = generateCountryQuiz(country);
                        this.io.to(this.gameId).emit('quiz', quiz);
                    }
                })
                .catch(() => {}); // Silently fail if fetch fails
        }

        setTimeout(() => {
            // Check if game still exists before starting next round
            const manager = getGameManager();
            if (manager.getGame(this.gameId)) {
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
        const manager = getGameManager();
        if (manager.getGame(this.gameId)) {
             Object.keys(this.players).forEach(pid => {
                 manager.removePlayerMapping(pid);
             });
             manager.removeGame(this.gameId);
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
        
        return state;
    }

    emitGameState() {
        Object.keys(this.players).forEach(playerId => {
            this.io.to(playerId).emit('game_state', this.getSanitizedState(playerId));
        });
    }
}

module.exports = { Game };
