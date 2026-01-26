// --- Strategy Pattern: Scoring ---
class ScoringStrategy {
    calculate(distance) {
        throw new Error("Method 'calculate' must be implemented.");
    }
}

class LogarithmicScoring extends ScoringStrategy {
    calculate(distance) {
        if (distance <= 50) return 5000;
        if (distance > 1500000) return 0;
        const points = 5000 - Math.floor(Math.log(distance) * 500);
        return Math.max(0, points);
    }
}

class LinearScoring extends ScoringStrategy { // Example alternative
    calculate(distance) {
        const points = 5000 - (distance / 1000) * 2; // -2 points per km
        return Math.max(0, Math.floor(points));
    }
}

module.exports = {
    ScoringStrategy,
    LogarithmicScoring,
    LinearScoring
};
