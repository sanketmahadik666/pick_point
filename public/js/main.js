const socket = io();
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
    
    // Phase 0: Initial State (Active Body Zoom)
    document.body.classList.add('entry-active');
    
    // Phase 1: The Realization (Text constructs itself via CSS animation)
    // We wait 2.0s for the text to fully form and shimmer
    
    setTimeout(() => {
        // Phase 2: The Lift (Curtain rises)
        cinemaOverlay.setAttribute('data-state', 'exited');
        
        // Phase 3: The Clarity (Body settles)
        setTimeout(() => {
            document.body.classList.remove('entry-active');
            document.body.classList.add('entry-complete');
            
            // Cleanup (Optional: remove from DOM if performance is a concern, 
            // but keeping it allows for potential re-entry effects later)
            // cinemaOverlay.style.display = 'none'; 
        }, 1200); // Matches the curtain transition time + buffer
        
    }, 3000); // Allow 3.0s for the initial "Eureka" moment

    mapFacade.initialize();
    
    document.getElementById('join-game-btn').addEventListener('click', () => {
        const gameId = document.getElementById('game-id-input').value.trim().toUpperCase();
        if (!gameId) {
            ui.showPrompt("Please enter a Game ID.", 'error');
            return;
        }
        ui.showPrompt("Connecting to the game world...", 'loading');
        socket.emit('join_game', { gameId });
    });

    document.getElementById('set-location-btn').addEventListener('click', () => {
        if (!mapFacade.tempMarker) return;
        const loc = mapFacade.tempMarker.getLatLng();
        const radius = document.getElementById('radius-slider').value * 1000;
        const hint = document.getElementById('hint-input').value.trim();
        
        socket.emit('set_location', {
            gameId: gameState.gameId,
            location: [loc.lat, loc.lng],
            radius: radius,
            hint: hint
        });
        ui.showPrompt("Location secured! Waiting for the explorer...", 'success');
    });

    mapFacade.onClick((e) => {
        const { lat, lng } = e.latlng;
        // Logic depends on state
        if (gameState.phase === 'SETTING' && gameState.role === 'Setter') {
            mapFacade.addMarker(lat, lng, true);
            document.getElementById('set-location-btn').disabled = false;
            ui.showPrompt("Spot selected. Confirm to lock it in.", 'info');
        } else if (gameState.phase === 'GUESSING' && gameState.role === 'Guesser' && gameState.attemptsLeft > 0) {
            ui.showPrompt("Calculated guess commencing...", 'loading');
            socket.emit('make_guess', { gameId: gameState.gameId, location: [lat, lng] });
        }
    });
});

// --- Socket Events ---
socket.on('connect', () => {
    gameState.playerId = socket.id;
});

socket.on('game_state', (state) => {
    Object.assign(gameState, state);
    gameState.playerId = socket.id;
    
    // Determine Role
    if (gameState.setterId === gameState.playerId) gameState.role = 'Setter';
    else if (gameState.guesserId === gameState.playerId) gameState.role = 'Guesser';
    else gameState.role = 'Spectator';

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
         if (gameState.hint) {
             mapFacade.drawEllipse(gameState.hint.center, gameState.hint.radiusX, gameState.hint.radiusY, gameState.hint.rotation);
         }
         if (gameState.role === 'Guesser') {
             ui.showPrompt(`Make your guess! Attempts left: ${gameState.attemptsLeft}`, 'info');
         } else {
             ui.showPrompt(`Waiting for guess...`, 'loading');
         }
    }
});

socket.on('guess_result', (data) => {
    mapFacade.addMarker(data.guessLocation[0], data.guessLocation[1]);
    gameState.attemptsLeft = data.attemptsLeft;
    ui.showPrompt(`Guess recorded. ${data.distance}km away. Attempts: ${data.attemptsLeft}`, 'info');
});

socket.on('round_end', (data) => {
    mapFacade.showActualLocation(data.actualLocation, data.lastGuess);
    ui.showPrompt(`Round complete! Distance: ${data.distance}km. Points: ${data.roundPoints}`, 'success');
});

socket.on('game_end', (data) => {
    ui.showPrompt(data.isDraw ? "It's a draw!" : "We have a winner!", 'success');
});

socket.on('error_message', (data) => {
    ui.showPrompt(data.message, 'error');
});
