const wordNum = 200;

fetch('/1000-most-common-words.txt')
.then((res) => res.text()) 
.then((text) => {
    const words = text.split('\n');
    displayWords(words);

})
.catch((e) => console.log(e))

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



document.getElementById("game").addEventListener("keyup", (ev) => {
    const key = ev.key;
    const currentLetter = document.querySelector(".letter.current");
    const currentWord = document.querySelector(".word.current");
    const expected = currentLetter?.innerHTML || ' ';

    if (key !== " " && key.length === 1) {
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

