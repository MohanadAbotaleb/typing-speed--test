import { GAME_CONFIG } from "../constants/gameConfig.js";

class ScoreCalc {
    #correctChars = 0;
    #totalChars = 0;
    #correctWords = 0;
    #totalKeyPresses = 0;

    countKeyPress(key, expectedChar) {
        if (key.length === 1) {  // Only count actual characters, not special keys
            this.#totalKeyPresses++;
            if (key === expectedChar) {
                this.#correctChars++;
            }
            this.#totalChars++;
        }
    }

    countWords(wordElement) {
        const isWordCorrect = [...wordElement.querySelectorAll('.letter')]
            .every(letter => letter.classList.contains('correct'));
        
        if (isWordCorrect) {
            this.#correctWords++;
        }
    }

    calculateWPM(timeRemaining) {
        const timeElapsed = (GAME_CONFIG.DEFAULT_TIME - timeRemaining) / 60; // Convert to minutes
        if (timeElapsed === 0) return 0;
        
        // WPM = (characters / 5) / time in minutes
        return Math.round((this.#correctChars / 5) / timeElapsed);
    }

    getStats() {
        return {
            accuracy: this.#totalChars > 0 
                ? Math.round((this.#correctChars / this.#totalChars) * 100) 
                : 0,
            correctChars: this.#correctChars,
            totalChars: this.#totalChars,
            correctWords: this.#correctWords
        };
    }

    reset() {
        this.#correctChars = 0;
        this.#totalChars = 0;
        this.#correctWords = 0;
        this.#totalKeyPresses = 0;
    }
}

export default ScoreCalc;