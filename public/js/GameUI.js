// GameUI.js: Handles UI components and interactions
class GameUI {
    constructor() {
        this.promptEl = document.getElementById('prompt');
        this.gameInfo = document.getElementById('game-info');
        this.joinControls = document.getElementById('join-controls');
        this.setterControls = document.getElementById('setter-controls');
        this.roundContainer = null;
    }

    showPrompt(message, type = 'info') {
        this.promptEl.textContent = message;
        this.promptEl.className = '';
        if (type !== 'info') {
            this.promptEl.classList.add(type);
        }
    }

    updateRoundProgress(currentRound, maxRounds) {
        let container = document.getElementById('round-progress-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'round-progress-container';
            container.className = 'round-progress';
            document.querySelector('#game-controls h1').after(container);
        }
        
        container.innerHTML = '';
        for (let i = 1; i <= maxRounds; i++) {
            const dot = document.createElement('div');
            dot.className = 'round-dot';
            if (i < currentRound) dot.classList.add('completed');
            else if (i === currentRound) dot.classList.add('active');
            container.appendChild(dot);
        }
    }

    updatePlayerCards(players, setterId) {
        const playerIds = Object.keys(players);
         if (playerIds.length > 0) {
            const p1 = players[playerIds[0]];
            document.getElementById('player1-name').textContent = p1.name;
            document.getElementById('player1-score').textContent = `Score: ${p1.score}`;
            document.getElementById('player1').classList.toggle('active', setterId === playerIds[0]);
        }
        if (playerIds.length > 1) {
            const p2 = players[playerIds[1]];
            document.getElementById('player2-name').textContent = p2.name;
            document.getElementById('player2-score').textContent = `Score: ${p2.score}`;
            document.getElementById('player2').classList.toggle('active', setterId === playerIds[1]);
            document.getElementById('player2').classList.remove('hidden');
        } else {
             document.getElementById('player2').classList.add('hidden');
        }
    }

    toggleScreen(inGame) {
        this.joinControls.classList.toggle('hidden', inGame);
        this.gameInfo.classList.toggle('hidden', !inGame);
        if(!inGame) this.setterControls.classList.add('hidden');
    }
}
