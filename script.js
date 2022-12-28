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
    currentValue = currentValue.slice(0, -1);
    if (currentValue=='') currentValue='0';
}

function addDigit(value) {
    if (currentValue.length>=maxLineDigits) return;
    if (currentValue==='0') {
        currentValue=value.toString();
    } else
    {
        currentValue=currentValue+value.toString();
    }
}

function addDot() {
    if (currentValue==='0') currentValue='0.';
    if (!currentValue.includes('.')) addDigit('.');
}

function cacheNumber(num) {
    numbersArray.push(parseFloat(num));
}

function cacheOperator(opr) {
    operatorsArray.push(opr);
}

function setDigits(value) {
    currentValue = value.toString(); 
}

function calculate() {
    cacheNumber(currentValue);
    const length = numbersArray.length;
    let total = numbersArray[0];
    for (let i=1; i<length; i++) {
        if (typeof operatorsArray[i-1] == 'function') {
            total = operate(operatorsArray[i-1], total, numbersArray[i]);
        }
    }
    cacheNumber(total);
    clearAll();
    setDigits(total);
}

function clearAll() {
    currentValue = '0';
    numbersArray = [];
    operatorsArray = [];
}

// Display interation functions
function pressDigit(e) {
    const digit = e.target.getAttribute('data-key');
    addDigit(digit);
    updateDisplay();
}

function pressOperator(e) {
    const operator = e.target.getAttribute('data-key');
    switch (operator) {
        case 'add':
            cacheOperator(add);
            break;
        case 'subtract':
            cacheOperator(subtract);
            break;
        case 'multiply':
            cacheOperator(multiply);
            break;
        case 'divide':
            cacheOperator(divide);
            break;
        default:
            console.error('Invalid Operator');
    }
    cacheNumber(currentValue);
    currentValue = '0';
}

function pressControl(e) {
    const control = e.target.getAttribute('data-key');
    switch (control) {
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
        default:
            console.error('Invalid Control');
    }
    updateDisplay();
}

function updateDisplay() {
    console.log(currentValue);
    string_sliced = currentValue.slice(0,maxLineDigits);
    display.innerHTML = string_sliced;
}

// Grab relevant elements from DOM
const digits = document.querySelectorAll('.digit');
const operators = document.querySelectorAll('.operator');
const controls = document.querySelectorAll('.control');
const display = document.querySelector('.display');

// Add Event Listeners
digits.forEach(digit => digit.addEventListener('mousedown', pressDigit));
operators.forEach(operator => operator.addEventListener('mousedown', pressOperator));
controls.forEach(control => control.addEventListener('mousedown', pressControl));

// Constant values
const maxLineDigits = 16;

// Global values
let currentValue = '0';
let numbersArray = [];
let operatorsArray = [];