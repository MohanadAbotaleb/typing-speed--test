const wordNum = 200;

fetch('/1000-most-common-words.txt')
.then((res) => res.text()) 
.then((text) => {
    const words = text.split('\n');
    displayWords(words);
    console.log(document.getElementsByClassName("words").innerHTML)
})
.catch((e) => console.log(e))

function randWords(words) {
    const index = Math.ceil(Math.random() * wordNum);
    return words[index];
}

function displayWords(words) {
    const element = document.getElementById("words");
        element.innerHTML = '';
        for(let i = 0; i < wordNum; i++) {
            element.innerHTML += `<div class="word">
            <span class="letter">
            ${randWords(words).split('').join('</span><span class="letter">')}
            </span>
            </div>`;
        }
    }


document.getElementById("game").addEventListener("keyup", (ev) => {

}
);

