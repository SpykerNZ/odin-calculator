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

function operate(func, a, b) {
    return func(a,b);
}

// Digit Actions

function resetDigit() {
    currentValue='0';
    resetCurrentValue=false;
}

function backspaceDigit() {
    if (resetCurrentValue) resetDigit();
    currentValue = currentValue.slice(0, -1);
    if (currentValue=='') currentValue='0';
}

function addDigit(value) {
    if (resetCurrentValue) resetDigit();
    if (currentValue.length>=maxLineDigits) return;
    if (currentValue==='0') {
        currentValue=value.toString();
    } else
    {
        currentValue=currentValue+value.toString();
    }
}

function addDot() {
    if (resetCurrentValue) resetDigit();
    if (currentValue==='0') currentValue='0.';
    if (!currentValue.includes('.')) addDigit('.');
}

function setDigits(number) {
    currentValue = number.toString(); 
}

// Calculator Actions

function calculate() {
    if (operatorFunction==null) return;
    rightOperand = parseFloat(currentValue);
    result = operate(operatorFunction, leftOperand, rightOperand);
    currentValue = result.toString();
    resetCurrentValue = true;
    resetOperation = true;
}

function clearAll() {
    currentValue = '0';
    leftOperand = null;
    operatorFunction = null;
    rightOperand = null;
}

function pressOperator(opr) {
    calculate(); // calculate if possible
    rightOperand = null;
    leftOperand = parseFloat(currentValue);
    operatorFunction = opr;
    resetCurrentValue = true;
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
    updateEquation();
    UpdateOutput();
}

function powerOff() {
    poweredOn = false;
    outputElem.style.display = 'none';
    displayElem.style.backgroundImage = "url(./images/face-sleep.gif)"
}

function powerOn() {
    poweredOn = true;
    outputElem.style.display = 'block';
    displayElem.style.backgroundImage = "url(./images/face-smile.png)"
    clearAll();
}

function updateEquation() {
    // Display the in progress equation
    const lhsString = leftOperand != null ? leftOperand : '';
    const rhsString = rightOperand != null ? rightOperand : '';
    const operatorString = operatorFunction != null ? operatorFunction.name : '';
    const equalsString = rightOperand != null ? '=' : '';
    equationElem.innerHTML = `${lhsString} 
                          ${operatorString} 
                          ${rhsString} 
                          ${equalsString}`
}

function UpdateOutput() {
    const stringSliced = currentValue.slice(0,maxLineDigits);
    outputElem.innerHTML = stringSliced;
}

// Grab relevant elements from DOM
const buttonsElem = document.querySelectorAll('.button');
const outputElem = document.querySelector('.output');
const equationElem = document.querySelector('.equation');
const displayElem = document.querySelector('.display');

// Add Event Listeners
buttonsElem.forEach(digit => digit.addEventListener('mousedown', pressButton));

// Constant values
const maxLineDigits = 14;

// Global values
let poweredOn = false;

let currentValue = '0';
let resetCurrentValue = false;
let resetOperation = false;

let leftOperand = null;
let rightOperand = null;
let operatorFunction = null;

// Power off by default, which updates initial display
powerOff();

powerOn(); // TEMP FOR TESTING