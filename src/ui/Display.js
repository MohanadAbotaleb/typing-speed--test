import {addClass, removeClass } from '../utils/ClassUtils.js';
import {GAME_CONFIG} from '../constants/gameConfig.js';

class Display {
    #wordContainer = document.getElementById('words')

    // Function for displaying the list of words that were returned from WordList
    renderWords(words) {
        this.#wordContainer.innerHTML = words
            .map(word => `<div class="word">${word.split('').map(letter => `<span class="letter">${letter}</span>`).join('')}</div>`).join('');

        // Set initial current word/letter
        const firstWord = document.querySelector('.word');
        const firstLetter = firstWord?.querySelector('.letter');
        if (firstWord) addClass(firstWord,'current');
        if (firstLetter) addClass(firstLetter,'current');
    }

    movetoNextWord(currentWord, currentLetter) {
        const nextWord = currentWord.nextElementSibling;
        const expected = currentLetter.innerHTML;
        if(currentLetter !== expected) {
            const incorrectLetters = [...document.querySelectorAll('.word.current .letter:not(.correct)')]
            for (const letter of incorrectLetters) {
                addClass(letter, 'incorrect');
            }
        }
        removeClass(currentWord, 'current');
        if(currentLetter) removeClass(currentLetter, 'current');
        if(nextWord) {
            addClass(nextWord, 'current');
            const firstLetter = nextWord.querySelector('.letter');
            if (firstLetter) addClass(firstLetter, 'current');
        }
    }

    updateLetterStatus(letter, isCorrect) {
        addClass(letter, isCorrect ? 'correct' : 'incorrect');
        removeClass(letter, 'current');

        const nextLetter = letter.nextElementSibling;
        if (nextLetter) {
            addClass(nextLetter, 'current'); 
        } else {
            document.querySelector('.letter.current').id = 'last';
            return;
        }
    } 
    updateIncorrectLetters(word) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        word.querySelectorAll('.letter:not(.correct)').forEach(letter => {
            addClass(letter, 'incorrect');
        });
    }
    
    checkScroll() {
        const currentWord = document.querySelector('.word.current');
        if(currentWord?.getBoundingClientRect().top > GAME_CONFIG.WORD_MARGIN_THRESHOLD) {
            this.scroll();
        }
    }
    scroll() {
        const currentMargin = Number.parseInt(this.#wordContainer.style.marginTop || '0');
        this.#wordContainer.style.marginTop = `${currentMargin - GAME_CONFIG.WORD_MARGIN_ADJUSTMENT}px`;
    }
    reset() {
        this.#wordContainer.style.marginTop = '0px';
    }
}

export default Display;
