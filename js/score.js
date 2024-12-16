class Score {
    constructor() {
        this.currentScore = 0;
        this.totalScore = 0;
    }

    updateScore(timeElapsed, position, totalPlayers) {
        const baseScore = Math.max(0, 10000 - timeElapsed); 
        let multiplier;

        if (totalPlayers === 1) {
            multiplier = 1.3;
        } else if (totalPlayers === 2) {
            multiplier = position === 1 ? 1.3 : 1.1;
        } else if (totalPlayers === 3) {
            multiplier = position === 1 ? 1.3 : (position === 2 ? 1.15 : 1);
        } else {
            multiplier = 1.3 - (position - 1) * 0.1;
        }

        this.currentScore = baseScore * multiplier;
        this.totalScore += this.currentScore;
    }

    getCurrentScore() {
        return this.currentScore;
    }

    getTotalScore() {
        return this.totalScore;
    }

    getPreviewScore(timeElapsed, position, totalPlayers) {
        const baseScore = Math.max(0, 10000 - timeElapsed);
        let multiplier;

        if (totalPlayers === 1) {
            multiplier = 1.3;
        } else if (totalPlayers === 2) {
            multiplier = position === 1 ? 1.3 : 1.1;
        } else if (totalPlayers === 3) {
            multiplier = position === 1 ? 1.3 : (position === 2 ? 1.15 : 1);
        } else {
            multiplier = 1.3 - (position - 1) * 0.1;
        }

        return baseScore * multiplier;
    }
}