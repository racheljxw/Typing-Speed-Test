"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
const text = document.getElementById("sampleText");
const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const goTestButton = document.getElementById("goTest");
const testScreen = document.querySelector(".testScreen");
const resultsScreen = document.querySelector(".resultsScreen");
const optionsSection = document.querySelector(".options");
let time = 0;
let timer = null;
const words = [
    "aura", "ash", "always",
    "beauty", "brand", "bored",
    "cat", "course", "chat",
    "dog", "drone", "dear",
    "every", "elephant", "emerald",
    "fox", "flower", "fashion",
    "giant", "gas", "gorilla",
    "hashtag", "horse", "home",
    "igloo", "ice", "iteration",
    "joker", "jelly", "jazz",
    "karate", "kiss", "knight",
    "love", "laugh", "land",
    "money", "mango", "match",
    "number", "normal", "nasty",
    "opera", "open", "order",
    "power", "pretty", "pastry",
    "quiet", "queen", "queer",
    "rose", "rabbit", "robot",
    "sandwich", "shirt", "sling",
    "throw", "tiger", "toast",
    "umbrella", "under", "usher",
    "violet", "velvet", "vast",
    "wire", "wander", "witch",
    "xenophobia", "xylophone",
    "yam", "yellow", "yes",
    "zealous", "zebra", "zoom"
];
let sampleText = ["the"];
let incorrectLetter = 0;
let maxTime = 15;
let maxWords = 25;
let isRunning = 0;
let wordPassed = 0;
let letterPassed = 0;
let linePassed = 0;
let wordsTyped = 1;
let timeOption = true;
let wpmResults = [];
let accuracyResults = [];
function generateText(lines) {
    if (timeOption) {
        maxWords = 25;
        const usedWords = new Set();
        if (usedWords.size >= words.length) {
            usedWords.clear();
        }
        for (let i = 0; i < maxWords; i++) {
            while (true) {
                const wordNum = Math.floor(Math.random() * words.length);
                if (usedWords.has(wordNum))
                    continue;
                const word = words[wordNum];
                if (word) {
                    sampleText.push(word);
                    usedWords.add(wordNum);
                }
                break;
            }
        }
    }
    else {
        if (lines == 2) {
            const usedWords = new Set();
            if (usedWords.size >= words.length) {
                usedWords.clear();
            }
            for (let i = 0; i < maxWords; i++) {
                while (true) {
                    const wordNum = Math.floor(Math.random() * words.length);
                    if (usedWords.has(wordNum))
                        continue;
                    const word = words[wordNum];
                    if (word) {
                        sampleText.push(word);
                        usedWords.add(wordNum);
                    }
                    break;
                }
            }
        }
    }
    sampleText.forEach((word, index) => {
        console.log(`Word ${index + 1}: ${word}`);
    });
    for (let x = 0; x < lines; x++) {
        const newLine = document.createElement("div");
        newLine.classList.add("sampleText_line");
        newLine.setAttribute("data-line", x.toString());
        let lineCharacters = 0;
        while (lineCharacters < 56) {
            const accessWord = sampleText[wordPassed];
            if (!accessWord)
                break;
            wordPassed++;
            const newWord = document.createElement("div");
            for (let ii = 0; ii < accessWord.length; ii++) {
                const newLetter = document.createElement("p");
                newLetter.classList.add("sampleText_letter");
                newLetter.textContent = accessWord.substring(ii, ii + 1);
                newWord.appendChild(newLetter);
                lineCharacters++;
            }
            newLine.appendChild(newWord);
            if (!timeOption && wordPassed == maxWords)
                break;
            const space = document.createElement("p");
            space.classList.add("sampleText_letter");
            space.textContent = " ";
            newLine.appendChild(space);
            lineCharacters++;
        }
        text.appendChild(newLine);
    }
}
function checkLines() {
    const sampleTextLine = document.querySelectorAll(".sampleText_line");
    let lineLength = 0;
    let lineComplete = 0;
    sampleTextLine.forEach(sampleLine => {
        if (sampleLine.getAttribute("data-line") == linePassed.toString()) {
            const sampleTextLetter = sampleLine.querySelectorAll(".sampleText_letter");
            sampleTextLetter.forEach(sampleLetter => {
                lineLength++;
                if (sampleLetter.classList.contains("correct") || sampleLetter.classList.contains("incorrect")) {
                    lineComplete++;
                }
            });
            if (lineLength == lineComplete) {
                sampleLine.style.display = "none";
                generateText(1);
                linePassed++;
            }
        }
    });
}
function checkTyping(letter) {
    let sampleKeys = sampleText.join(" ");
    const sampleTextLetter = document.querySelectorAll(".sampleText_letter");
    let letterPassedCounter = 0;
    if (letter == sampleKeys.substring(letterPassed, letterPassed + 1)) {
        sampleTextLetter.forEach(sampleLetter => {
            if (letterPassed == letterPassedCounter) {
                sampleLetter.classList.add("correct");
            }
            letterPassedCounter++;
        });
        if (letter === " ") {
            wordsTyped++;
        }
        letterPassed++;
    }
    else if (letter === "Backspace") {
        letterPassed--;
        sampleTextLetter.forEach(sampleLetter => {
            if (letterPassed == letterPassedCounter && sampleLetter.classList.contains("correct")) {
                sampleLetter.classList.remove("correct");
            }
            else if (letterPassed == letterPassedCounter && sampleLetter.classList.contains("incorrect")) {
                sampleLetter.classList.remove("incorrect");
                incorrectLetter--;
            }
            letterPassedCounter++;
        });
        if (sampleKeys.substring(letterPassed, letterPassed + 1) === " ") {
            wordsTyped--;
        }
    }
    else {
        if (timeOption == false && sampleKeys.substring(letterPassed, letterPassed + 1) === " ") {
            wordsTyped++;
        }
        sampleTextLetter.forEach(sampleLetter => {
            if (letterPassed == letterPassedCounter) {
                sampleLetter.classList.add("incorrect");
                incorrectLetter++;
            }
            letterPassedCounter++;
        });
        letterPassed++;
    }
}
function calculateWPM() {
    if (wpmDisplay && timeOption) {
        let wordsPerMinute = Math.round((wordsTyped / maxTime) * 60);
        wpmDisplay.textContent = `${wordsPerMinute}`;
        wpmResults.push(wordsPerMinute);
    }
    else if (wpmDisplay && !timeOption) {
        let wordsPerMinute = Math.round((wordsTyped / time) * 60);
        wpmDisplay.textContent = `${wordsPerMinute}`;
        wpmResults.push(wordsPerMinute);
    }
    saveResults();
}
function calculateAcc() {
    let correct = document.querySelectorAll(".correct");
    let incorrect = document.querySelectorAll(".incorrect");
    let lettersTyped = 0;
    correct.forEach(each => {
        lettersTyped++;
    });
    incorrect.forEach(each => {
        lettersTyped++;
    });
    const accuracy = 100 - (incorrectLetter / lettersTyped * 100);
    accuracyDisplay.textContent = accuracy.toFixed(2) + "%";
    accuracyResults.push(accuracy);
    saveResults();
}
function displayResults() {
    const highScoreDisplay = document.getElementById("userHighScore");
    const averageDisplay = document.getElementById("userAverage");
    const wpmHighScore = Math.max(...wpmResults);
    const accHighScore = Math.max(...accuracyResults);
    highScoreDisplay.textContent = `Your High Score: ${wpmHighScore} wpm, ${accHighScore.toFixed(2)}% acc`;
    const wpmAverage = wpmResults.reduce((a, b) => a + b, 0) / wpmResults.length;
    const accAverage = accuracyResults.reduce((a, b) => a + b, 0) / accuracyResults.length;
    averageDisplay.textContent = `Your Average: ${wpmAverage.toFixed(2)} wpm, ${accAverage.toFixed(2)}% acc`;
}
function calculateTime() {
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        time++;
        timeDisplay.textContent = `${maxTime - time}s`;
        if (timer && time >= maxTime) {
            clearInterval(timer);
            calculateWPM();
            calculateAcc();
            displayResults();
            testScreen.style.display = "none";
            resultsScreen.style.display = "block";
        }
    }, 1000);
}
function calculateWords() {
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        time++;
        timeDisplay.textContent = `${time}s`;
        console.log(wordsTyped);
        if (timer && wordsTyped == maxWords) {
            clearInterval(timer);
            calculateWPM();
            calculateAcc();
            displayResults();
            testScreen.style.display = "none";
            resultsScreen.style.display = "block";
        }
    }, 1000);
}
document.addEventListener("keypress", function (event) {
    isRunning++;
    if (isRunning == 1) {
        optionsSection.style.pointerEvents = "none";
        if (timeOption) {
            calculateTime();
        }
        else {
            calculateWords();
        }
    }
    const letter = event.key;
    checkTyping(letter);
    checkLines();
});
document.addEventListener("keydown", function (event) {
    const letter = event.key;
    if (letter === "Backspace") {
        checkTyping(letter);
    }
});
document.addEventListener("DOMContentLoaded", startRunning);
goTestButton.addEventListener("click", startRunning);
function startRunning() {
    text.innerHTML = "";
    sampleText = ["the"];
    time = 0;
    timer = null;
    incorrectLetter = 0;
    isRunning = 0;
    wordPassed = 0;
    letterPassed = 0;
    linePassed = 0;
    wordsTyped = 1;
    if (timeOption) {
        timeDisplay.textContent = maxTime + "s";
    }
    else {
        timeDisplay.textContent = "0s";
    }
    testScreen.style.display = "block";
    resultsScreen.style.display = "none";
    optionsSection.style.pointerEvents = "auto";
    generateText(2);
}
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById('darkModeToggle');
    const game = document.querySelector(".game");
    const footer = document.querySelector(".footer__container");
    const correct = document.querySelectorAll(".correct");
    const heading = document.querySelectorAll("h2");
    const paragraph = resultsScreen.querySelectorAll("p");
    const footerItem = footer.querySelectorAll(".footer__itemEach");
    const footerItemEmail = footer.querySelector(".footer__itemEachEmail");
    const optionsToggle = document.getElementById("optionsToggle");
    const timeOptionToggle = document.getElementById("timeOption");
    const wordsOptionToggle = document.getElementById("wordsOption");
    const optionItem = document.querySelectorAll(".option__item");
    const chosen = document.querySelector(".chosen");
    toggle.addEventListener('change', function () {
        if (toggle.checked) {
            game.style.backgroundColor = "#191b28";
            game.classList.add("dark");
            footer.style.backgroundColor = "#191b28";
            text.style.color = "rgba(255, 252, 239, 0.25)";
            timeDisplay.style.color = "#fffcef";
            heading.forEach(each => {
                each.style.color = "#fffcef";
            });
            paragraph.forEach(each => {
                each.style.color = "#fffcef";
            });
            wpmDisplay.style.color = "#fffcef";
            accuracyDisplay.style.color = "#fffcef";
            footerItem.forEach(each => {
                each.style.color = "#fffcef";
            });
            footer.style.color = "#fffcef";
            footerItemEmail.style.borderColor = "#fffcef";
            optionsToggle.addEventListener('change', function () {
                if (optionsToggle.checked) {
                    wordsOptionToggle.style.color = "#fffcef";
                    timeOptionToggle.style.color = "#9292b1";
                }
                else {
                    wordsOptionToggle.style.color = "#9292b1";
                    timeOptionToggle.style.color = "#fffcef";
                }
            });
            if (optionsToggle.checked) {
                wordsOptionToggle.style.color = "#fffcef";
                timeOptionToggle.style.color = "#9292b1";
            }
            else {
                wordsOptionToggle.style.color = "#9292b1";
                timeOptionToggle.style.color = "#fffcef";
            }
            optionItem.forEach(each => {
                each.style.color = "rgba(255, 252, 239, 0.5)";
            });
        }
        else {
            game.style.backgroundColor = "#fffcef";
            game.classList.remove("dark");
            footer.style.backgroundColor = "#fffcef";
            text.style.color = "rgba(25, 27, 40, 0.25)";
            timeDisplay.style.color = "#191b28";
            heading.forEach(each => {
                each.style.color = "#191b28";
            });
            paragraph.forEach(each => {
                each.style.color = "#191b28";
            });
            wpmDisplay.style.color = "#191b28";
            accuracyDisplay.style.color = "#191b28";
            footerItem.forEach(each => {
                each.style.color = "#191b28";
            });
            footer.style.color = "#191b28";
            footerItemEmail.style.borderColor = "#2c3268";
            wordsOptionToggle.style.removeProperty("color");
            timeOptionToggle.style.removeProperty("color");
            optionsToggle.addEventListener('change', function () {
                wordsOptionToggle.style.removeProperty("color");
                timeOptionToggle.style.removeProperty("color");
            });
            optionItem.forEach(each => {
                each.style.color = "rgba(25, 27, 40, 0.5)";
            });
        }
    });
});
const optionsToggle = document.getElementById('optionsToggle');
const timeOptions = document.querySelector(".timeOption__container");
const wordsOptions = document.querySelector(".wordsOption__container");
const timeOption15 = document.getElementById("timeOption--15");
const timeOption30 = document.getElementById("timeOption--30");
const timeOption60 = document.getElementById("timeOption--60");
const wordsOption10 = document.getElementById("wordsOption--10");
const wordsOption25 = document.getElementById("wordsOption--25");
const wordsOption50 = document.getElementById("wordsOption--50");
optionsToggle.addEventListener('change', function () {
    if (optionsToggle.checked) {
        timeOption = false;
        timeOptions.style.display = "none";
        wordsOptions.style.display = "flex";
        wordsOption10.classList.add("chosen");
        timeOption15.classList.remove("chosen");
        wordsOption25.classList.remove("chosen");
        wordsOption50.classList.remove("chosen");
        maxWords = 10;
        startRunning();
    }
    else {
        timeOption = true;
        timeOptions.style.display = "flex";
        wordsOptions.style.display = "none";
        timeOption15.classList.add("chosen");
        wordsOption10.classList.remove("chosen");
        timeOption30.classList.remove("chosen");
        timeOption60.classList.remove("chosen");
        maxTime = 15;
        startRunning();
    }
});
timeOption15.addEventListener("click", function () {
    maxTime = 15;
    timeOption15.classList.add("chosen");
    timeOption30.classList.remove("chosen");
    timeOption60.classList.remove("chosen");
    startRunning();
});
timeOption30.addEventListener("click", function () {
    maxTime = 30;
    timeOption30.classList.add("chosen");
    timeOption15.classList.remove("chosen");
    timeOption60.classList.remove("chosen");
    startRunning();
});
timeOption60.addEventListener("click", function () {
    maxTime = 60;
    timeOption60.classList.add("chosen");
    timeOption15.classList.remove("chosen");
    timeOption30.classList.remove("chosen");
    startRunning();
});
wordsOption10.addEventListener("click", function () {
    maxWords = 10;
    wordsOption10.classList.add("chosen");
    wordsOption25.classList.remove("chosen");
    wordsOption50.classList.remove("chosen");
    startRunning();
});
wordsOption25.addEventListener("click", function () {
    maxWords = 25;
    wordsOption25.classList.add("chosen");
    wordsOption10.classList.remove("chosen");
    wordsOption50.classList.remove("chosen");
    startRunning();
});
wordsOption50.addEventListener("click", function () {
    maxWords = 50;
    wordsOption50.classList.add("chosen");
    wordsOption10.classList.remove("chosen");
    wordsOption25.classList.remove("chosen");
    startRunning();
});
const wpmResultsStorage = "wpmResultsStorage";
const accResultsStorage = "accResultsStorage";
document.addEventListener("DOMContentLoaded", loadResults);
function loadResults() {
    const wpmResultsString = localStorage.getItem(wpmResultsStorage);
    const accResultsString = localStorage.getItem(accResultsStorage);
    if (wpmResultsString && accResultsString) {
        wpmResults = JSON.parse(wpmResultsString);
        accuracyResults = JSON.parse(accResultsString);
    }
}
function saveResults() {
    const wpmResultsString = JSON.stringify(wpmResults);
    const accResultsString = JSON.stringify(accuracyResults);
    localStorage.setItem(wpmResultsStorage, wpmResultsString);
    localStorage.setItem(accResultsStorage, accResultsString);
}
//# sourceMappingURL=typeSpeed.js.map