let wordList = [];
const wordNum = 200;
window.gameStart = null;
let time = 30;
let timerDiv = document.getElementById('timer');
let countdownStarted = false;
let correctWords = 0;
let countdown;
let totalKeyPresses = 0;
let correctKeyPresses = 0;



function calculateCorrectWords() {
    const words = document.querySelectorAll('.word');
    const currentWord = document.querySelector('.word.current');
    let correctCount = 0;
    let correctChars = 0;
    let totalChars = 0;

    for (let word of words) {
        if (word === currentWord) break;
        
        const letters = word.querySelectorAll('.letter');
        totalChars += letters.length + 1; // +1 for space
        
        const allCorrect = Array.from(letters).every(letter => letter.classList.contains('correct'));
        
        if (allCorrect) {
            correctCount++;
            correctChars += letters.length + 1; // +1 for space
        }
    }

    return { correctCount, correctChars, totalChars };
}

function calculateWPM() {
    const correctWords = calculateCorrectWords().correctCount;
    const timeInMinutes = time / 60; // Convert seconds to minutes
    const wpm = Math.round((correctWords / timeInMinutes) * 10) / 10; // Round to 1 decimal place
    return wpm;
}

function calculateAccuracy() {
    return totalKeyPresses > 0 ? Math.round((correctKeyPresses / totalKeyPresses) * 1000) / 10 : 0;
}

function displayResult() {
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    const { correctChars, totalChars } = calculateCorrectWords();
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = `
        <h2>Your typing results:</h2>
        <p>WPM: ${wpm}</p>
        <p>Accuracy: ${accuracy}%</p>
        <p>Characters: ${correctChars} / ${totalChars}</p>
    `;
}


function randWords(words, wordNum) {
    const index = Math.ceil(Math.random() * wordNum);
    return words[index];
}

function displayWords(words) {
    const element = document.getElementById("words");
    element.innerHTML = '';
    for(let i = 0; i < wordNum; i++) {
        element.innerHTML += `<div class="word"><span class="letter">${randWords(words, wordNum).split('').join('</span><span class="letter">')}</span></div>`;
    }
    const firstWord = document.querySelector(".word");
    const firstLetter = firstWord.querySelector(".letter");
    setClass(firstWord, "current");
    setClass(firstLetter, "current");
    }


function setClass(elName, clName) {
    elName.className += ` ${clName}`;
}

function removeClass(elName, clName) {
    elName.className = elName.className.replace(clName,'');
}

const startTimer = () => {
    if (countdownStarted) return; 
    countdownStarted = true;
    let endTime = Date.now() + time * 1000;

    countdown = setInterval(() => {
        let remaining = Math.round((endTime - Date.now()) / 1000);
        timerDiv.textContent = remaining > 0 ? remaining : 0;
        if (remaining <= 0) {
            clearInterval(countdown);
            setClass(document.querySelector('#game'), 'over');
            displayResult(); // Call displayResult when time is up
        }
    }, 100);
};


fetch('/1000-most-common-words.txt')
.then((res) => res.text()) 
.then((text) => {
    wordList = text.split('\n');
    displayWords(wordList);

})
.catch((e) => console.log(e))



function newGame() {
    // Reset timer
    clearInterval(countdown);
    countdownStarted = false;
    timerDiv.textContent = time;

    // Reset game state
    totalKeyPresses = 0;
    correctKeyPresses = 0;

    // Clear and reset the game area
    const gameArea = document.getElementById("game");
    removeClass(gameArea, 'over');
    
    // Clear results
    document.getElementById("results").innerHTML = '';

    displayWords(wordList);

    // Reset focus to game area
    gameArea.focus();
}

// Add event listener to the restart button
document.getElementById("restart").addEventListener("click", newGame);


document.getElementById("game").addEventListener("keyup", (ev) => {
    const key = ev.key;
    const currentLetter = document.querySelector(".letter.current");
    const currentWord = document.querySelector(".word.current");
    const expected = currentLetter?.innerHTML || ' ';


    if(document.querySelector('#game.over')){ 
        return ;
    }
    if (key !== "Backspace") {
        totalKeyPresses++;
        if (key === expected) {
            correctKeyPresses++;
        }
    }
    if (key !== " " && key.length === 1) {
        startTimer();
        if (currentLetter) {
            setClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                setClass(currentLetter.nextSibling, 'current');
            } 
            
        }
    } else if (key === ' ') {
            if (expected !== ' ') {
            const incorrectLetters = [...document.querySelectorAll('.word.current .letter:not(.correct)')]
            for (letter of incorrectLetters) {
                setClass(letter, 'incorrect');
            }

        }
        removeClass(currentWord, 'current');
        setClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        setClass(currentWord.nextSibling.firstChild, 'current');
    }
    else if (key === 'Backspace') {
        if (currentLetter && (currentLetter === currentWord.firstChild) && (currentWord !== document.querySelector('.word'))) {
            removeClass(currentWord, "current");
            setClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            setClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
        }
        else if (currentLetter && !(currentLetter === currentWord.firstChild)) {
            removeClass(currentLetter, 'current');
            setClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'correct');
            removeClass(currentLetter.previousSibling, 'incorrect');

        }
        else if (!currentLetter) {
            setClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
    }

    if(currentWord.getBoundingClientRect().top > 250) {
        const words = document.getElementById('words');
        const margin = Number.parseInt(words.style.marginTop || '0px');
        words.style.marginTop = `${margin - 35}px`
    }
}
);


