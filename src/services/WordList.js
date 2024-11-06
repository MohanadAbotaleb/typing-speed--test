import { GAME_CONFIG } from '../constants/gameConfig.js';
class WordList {
    #wordList = [];
    #wordCount = GAME_CONFIG.WORD_COUNT;
    #wordAPIURL = GAME_CONFIG.WORD_API_URL;
    
    //TODO: add option to allow user to either choose random quotes or words
    async loadWords() {
        try {
            const response = await fetch(this.#wordAPIURL);
            const text = await response.text();
            this.#wordList = text.split('\n');
        } catch (error) {
            console.error('Failed to load words:', error);
            this.#wordList = ['error', 'loading', 'words']; // Fallback
        }
    }
    
    getRandomWords() {
        return Array.from({ length: this.#wordCount }, () => this.#getRandomWord());
    }

    #getRandomWord() {
        const index = Math.floor(Math.random() * this.#wordList.length);
        return this.#wordList[index];
    }

}

export default WordList;