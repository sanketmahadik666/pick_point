const socket = io();
window.socket = socket; // Make socket globally accessible for quiz handler
const mapFacade = new MapFacade('map');
const ui = new GameUI();
const storyManager = new StoryManager();

let gameState = {
    gameId: null,
    playerId: null,
    role: null
};

// --- Initialization ---
window.addEventListener('DOMContentLoaded', () => {
    // --- The Dawn of Discovery: Entry Sequence ---
    const cinemaOverlay = document.getElementById('cinema-overlay');
    const isMobile = window.innerWidth <= 768;
    const isLowEnd = window.innerWidth <= 480;
    
    // Reduce entry animation time on mobile
    const entryDelay = isMobile ? 2000 : 3000;
    const exitDelay = isMobile ? 800 : 1200;
    
    // Phase 0: Initial State (Active Body Zoom)
    requestAnimationFrame(() => {
        document.body.classList.add('entry-active');
    });
    
    // Phase 1: The Realization (Text constructs itself via CSS animation)
    // We wait for the text to fully form and shimmer
    
    setTimeout(() => {
        // Phase 2: The Lift (Curtain rises)
        requestAnimationFrame(() => {
            if (cinemaOverlay) {
                cinemaOverlay.setAttribute('data-state', 'exited');
            }
        });
        
        // Phase 3: The Clarity (Body settles)
        setTimeout(() => {
            requestAnimationFrame(() => {
                document.body.classList.remove('entry-active');
                document.body.classList.add('entry-complete');
                
                // On low-end devices, remove overlay from DOM after exit
                if (isLowEnd && cinemaOverlay) {
                    setTimeout(() => {
                        cinemaOverlay.style.display = 'none';
                    }, 1000);
                }
            });
        }, exitDelay);
        
    }, entryDelay);

    // Initialize map with requestAnimationFrame
    requestAnimationFrame(() => {
        mapFacade.initialize();
    });
    
    document.getElementById('join-game-btn').addEventListener('click', () => {
        const gameId = document.getElementById('game-id-input').value.trim().toUpperCase();
        if (!gameId) {
            ui.showPrompt("Please enter a Game ID.", 'error');
            return;
        }
        // Use requestAnimationFrame for smooth UI update
        requestAnimationFrame(() => {
            ui.showPrompt("Connecting to the game world...", 'loading');
            socket.emit('join_game', { gameId });
        });
    });

    document.getElementById('set-location-btn').addEventListener('click', () => {
        if (!mapFacade.tempMarker) return;
        const loc = mapFacade.tempMarker.getLatLng();
        const radius = document.getElementById('radius-slider').value * 1000;
        const hint = document.getElementById('hint-input').value.trim();
        
        // Batch operations
        requestAnimationFrame(() => {
            socket.emit('set_location', {
                gameId: gameState.gameId,
                location: [loc.lat, loc.lng],
                radius: radius,
                hint: hint
            });
            ui.showPrompt("Location secured! Waiting for the explorer...", 'success');
        });
    });

    mapFacade.onClick((e) => {
        const { lat, lng } = e.latlng;
        // Batch DOM updates
        requestAnimationFrame(() => {
            // Logic depends on state
            if (gameState.phase === 'SETTING' && gameState.role === 'Setter') {
                mapFacade.addMarker(lat, lng, true);
                const setBtn = document.getElementById('set-location-btn');
                if (setBtn) setBtn.disabled = false;
                ui.showPrompt("Spot selected. Confirm to lock it in.", 'info');
            } else if (gameState.phase === 'GUESSING' && gameState.role === 'Guesser' && gameState.attemptsLeft > 0) {
                ui.showPrompt("Calculated guess commencing...", 'loading');
                socket.emit('make_guess', { gameId: gameState.gameId, location: [lat, lng] });
            }
        });
    });
});

// --- Socket Events ---
socket.on('connect', () => {
    gameState.playerId = socket.id;
});

// Throttle UI updates for performance
let lastUpdateTime = 0;
const UPDATE_THROTTLE = 100; // ms

socket.on('game_state', (state) => {
    const now = Date.now();
    if (now - lastUpdateTime < UPDATE_THROTTLE) {
        requestAnimationFrame(() => {
            updateGameState(state);
        });
    } else {
        updateGameState(state);
        lastUpdateTime = now;
    }
});

function updateGameState(state) {
    Object.assign(gameState, state);
    gameState.playerId = socket.id;
    
    // Determine Role
    if (gameState.setterId === gameState.playerId) gameState.role = 'Setter';
    else if (gameState.guesserId === gameState.playerId) gameState.role = 'Guesser';
    else gameState.role = 'Spectator';

    // Batch DOM updates
    requestAnimationFrame(() => {
        ui.toggleScreen(true);
        ui.updatePlayerCards(gameState.players, gameState.setterId);
        
        // Handle Phases
        if (gameState.phase === 'WAITING') {
            ui.showPrompt('Waiting for an opponent to join the adventure...', 'loading');
        } else if (gameState.phase === 'SETTING') {
             ui.updateRoundProgress(gameState.round, gameState.maxRounds);
             mapFacade.clearLayers();
             if (gameState.role === 'Setter') {
                 document.getElementById('setter-controls').classList.remove('hidden');
                 ui.showPrompt('Choose a secret location.', 'info');
             } else {
                 document.getElementById('setter-controls').classList.add('hidden');
                 ui.showPrompt(`${gameState.players[gameState.setterId].name} is scouting...`, 'loading');
             }
        } else if (gameState.phase === 'GUESSING') {
             document.getElementById('setter-controls').classList.add('hidden');
             mapFacade.clearLayers();
             if (gameState.hint) {
                 mapFacade.drawEllipse(gameState.hint.center, gameState.hint.radiusX, gameState.hint.radiusY, gameState.hint.rotation);
             }
             if (gameState.role === 'Guesser') {
                 const hintText = gameState.hint?.message ? `Hint: ${gameState.hint.message} | ` : '';
                 ui.showPrompt(`${hintText}Make your guess! Attempts left: ${gameState.attemptsLeft}`, 'info');
             } else {
                 ui.showPrompt(`Waiting for guess...`, 'loading');
             }
        } else if (gameState.phase === 'ROUND_END') {
             document.getElementById('setter-controls').classList.add('hidden');
        } else if (gameState.phase === 'GAME_END') {
             document.getElementById('setter-controls').classList.add('hidden');
        }
    });
}

socket.on('guess_result', (data) => {
    // Batch DOM updates
    requestAnimationFrame(() => {
        mapFacade.addMarker(data.guessLocation[0], data.guessLocation[1]);
        gameState.attemptsLeft = data.attemptsLeft;
        const distanceText = data.distance < 1 
            ? `${(data.distance * 1000).toFixed(0)}m` 
            : `${data.distance.toFixed(2)}km`;
        ui.showPrompt(`Guess recorded. ${distanceText} away. Attempts: ${data.attemptsLeft}`, 'info');
        
        // Update hint ellipse if radius changed (throttle expensive operation)
        if (data.newHintRadius && gameState.hint) {
            requestAnimationFrame(() => {
                mapFacade.drawEllipse(
                    gameState.hint.center, 
                    data.newHintRadius * 1.5, 
                    data.newHintRadius, 
                    gameState.hint.rotation
                );
            });
        }
    });
});

socket.on('round_end', (data) => {
    // Batch expensive operations
    requestAnimationFrame(() => {
        mapFacade.showActualLocation(data.actualLocation, data.lastGuess);
        ui.showPrompt(`Round complete! Distance: ${data.distance.toFixed(2)}km. Points: ${data.roundPoints}`, 'success');
        requestAnimationFrame(() => {
            ui.updatePlayerCards(gameState.players, gameState.setterId);
        });
    });
});

socket.on('game_end', (data) => {
    const winner = data.winnerId && gameState.players[data.winnerId] 
        ? gameState.players[data.winnerId].name 
        : 'No one';
    const message = data.isDraw 
        ? "It's a draw! What an adventure!" 
        : `${winner} wins! Congratulations!`;
    ui.showPrompt(message, 'success');
    ui.updatePlayerCards(gameState.players, null);
});

socket.on('quiz_result', (data) => {
    if (data.correct) {
        // Score update will come via game_state
        console.log(`Quiz bonus: +${data.points} points`);
    }
});

socket.on('error_message', (data) => {
    ui.showPrompt(data.message, 'error');
});

// --- New VIVELE Features ---
socket.on('quiz', (data) => {
    // Expected data: { question: "...", options: ["A", "B"], correctIndex: 0 }
    ui.showQuiz(data);
});

socket.on('fun_fact', (data) => {
    // Expected data: { text: "Did you know..." }
    ui.showFunFact(data.text);
});
