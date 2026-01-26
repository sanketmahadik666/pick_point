// --- Command Pattern: User Actions ---
class Command {
    constructor(game, socket, data) {
        this.game = game;
        this.socket = socket;
        this.data = data;
    }
    execute() {
        throw new Error("Method 'execute' must be implemented.");
    }
}

class SetLocationCommand extends Command {
    execute() {
        this.game.setLocation(this.socket.id, this.data.location, this.data.radius, this.data.hint);
    }
}

class MakeGuessCommand extends Command {
    execute() {
        this.game.makeGuess(this.socket.id, this.data.location);
    }
}

module.exports = {
    Command,
    SetLocationCommand,
    MakeGuessCommand
};
