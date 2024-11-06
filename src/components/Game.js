import Result from "../components/Result.js";
import Timer from "../components/Timer.js";
import UserInput from "../components/UserInput.js";
import ScoreCalc from "../services/ScoreCalc.js";
import WordList from "../services/WordList.js";
import Display from "../ui/Display.js";
import { addClass, removeClass } from "../utils/ClassUtils.js";

class Game {
  #wordlist;
  #display;
  #scoreCalc;
  #result;
  #timer;
  #userInput;
  constructor() {
    this.#wordlist = new WordList();
    this.#display = new Display();
    this.#result = new Result("results");
    this.#timer = new Timer("timer", () => this.endGame());
    this.#userInput = new UserInput(
      "game",
      () => this.startGame(),
      (key, state) => this.handleInput(key, state),
    );
    this.#scoreCalc = new ScoreCalc();

    this.initialize();
  }

  async initialize() {
    await this.#wordlist.loadWords();
    // if (!wordsLoaded) {
    //     console.error('Failed to initialize game');
    //     return;
    // }

    document
      .getElementById("restart")
      .addEventListener("click", () => this.startNewGame());

    this.startNewGame();
  }

  startNewGame() {
    this.#scoreCalc.reset();
    this.#timer.reset();
    this.#display.reset();
    this.#result.clear();
    this.#userInput.reset();

    const words = this.#wordlist.getRandomWords();
    this.#display.renderWords(words);
  }

  startGame() {
    this.#timer.start();
  }

  endGame() {
    this.#userInput.setGameOver();
    const stats = this.#scoreCalc.getStats();
    const wpm = this.#scoreCalc.calculateWPM(this.#timer.getTimeRemaining());
    this.#result.display(stats, wpm);
  }

  handleInput(key, state) {
    const { currentWord, currentLetter, expectedChar } = state;

    if (!currentWord || !currentLetter) return;

    switch (key) {
      case " ":
        this.handleSpaceKey(currentWord, currentLetter);
        break;
      case "Backspace":
        this.handleBackspace(currentWord, currentLetter);
        break;
      default:
        if (key.length === 1) {
          this.handleCharacterKey(key, currentLetter, expectedChar);
        }
    }

    this.#scoreCalc.countKeyPress(key, expectedChar);
    this.#display.checkScroll();
  }

  handleSpaceKey(currentWord, currentLetter) {
    this.#scoreCalc.countWords(currentWord);
    this.#display.movetoNextWord(currentWord, currentLetter);
  }

  handleCharacterKey(key, currentLetter, expectedChar) {
    this.#display.updateLetterStatus(currentLetter, key === expectedChar);
  }

  handleBackspace(currentWord, currentLetter) {
    if (!currentLetter) {
      addClass(currentWord.lastChild, "current");
      removeClass(currentWord.lastChild, "incorrect");
      removeClass(currentWord.lastChild, "correct");
    }
    if (currentLetter === currentWord.firstChild && currentWord === document.querySelector(".word")) {
      return;
  }
    if (
      currentLetter === currentWord.firstChild &&
      currentWord !== document.querySelector(".word")
    ) {

      const prevWord = currentWord.previousSibling;
      if(prevWord) {
        removeClass(currentWord, "current");
        addClass(prevWord, "current");
        removeClass(currentLetter, "current");
        addClass(prevWord.lastChild, "current");
        prevWord.lastChild.classList.remove('correct','incorrect');
      }

    } else if (currentLetter !== currentWord.firstChild) {
      const previousLetter = currentLetter.previousSibling;
      if(previousLetter) {
        addClass(previousLetter, "current");
        removeClass(previousLetter, "correct");
        removeClass(previousLetter, "incorrect");
        removeClass(currentLetter, "current");
      }

    }
  }
}

export default Game;
