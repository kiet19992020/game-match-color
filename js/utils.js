import { getPlayAgainButton, getTimerElement } from "./selectors.js"

function shuffle(arr) {
  if(!Array.isArray(arr) || arr.length <= 2 ) return arr
  for(let i  = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i) //Tạo ra 1 con số nhỏ hơn i
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}
export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length]
    })
    
    colorList.push(color)
  }

  const fullColorList = [...colorList,...colorList]
  shuffle(fullColorList)
  return fullColorList 
}

export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  playAgainButton.classList.add('show')
}
export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  playAgainButton.classList.remove('show')
}
export function setTimmerText(text) {
  const timerElenment = getTimerElement()
  timerElenment.textContent = text
}

export function createTimer({seconds, onChange, onFinish}) {

  let interValId = null
  function start() {
    clear()
    let currentSecond = seconds

    interValId = setInterval(()=> {
      onChange?.(currentSecond) //=== if(onChange) onChange(currentSecond)
      currentSecond --;

      if (currentSecond < 0) {
        clear()
        onFinish?.() // ===if(onFinish) OnFinish
      }
    }, 1000)
  }

  function clear(){
    clearInterval(interValId)
  }
  return {
    start,
    clear
  }
}