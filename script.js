// Calculator Functions
function add(a, b) {
    return a+b;
}

function subtract(a,b) {
    return a-b;
}

function multiply(a,b) {
    return a*b;
}

function divide(a,b) {
    return a/b;
}

function operate(operator, a, b) {
    return operator(a,b);
}

// Calculator Actions
function backspaceDigit() {
    displayString = displayString.slice(0, -1);
    if (displayString=='') displayString='0';
}

function addDigit(value) {
    if (displayString.length>=maxLineDigits) return;
    if (displayString==='0') {
        displayString=value.toString();
    } else
    {
        displayString=displayString+value.toString();
    }
}

function addDot() {
    if (displayString==='0') displayString='0.';
    if (!displayString.includes('.')) addDigit('.');
}

function storeNumber(number) {
    numbersArray.push(number);
}

function storeOperator(opr) {
    operatorsArray.push(opr);
}

function setDigits(number) {
    displayString = number.toString(); 
}

function calculate() {
    storeNumber(parseFloat(displayString));
    const length = numbersArray.length;
    let total = numbersArray[0];
    for (let i=1; i<length; i++) {
        if (typeof operatorsArray[i-1] == 'function') {
            total = operate(operatorsArray[i-1], total, numbersArray[i]);
        }
    }
    clearAll();
    setDigits(total);
}

function clearAll() {
    displayString = '0';
    numbersArray = [];
    operatorsArray = [];
}

// Display interation functions
function pressButton(e) {
    const btn = e.target.getAttribute('data-key');
    console.log(e.target);

    // Check for power button first
    if (btn==='power') powerOn();
    if (powerOn===false) return;

    // Run function depending on button pressed
    switch (btn) {
        case 'add':
            pressOperator(add);
            break;
        case 'subtract':
            pressOperator(subtract);
            break;
        case 'multiply':
            pressOperator(multiply);
            break;
        case 'divide':
            pressOperator(divide);
            break;
        case 'digit':
            addDigit(e.target.innerHTML);
            break;
        case 'equals':
            calculate();
            break;
        case 'back':
            backspaceDigit();
            break;
        case 'clear':
            clearAll();
            break;
        case 'dot':
            addDot();
            break;
        case 'sleep':
            powerOff();
            break;
        case 'power':
            break;
        default:
            console.error('Invalid Button');
    }
    updateDisplay();
}

function pressOperator(opr) {
    storeOperator(opr);
    storeNumber(parseFloat(displayString));
    displayString = '0';
}

function powerOff() {
    poweredOn = false;
    output.style.display = 'none';
    display.style.backgroundImage = "url(./images/face-sleep.gif)"
}

function powerOn() {
    poweredOn = true;
    output.style.display = 'block';
    display.style.backgroundImage = "url(./images/face-smile.png)"
    clearAll();
}

function updateDisplay() {
    const stringSliced = displayString.slice(0,maxLineDigits);
    output.innerHTML = stringSliced;
}

// Grab relevant elements from DOM
const buttons = document.querySelectorAll('.button');
const output = document.querySelector('.output');
const display = document.querySelector('.display');

// Add Event Listeners
buttons.forEach(digit => digit.addEventListener('mousedown', pressButton));

// Constant values
const maxLineDigits = 14;

// Global values
let poweredOn = false;
let displayString = '0';
let numbersArray = [];
let operatorsArray = [];

// Power off by default
powerOff();