import { addClass, removeClass } from "../utils/ClassUtils.js";

class UserInput {
    #gameContainer;
    #onGameStart;
    #onInput;

    constructor(containerId, onGameStart, onInput) {
        this.#gameContainer = document.getElementById(containerId);
        this.#onGameStart = onGameStart;
        this.#onInput = onInput;

        if(!this.#gameContainer) {
            throw new Error('Game container does not exist');
        }

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.#gameContainer.addEventListener('keyup', this.handleKeyPress);
    }

    handleKeyPress(event) {
        if(this.isGameOver()) return;

        const key = event.key;
        const currentState = this.getCurrentState();

        // Start game on first keypress
        if(!this.isGameActive() && key.length === 1) {
            this.#onGameStart();
        }

        this.#onInput(key, currentState);
    }

    getCurrentState() {
        return {
            currentWord: document.querySelector('.word.current'),
            currentLetter: document.querySelector('.letter.current'),
            expectedChar: document.querySelector('.letter.current')?.textContent || ' '
        };
    }
    
    isGameOver() {
        return this.#gameContainer.classList.contains('over');
    }

    isGameActive() {
        return document.querySelector('.word.current') !== null;
    }

    setGameOver() {
        addClass(this.#gameContainer, 'over');
    }

    focus() {
        this.#gameContainer.focus();
    }

    reset() {
        removeClass(this.#gameContainer, 'over');
        this.focus();
    }
}

export default UserInput;
