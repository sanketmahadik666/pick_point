// LocationData.js: Utility for fetching location-based content

const https = require('https');

/**
 * Fetch fun fact about a location using Wikipedia
 */
async function fetchFunFact(lat, lon) {
    return new Promise((resolve, reject) => {
        // First, reverse geocode to get place name
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        
        https.get(nominatimUrl, { headers: { 'User-Agent': 'EurekaGame/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const geoData = JSON.parse(data);
                    const place = geoData.address?.city || 
                                 geoData.address?.town || 
                                 geoData.address?.village || 
                                 geoData.address?.state || 
                                 geoData.address?.country;
                    
                    if (!place) {
                        resolve(null);
                        return;
                    }
                    
                    // Fetch Wikipedia summary
                    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place)}`;
                    https.get(wikiUrl, { headers: { 'User-Agent': 'EurekaGame/1.0' } }, (wikiRes) => {
                        let wikiData = '';
                        wikiRes.on('data', chunk => wikiData += chunk);
                        wikiRes.on('end', () => {
                            try {
                                const wiki = JSON.parse(wikiData);
                                resolve(wiki.extract || null);
                            } catch (e) {
                                resolve(null);
                            }
                        });
                    }).on('error', () => resolve(null));
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

/**
 * Get country name from coordinates
 */
async function getCountry(lat, lon) {
    return new Promise((resolve) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        https.get(url, { headers: { 'User-Agent': 'EurekaGame/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const geoData = JSON.parse(data);
                    resolve(geoData.address?.country || null);
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

/**
 * Generate a quiz question about a country
 */
function generateCountryQuiz(correctCountry) {
    const allCountries = [
        'United States', 'Brazil', 'India', 'Australia', 'Canada', 
        'Russia', 'China', 'France', 'Germany', 'South Africa',
        'Argentina', 'Japan', 'Egypt', 'Mexico', 'Italy', 
        'Spain', 'Turkey', 'Indonesia', 'Saudi Arabia', 'United Kingdom',
        'South Korea', 'Nigeria', 'Thailand', 'Poland', 'Netherlands'
    ];
    
    const options = [correctCountry];
    while (options.length < 4) {
        const randomCountry = allCountries[Math.floor(Math.random() * allCountries.length)];
        if (!options.includes(randomCountry)) {
            options.push(randomCountry);
        }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    const correctIndex = options.indexOf(correctCountry);
    
    return {
        question: 'What country is this location in?',
        options: options,
        correctIndex: correctIndex
    };
}

module.exports = {
    fetchFunFact,
    getCountry,
    generateCountryQuiz
};
