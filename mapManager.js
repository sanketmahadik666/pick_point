import { onMapReady, onMapClick } from './gameManager.js';

let map, hiderMarker, seekerMarker, radiusCircle, flagMarker;

export function initMap() {
    map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        dragging: true,
        attributionControl: false
    }).setView([40.7128, -74.0060], 10);

    let currentLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
    });

    let isSatellite = false;
    window.toggleSatellite = function() {
        if (isSatellite) {
            map.removeLayer(satelliteLayer);
            currentLayer.addTo(map);
            isSatellite = false;
        } else {
            map.removeLayer(currentLayer);
            satelliteLayer.addTo(map);
            isSatellite = true;
        }
    };

    window.centerMap = function() {
        map.flyTo([40.7128, -74.0060], 10, { animate: true, duration: 1.5 });
    };

    map.whenReady(() => {
        setTimeout(() => {
            document.getElementById('loadingOverlay').classList.add('hidden');
            if (onMapReady) onMapReady();
        }, 1000);
    });

    map.on('click', (e) => {
        if (onMapClick) onMapClick(e.latlng);
    });
}

export function setHiderLocation(latlng) {
    if (hiderMarker) map.removeLayer(hiderMarker);
    hiderMarker = L.marker(latlng, {icon: L.icon({iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', iconSize: [32,32]})}).addTo(map);
}

export function setSeekerGuess(latlng, radius=500) {
    if (seekerMarker) map.removeLayer(seekerMarker);
    if (radiusCircle) map.removeLayer(radiusCircle);
    seekerMarker = L.marker(latlng, {icon: L.icon({iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', iconSize: [32,32], iconColor: 'red'})}).addTo(map);
    radiusCircle = L.circle(latlng, {radius, color: 'red', fillOpacity: 0.2}).addTo(map);
}

export function clearMarkers() {
    if (hiderMarker) map.removeLayer(hiderMarker);
    if (seekerMarker) map.removeLayer(seekerMarker);
    if (radiusCircle) map.removeLayer(radiusCircle);
}

export function setFlagMarker(latlng) {
    if (flagMarker) map.removeLayer(flagMarker);
    flagMarker = L.marker(latlng, {
        icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -36]
        })
    }).addTo(map);
    flagMarker.bindPopup('Find this spot!').openPopup();
} 