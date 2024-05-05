import CSS from './style.css'

class TimerModel {
    constructor() {
        this._time = 0
        this._intervalID = null
        this.limit = 0
    }

    set(seconds) {
        this._time = seconds
    }

    start(callback) {
        this._intervalID = setInterval(() => {
            this._countDown()
            callback(this.getTime())
        }, 1000)
    } //need include option to count up

    stop() {
        clearInterval(this._intervalID)
    }

    reset() {
        this._time = 0;
    }

    getTime() {
        return this._time
    }

    _countUp() {
        this._time++
    }

    _countDown() {
        this._time--
        if (this._time <= 0) this.stop()
    }
}

class TimerController {
    constructor(display, input, controls) { //controls and input could fall under one
        this.model = new TimerModel()
        this.view = new TimerView(display)
        this.input = input
        this.controls = controls

        this.input.bindInputChange(this.handleSetTime)
        this.controls.bindTimerStart(this.handleTimerStart)
        this.controls.bindTimerStop(this.handleTimerStop)
        this.controls.bindTimerReset(this.handleTimerReset)

        this.init()
    }

    init() {
        this.model.reset()
        this.view.updateDisplay(this.model.getTime())
    }

    handleSetTime = (value) => {
        this.model.set(value) //could move below line into a callback in model.set(), rather than calling this.model.getTime()
        this.view.updateDisplay(this.model.getTime()) 
    }

    handleTimerStart = () => {
        this.model.start((time) => {
            this.view.updateDisplay(time)
        })
    }

    handleTimerStop = () => {
        this.model.stop()
    }

    handleTimerReset = () => {
        this.model.reset()
        this.view.updateDisplay(this.model.getTime())
        this.input.reset()
    }
}

class TimerView {
    constructor(display) {
        this.display = display
    }

    updateDisplay(seconds) {
        this.display.update(seconds)
    }
}

class HMS_Display {
    constructor(element, styles = {}) {
        this.element = element
        this.styles = styles
    }

    update(timeInSeconds) {
        this.element.textContent = this.format(timeInSeconds)
    }

    format(seconds) {
        let d = Number(seconds);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = (h > 0 ? (h > 9 ? h : '0' + h) : "00") + ':'
        var mDisplay = (m > 0 ? (m > 9 ? m : '0' + m) : "00") + ':'
        var sDisplay = (s > 0 ? (s > 9 ? s : '0' + s) : "00")
        return hDisplay + mDisplay + sDisplay; 
    }

    exceeded() {
        let style = this.styles['exceeded']
        this.element.classList.add(style)
    }
    
    finished() {
        let style = this.styles['finished']
        this.element.classList.add(style)
    }
        
    reset(seconds) {
        for (let style in this.styles) {
            if (this.styles.hasOwnProperty(style)) {
                let styleName = this.styles[style]
                this.element.classList.remove(styleName)
            }
        }
        this.updateDisplay(seconds)
    }
}

class HMS_Input {
    constructor(inputs = {}) {
        this.timeInSeconds = 0
        this.hInput = inputs.h
        this.mInput = inputs.m
        this.sInput = inputs.s
        this.inputs =  [this.hInput, this.mInput, this.sInput]
    }

    update() {
        let hToS = Number(this.hInput.value) * 3600
        let mToS = Number(this.mInput.value) * 60
        let sToS = Number(this.sInput.value)
        this.timeInSeconds = hToS + mToS + sToS
    }

    getValue() {
        return this.timeInSeconds
    }

    reset() {
        for (let input of this.inputs) {
            input.value = '00'
        }
    }

    bindInputChange(handler) {
        for (let input of this.inputs) {
            input.addEventListener('change', () => {
                this.update()
                handler(this.getValue())
            })
        }
    }
}

class Timer_Controls {
    constructor(els = {}) {
        this.start = els.start
        this.stop = els.stop
        this.reset = els.reset
    }

    bindTimerStart(handler) {
        this.start.addEventListener('click', () => {
            handler()
        })
    }

    bindTimerStop(handler) {
        this.stop.addEventListener('click', () => {
            handler()
        })
    }

    bindTimerReset(handler) {
        this.reset.addEventListener('click', () => {
            handler()
        })
    }
}

function init() {
    let displayCont = document.querySelector('.display-container')
    let displayEl = displayCont.querySelector('.display')
    let displayStyles = {
        exceeded: 'timer-exceeded',
        finished: 'timer-finished',
    }
    let display = new HMS_Display(displayEl, displayStyles)
    
    let inputCont = document.querySelector('.input-container')
    let hSelect = inputCont.querySelector('[name="hour"]')
    let mSelect = inputCont.querySelector('[name="minute"]')
    let sSelect = inputCont.querySelector('[name="second"]')
    createHMSOptions([hSelect, mSelect, sSelect])
    let inputEls = { h : hSelect, m : mSelect, s : sSelect }
    let input = new HMS_Input(inputEls)
    
    let controlCont = document.querySelector('.control-container')
    let startBtn = controlCont.querySelector('.start')
    let pauseBtn = controlCont.querySelector('.stop')
    let resetBtn = controlCont.querySelector('.reset')
    let controlEls = { start: startBtn, stop: pauseBtn, reset: resetBtn}
    let controls = new Timer_Controls(controlEls)
    
    let timer = new TimerController(display, input, controls)
}

function createHMSOptions(hmsInputs) {
    let optionHTML = (value) => {
        let optValue = value < 10 ? '0' + value : value
        let option = document.createElement('option')
        option.value = optValue
        option.textContent = optValue
        return option
    }

    for (let input of hmsInputs) {
        for (let i = 0 ; i < Number(input.dataset.maxvalue) + 1 ; i++) {
            let html = optionHTML(i)
            input.appendChild(html)
        }
    }
}

init()