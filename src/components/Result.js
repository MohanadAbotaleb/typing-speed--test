class Result {
    #container;

    constructor(containerId) {
        this.#container = document.getElementById;
        if (!this.#container) {
            throw new Error('Result container does not exist');
        }
    }

    display(stats, wpm) {
        this.#container.innerHTML = `
            <h2>Your typing results:</h2>
            <p>WPM: ${wpm}</p>
            <p>Accuracy: ${stats.accuracy}%</p>
            <p>Characters: ${stats.correctChars} / ${stats.totalChars}</p>
            <p>Words: ${stats.correctWords}</p>
        `;
    }
    clear() {
        this.#container.innerHTML = '';
    }
}

export default Result;