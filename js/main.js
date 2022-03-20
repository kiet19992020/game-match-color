import {
    GAME_STATUS,
    GAME_TIME,
    PAIRS_COUNT
} from './constants.js'
import {
    getBackgroundColor,
    getColorElementList,
    getColorListElement,
    getInActiveColorList,
    getPlayAgainButton,
    
} from './selectors.js';
import {
    createTimer,
    getRandomColorPairs, hidePlayAgainButton, setTimmerText, showPlayAgainButton
} from './utils.js';

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING
let timer= createTimer({
    seconds: GAME_TIME,
    onChange: handleTimerChange,
    onFinish: handleTimerFinish
    
})

function handleTimerChange(second) {
    const fullSecond = `${second}`.slice(-2)
    setTimmerText(fullSecond)
}

function handleTimerFinish() {
    console.log('finnish');
    gameState = GAME_STATUS.FINISHED

    setTimmerText('Gamae Over')
    showPlayAgainButton()

}
function changColorBg(color) {
    const bgColor = getBackgroundColor()[0]
    bgColor.style.backgroundColor = color
}
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColorClick(liElement) {
    const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameState)
    const isClicked = liElement.classList.contains('active')
    if (!liElement || shouldBlockClick || isClicked) return
    liElement.classList.add('active')
    selections.push(liElement)
    if (selections.length < 2) return
    
    //check match
    const fisrtColor = selections[0].dataset.color
    const secondtColor = selections[1].dataset.color
    const isMatch = fisrtColor === secondtColor

    
    if (isMatch) {
        //check win
        const isWin = getInActiveColorList().length === 0
        changColorBg(liElement.dataset.color)
        if (isWin) {
            //show button replay
            //show you Win
            showPlayAgainButton()
            setTimmerText('You Win')
            timer.clear()
            gameState = GamepadButton.FINISHED
        }
        selections = []
        return
    }
    //incase of not match
    //remove active  class for 2 li elements
    gameState = GAME_STATUS.BLOCKING
    setTimeout(() => {

        selections[0].classList.remove('active')
        selections[1].classList.remove('active')
        //reset selection
        selections = []
        gameState = GAME_STATUS.PLAYING
    }, 500)
}


function attackEventColorList() {
    const ulElement = getColorListElement()
    if (!ulElement) return

    ulElement.addEventListener('click', (e) => {
        if (e.target.tagName !== 'LI') return
        handleColorClick(e.target)
    })
}

function innitClor() {
    //random 8 paris of colors
    const colorList = getRandomColorPairs(PAIRS_COUNT)

    //bind to li > overlay
    const litList = getColorElementList()
    litList.forEach((liElement, index) => {
        liElement.dataset.color = colorList[index]
        const overlayElement = liElement.querySelector('.overlay')
        if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
    })

}
function resetGame() {
    //reset globacl vars

    gameState = GAME_STATUS.PLAYING
    selections  = []
    //reset DOM elemens
    //remove active class from li
    // hide replay button
    // clear timer text
    const colorElementList = getColorElementList()
    for (const colorElement of colorElementList) {
        colorElement.classList.remove('active')
    }
    hidePlayAgainButton()
    setTimmerText('')
    innitClor()

    //re-generate new colors
    startTimer()
}
function attachEventForPlayAgainButton() {
    const playAgainButton = getPlayAgainButton()

    playAgainButton.addEventListener('click', resetGame)
}

function startTimer() {
    timer.start()
}
(() => {
    innitClor()
    attackEventColorList()
    attachEventForPlayAgainButton()
    startTimer()
})()