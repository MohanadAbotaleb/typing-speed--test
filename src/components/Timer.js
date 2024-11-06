import {GAME_CONFIG} from "../constants/gameConfig.js";

class Timer {
    #display;
    #timeRemaining;
    #interval;
    #onTimeUp;

    constructor(displayId, onTimeUp) {
        this.#display = document.getElementById(displayId);
        this.#onTimeUp = onTimeUp;
        this.#timeRemaining = GAME_CONFIG.DEFAULT_TIME;

        if(!this.#display) {
            throw new Error('Timer display element does not exist');
        }
    }

    start() {
        if (this.#interval) return;

        const endTime = Date.now() + this.#timeRemaining * 1000;
        this.#interval = setInterval(() => {
            const remaining = Math.round((endTime - Date.now()) / 1000);

            if (remaining <= 0) {
                this.stop();
                this.#onTimeUp();
            } else {
                this.#display.textContent = remaining;
            }
        }, 100);
    }

    stop() {
        clearInterval(this.#interval);
        this.#interval = null;
    }

    reset() {
        this.stop();
        this.#timeRemaining = GAME_CONFIG.DEFAULT_TIME;
        this.#display.textContent = GAME_CONFIG.DEFAULT_TIME;

    }

    getTimeRemaining() {
        return this.#timeRemaining;
    }
}

export default Timer;

