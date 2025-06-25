// webSocketManager.js
let ws, onMessageCallback, gameIdGlobal;

export function connect(gameId) {
    gameIdGlobal = gameId;
    // Listen for localStorage events for multiplayer simulation
    window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('multiplayer-msg-')) {
            try {
                const msg = JSON.parse(event.newValue);
                if (msg && msg.gameId === gameIdGlobal && onMessageCallback) {
                    // Don't process messages sent from this tab
                    if (msg.senderId !== getSenderId()) {
                        onMessageCallback(msg.data);
                    }
                }
            } catch {}
        }
    });
}

export function send(data) {
    // Simulate multiplayer by writing to localStorage
    const msg = {
        gameId: gameIdGlobal,
        data,
        senderId: getSenderId(),
        timestamp: Date.now()
    };
    localStorage.setItem('multiplayer-msg-' + Math.random(), JSON.stringify(msg));
}

export function onMessage(cb) {
    onMessageCallback = cb;
}

function getSenderId() {
    // Unique per tab
    if (!window._multiplayer_sender_id) {
        window._multiplayer_sender_id = Math.random().toString(36).slice(2);
    }
    return window._multiplayer_sender_id;
} 