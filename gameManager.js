// gameManager.js
import * as mapManager from './mapManager.js';
import * as wsManager from './webSocketManager.js';

let gameId = '', role = '', hiderLocation = null, seekerGuess = null, joined = false;
let hiderAddress = '';
const WIN_RADIUS = 500; // meters

export function onMapReady() {
    document.getElementById('joinGameBtn').onclick = joinGame;
    document.getElementById('confirmLocationBtn').onclick = confirmLocation;
    document.getElementById('guessLocationBtn').onclick = guessLocation;
    document.getElementById('roleSelect').onchange = updateRoleUI;
    updateRoleUI();
    setStatus('Enter a Game ID and select your role to start!');
}

function updateRoleUI() {
    const role = document.getElementById('roleSelect').value;
    document.getElementById('hiderActions').style.display = (role === 'hider') ? '' : 'none';
    document.getElementById('seekerActions').style.display = (role === 'seeker') ? '' : 'none';
}

function setStatus(msg) {
    document.getElementById('gameStatus').textContent = msg;
}

export function onMapClick(latlng) {
    if (!joined) return;
    if (role === 'hider') {
        hiderLocation = latlng;
        mapManager.setHiderLocation(latlng);
        setStatus('Getting address...');
        reverseGeocode(latlng).then(addr => {
            hiderAddress = addr || 'Unknown location';
            document.getElementById('hiderLocationInfo').textContent = hiderAddress + `\n(${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)})`;
            document.getElementById('hiderLocationInfo').style.display = '';
            document.getElementById('confirmLocationBtn').style.display = '';
            setStatus('Confirm your location or pick another spot.');
        });
    } else if (role === 'seeker') {
        seekerGuess = latlng;
        mapManager.setSeekerGuess(latlng, WIN_RADIUS);
    }
}

function joinGame() {
    gameId = document.getElementById('gameIdInput').value.trim();
    role = document.getElementById('roleSelect').value;
    if (!gameId) return setStatus('Enter a game ID!');
    wsManager.connect(gameId);
    wsManager.onMessage(handleMessage);
    joined = true;
    document.getElementById('confirmLocationBtn').style.display = 'none';
    document.getElementById('hiderLocationInfo').style.display = 'none';
    document.getElementById('guessLocationBtn').style.display = (role === 'seeker') ? '' : 'none';
    document.getElementById('joinGameBtn').disabled = true;
    setStatus(role === 'hider' ? 'Click on the map to choose your secret spot.' : 'Wait for the hider to set a location.');
}

function confirmLocation() {
    if (!hiderLocation) return setStatus('Click on the map to set your location!');
    wsManager.send({ type: 'hider-location', gameId, latlng: hiderLocation, address: hiderAddress });
    setStatus('Location set! Waiting for seeker to guess.');
    document.getElementById('confirmLocationBtn').style.display = 'none';
}

async function reverseGeocode(latlng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.display_name) return data.display_name;
    } catch (e) { }
    return null;
}

function guessLocation() {
    if (!seekerGuess) return setStatus('Click on the map to make your guess!');
    wsManager.send({ type: 'seeker-guess', gameId, latlng: seekerGuess });
    setStatus('Guess sent! Waiting for result...');
}

function handleMessage(msg) {
    if (msg.type === 'hider-location' && role === 'seeker') {
        hiderLocation = msg.latlng;
        hiderAddress = msg.address;
        mapManager.setFlagMarker(hiderLocation); // Show flag for seeker
        setStatus('Hider has set a location! Find the flag and click on the map to make your guess.');
    }
    if (msg.type === 'seeker-guess' && role === 'hider') {
        seekerGuess = msg.latlng;
        mapManager.setSeekerGuess(seekerGuess, WIN_RADIUS);
        // Check win
        const dist = getDistance(hiderLocation, seekerGuess);
        if (dist <= WIN_RADIUS) {
            setStatus('Seeker found the spot! 🎉');
        } else {
            setStatus('Seeker missed! Try again.');
        }
    }
}

function getDistance(a, b) {
    // Haversine formula
    const R = 6371000;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const x = dLng * Math.cos((lat1 + lat2) / 2);
    const y = dLat;
    return Math.sqrt(x * x + y * y) * R;
}

// Initialize map
mapManager.initMap(); 