const LOCALSTORAGE_KEY = "typing-game-history"
let startTime = 0;
let endTime = 0; 

let charCode = null
let gameStarted = false
let score = 0

let alphabetDiv = document.getElementById("alphabet")
let gameStatusDiv = document.getElementById("game-status")
let gameOnDiv = document.getElementById("game-on")
let ellapsedTimeDiv = document.getElementById("ellapsed-time")
let resultsDiv = document.getElementById("results")
let timeDiv = document.getElementById("time")
let tutorialDiv = document.getElementById("tut")
let gameRestartBtn = document.getElementById("gameRestartBtn")
let yourBestTimeDiv = document.getElementById("your-best-time")
let recordsDiv = document.getElementById("records")
let clearHistoryBtn = document.getElementById("clearHistoryBtn")

const incrementScore = () => {
    if(!gameStarted) return
    score++
    // console.log('score😄', score)
}

const incrementCharCode = () => {
    if(!gameStarted) return
    charCode++
    alphabetDiv.innerHTML = String.fromCharCode(charCode).toUpperCase()
}

function startEllapsedTime(){
    currentTime = Date.now();
    let timeTaken = (currentTime - startTime) / 1000;
    ellapsedTimeDiv.innerHTML = `${timeTaken.toFixed(1)}`
}

const EllapseTime = () => setInterval(startEllapsedTime, 100)

function startGame(initialCharCode) {
    charCode = initialCharCode
    incrementCharCode()
    incrementScore()
    EllapseTime()
    gameStarted = true

    gameStatusDiv.style.display = "block"
    gameOnDiv.innerHTML = "Game on!.."

    tutorialDiv.style.display = "none"
    timeDiv.innerHTML = ""
    startTime = Date.now(); 
}

function resetGame() {
    gameStarted = false
    score = 0
    endTime = 0
    startTime = 0

    resultsDiv.style.display = "none"
    
    tutorialDiv.style.display = "block"
    tutorialDiv.innerHTML = "Game starts when you type A"
    
    alphabetDiv.style.display = "block"
    alphabetDiv.innerHTML = "A"
}

function endGame(escaped) {
    // prevent saving new record after endtime is recorded
    if(endTime !== 0) return

    endTime = Date.now();
    let timeTaken = (endTime - startTime) / 1000;
    alphabetDiv.style.display = "none"
    gameStatusDiv.style.display = "none"

    // prevent saving new record if game is cancelled
    if(escaped) return

    resultsDiv.style.display = "block"
    timeDiv.innerHTML = `${timeTaken.toFixed(2)}`;
    storeNewRecord(`${timeTaken.toFixed(2)}`)
}

gameRestartBtn.addEventListener('click', e => {
    resetGame()
})

clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem(LOCALSTORAGE_KEY)
    renderHistory()
})

document.addEventListener('keyup', e => {

    if(e.key === "a") {
        if(gameStarted) return
        startGame(e.key.charCodeAt())
        incrementCharCode()
        incrementScore()
    }

    if(e.key === "Enter" && score === 26) {
        resetGame()
    }

    if(e.key === "Escape") {
        if(!gameStarted) return
        endGame(true)
        resetGame()
    }

    if(gameStarted && (e.key.charCodeAt() === charCode)){
        incrementCharCode()
        incrementScore()
    }
    
    if(e.key === "z" && score === 26) {
        endGame()
    }
})

function retrieveHistory() {
    const history = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))
    if(!history || history.length === 0) return null
    return history.sort((a,b) => a-b)
}

function renderHistory() {
    const history = retrieveHistory()
    if(history == null) return yourBestTimeDiv.style.display = "none"
    yourBestTimeDiv.style.display = "flex"

    recordsDiv.innerHTML = ""

    history.splice(0,3).forEach(history => {
        const record = document.createElement('div')
        record.classList.add('record')
        record.innerHTML = `${history} sec`
        recordsDiv.appendChild(record)
    })
}

function storeNewRecord(record) {
    let history = retrieveHistory()
    // if user is new, create new history array
    if(history == null) history = []
    // limit history array to ten elements
    if(history.length === 10) history.pop()
    history.push(parseFloat(record))
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(history))
    renderHistory()
}

renderHistory()