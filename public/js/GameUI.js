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
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            let container = document.getElementById('round-progress-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'round-progress-container';
                container.className = 'round-progress';
                const h1 = document.querySelector('#game-controls h1');
                if (h1) h1.after(container);
            }
            
            // Use DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            for (let i = 1; i <= maxRounds; i++) {
                const dot = document.createElement('div');
                dot.className = 'round-dot';
                if (i < currentRound) dot.classList.add('completed');
                else if (i === currentRound) dot.classList.add('active');
                fragment.appendChild(dot);
            }
            container.innerHTML = '';
            container.appendChild(fragment);
        });
    }

    updatePlayerCards(players, setterId) {
        // Batch DOM updates with requestAnimationFrame
        requestAnimationFrame(() => {
            const playerIds = Object.keys(players);
            const player2Column = document.querySelector('#player-info .column:last-child');
            
            if (playerIds.length > 0) {
                const p1 = players[playerIds[0]];
                const p1Name = document.getElementById('player1-name');
                const p1Score = document.getElementById('player1-score');
                const p1Card = document.getElementById('player1');
                
                if (p1Name) p1Name.textContent = p1.name;
                if (p1Score) p1Score.textContent = `Score: ${p1.score}`;
                if (p1Card) p1Card.classList.toggle('active', setterId === playerIds[0]);
            }
            if (playerIds.length > 1) {
                const p2 = players[playerIds[1]];
                const p2Name = document.getElementById('player2-name');
                const p2Score = document.getElementById('player2-score');
                const p2Card = document.getElementById('player2');
                
                if (p2Name) p2Name.textContent = p2.name;
                if (p2Score) p2Score.textContent = `Score: ${p2.score}`;
                if (p2Card) p2Card.classList.toggle('active', setterId === playerIds[1]);
                // Show player 2 column (Bulma structure)
                if (player2Column) {
                    player2Column.classList.remove('is-hidden', 'hidden');
                }
            } else {
                // Hide player 2 column (Bulma structure)
                if (player2Column) {
                    player2Column.classList.add('is-hidden', 'hidden');
                }
            }
        });
    }

    toggleScreen(inGame) {
        this.joinControls.classList.toggle('hidden', inGame);
        this.gameInfo.classList.toggle('hidden', !inGame);
        if(!inGame) this.setterControls.classList.add('hidden');
    }

    showFunFact(text) {
        const container = document.getElementById('fun-fact');
        if (!text) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(() => {
            container.style.display = 'block';
            // Use DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            const h3 = document.createElement('h3');
            h3.textContent = 'Did You Know?';
            const p = document.createElement('p');
            p.textContent = text;
            fragment.appendChild(h3);
            fragment.appendChild(p);
            container.appendChild(fragment);
            
            // Only animate on non-mobile or if reduced motion not preferred
            const isMobile = window.innerWidth <= 768;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (!isMobile && !prefersReducedMotion) {
                container.style.animation = 'none';
                container.offsetHeight; /* trigger reflow */
                container.style.animation = 'cardPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
        });
    }

    showQuiz(data) {
        const container = document.getElementById('quiz');
        if (!data) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(() => {
            container.style.display = 'block';
            
            // Use DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            const h3 = document.createElement('h3');
            h3.textContent = 'Quick Quiz!';
            const p = document.createElement('p');
            p.className = 'question';
            p.textContent = data.question;
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options';
            
            data.options.forEach((opt, index) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = opt;
                btn.onclick = () => ui.handleQuizAnswer(index, data.correctIndex, btn);
                optionsDiv.appendChild(btn);
            });
            
            const feedbackDiv = document.createElement('div');
            feedbackDiv.id = 'quiz-feedback';
            
            fragment.appendChild(h3);
            fragment.appendChild(p);
            fragment.appendChild(optionsDiv);
            fragment.appendChild(feedbackDiv);
            container.appendChild(fragment);
            
            // Only animate on non-mobile or if reduced motion not preferred
            const isMobile = window.innerWidth <= 768;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (!isMobile && !prefersReducedMotion) {
                container.style.animation = 'none';
                container.offsetHeight; /* trigger reflow */
                container.style.animation = 'cardPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards';
            }
        });
    }

    handleQuizAnswer(selectedIndex, correctIndex, btnElement) {
        const feedback = document.getElementById('quiz-feedback');
        const buttons = document.querySelectorAll('.quiz-btn');
        
        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);

        if (selectedIndex === correctIndex) {
            btnElement.classList.add('correct');
            feedback.innerHTML = '<span class="success-text">Correct! +50pts</span>';
            // Emit to server for score update
            if (window.socket && gameState.gameId) {
                window.socket.emit('quiz_answer', {
                    gameId: gameState.gameId,
                    selectedIndex: selectedIndex,
                    correctIndex: correctIndex
                });
            }
        } else {
            btnElement.classList.add('wrong');
            buttons[correctIndex].classList.add('correct'); // Show right answer
            feedback.innerHTML = '<span class="error-text">Oof! So close.</span>';
            // Still emit to server
            if (window.socket && gameState.gameId) {
                window.socket.emit('quiz_answer', {
                    gameId: gameState.gameId,
                    selectedIndex: selectedIndex,
                    correctIndex: correctIndex
                });
            }
        }
    }
}
