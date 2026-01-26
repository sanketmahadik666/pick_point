// GameManager (Singleton)
class GameManager {
    constructor() {
        this.games = {};
        this.socketToGame = {};
    }

    getGame(gameId) {
        return this.games[gameId];
    }

    createGame(gameId, gameInstance) {
        this.games[gameId] = gameInstance;
    }
    
    removeGame(gameId) {
        delete this.games[gameId];
    }

    getGameIdBySocket(socketId) {
        return this.socketToGame[socketId];
    }

    mapSocketToGame(socketId, gameId) {
        this.socketToGame[socketId] = gameId;
    }

    removePlayerMapping(socketId) {
        delete this.socketToGame[socketId];
    }
}

const manager = new GameManager();

function getGameManager() {
    return manager;
}

module.exports = {
    getGameManager
};
