// MapFacade.js: Implements the Facade Pattern to abstract Map operations
class MapFacade {
    constructor(mapId) {
        this.mapId = mapId;
        this.map = null;
        this.markers = [];
        this.tempMarker = null;
        this.hintEllipse = null;
        this.resultLine = null;
    }

    initialize() {
        if (window._leaflet_map_instance) {
            window._leaflet_map_instance.remove();
        }
        this.map = L.map(this.mapId).setView([20, 0], 2);
        window._leaflet_map_instance = this.map;
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }

    onClick(callback, debounceTime = 200) {
        this.map.on('click', this.debounce(callback, debounceTime));
    }
    
    // Helper to decouple Debounce logic
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    addMarker(lat, lng, isTemp = false) {
        if (isTemp) {
            if (this.tempMarker) this.map.removeLayer(this.tempMarker);
            this.tempMarker = L.marker([lat, lng]).addTo(this.map);
            return this.tempMarker;
        } else {
             const m = L.marker([lat, lng]).addTo(this.map);
             this.markers.push(m);
             return m;
        }
    }

    drawEllipse(center, radiusX, radiusY, rotation) {
        // Implementation of ellipse drawing calculation
        const points = [];
        const numPoints = 60;
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const x = Math.cos(angle) * radiusX;
            const y = Math.sin(angle) * radiusY;
            const rotatedX = x * Math.cos(rotation) - y * Math.sin(rotation);
            const rotatedY = x * Math.sin(rotation) + y * Math.cos(rotation);
            // Approx conversion for display
            const dx = rotatedX / 111320;
            const dy = rotatedY / 110540;
            points.push([center[0] + dy, center[1] + dx]);
        }
        
        if (this.hintEllipse) this.map.removeLayer(this.hintEllipse);
        this.hintEllipse = L.polygon(points, {
            color: 'blue',
            fillColor: '#30f',
            fillOpacity: 0.2
        }).addTo(this.map);
        this.map.fitBounds(this.hintEllipse.getBounds());
    }

    clearLayers() {
        if (this.tempMarker) this.map.removeLayer(this.tempMarker);
        if (this.hintEllipse) this.map.removeLayer(this.hintEllipse);
        if (this.resultLine) this.map.removeLayer(this.resultLine);
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];
        this.tempMarker = null;
        this.hintEllipse = null;
        this.resultLine = null;
    }
    
    showActualLocation(actualLoc, guessLoc) {
         L.marker(actualLoc, {
                icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                })
        }).addTo(this.map);

        if (guessLoc && this.markers.length > 0) {
            // Draw line
             const lastGuessMarker = this.markers[this.markers.length - 1];
             if(lastGuessMarker) {
                  this.resultLine = L.polyline([actualLoc, lastGuessMarker.getLatLng()], { color: 'red' }).addTo(this.map);
                  this.map.fitBounds(this.resultLine.getBounds().pad(0.2));
             }
        } else {
            this.map.setView(actualLoc, 13);
        }
    }
}
