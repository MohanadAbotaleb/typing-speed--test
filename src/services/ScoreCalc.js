class ScoreCalc {
    #keyStats = {
        total: 0,
        correct: 0
    };
    
    #wordStats = {
        correctWords: 0,
        totalChars: 0,
        correctChars:0,
    }

    reset() {
        this.#keyStats = {total: 0, correct: 0};
        this.#wordStats = {correctWords:0, totalChars:0, correctChars:0};
    }

    countKeyPress(pressedKey, expectedKey) {
        if(pressedKey === 'Backspace') return;
        this.#keyStats.total++;
        if(pressedKey === expectedKey) {
            this.#keyStats.correct++;
        }
    }

    countWords(word) {
        const letters = word.querySelectorAll('.letter');
        const correctLetters = word.querySelectorAll('.letter.correct');

        this.#wordStats.totalChars += letters.length;
        this.#wordStats.correctChars += correctLetters.length;

        if(letters.length === correctLetters.length) {
            this.#wordStats.correctWords++;
        }
    }

    
    calculateWPM(timeInSecs) {
        const timeInMinutes =timeInSecs/60;
        return Math.round((this.#wordStats.correctWords / timeInMinutes) * 10) / 10;
    }

    calculateAccuracy() {
        if (this.#keyStats.total === 0) return 0;
        return Math.round((this.#keyStats.correct / this.#keyStats.total) * 1000) / 10;
    }
    getStats() {
        return {
            ...this.#wordStats,
            accuracy: this.calculateAccuracy(),
            totalKeyPresses: this.#keyStats.total,
            correctKeyPresses: this.#keyStats.correct
        };
    }
    }
export default ScoreCalc;