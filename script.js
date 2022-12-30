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
function backspaceDigit() {
    if (resetEquationFlag) resetOperation();
    currentValue = currentValue.slice(0, -1)
}

function addDigit(value) {
    if (resetEquationFlag) resetOperation();
    if (currentValue.length>=maxLineDigits) return;
    currentValue=currentValue+value.toString();
}

function addDot() {
    if (resetEquationFlag) resetOperation();
    if (currentValue==='') currentValue='0';
    if (!currentValue.includes('.')) addDigit('.');
}

// Calculator Actions

function resetOperation() {
    leftOperandValue = null;
    operatorFunction = null;
    rightOperandValue = null;
    resetEquationFlag = false;
}

function resetAll() {
    currentValue = '';
    resetOperation();
}

function pressEquals() {
    calculate();
    resetEquationFlag = true;
}

function calculate() {
    if (operatorFunction==null || 
        rightOperandValue!=null ||
        currentValue==='') return;
    rightOperandValue = parseFloat(currentValue);
    result = operate(operatorFunction, leftOperandValue, rightOperandValue);
    currentValue = result.toString();
}

function pressOperator(opr) {
    if (currentValue==='') {
        if (leftOperandValue!=null) operatorFunction = opr;
    } else {
        calculate(); // calculate if possible
        rightOperandValue = null;
        leftOperandValue = parseFloat(currentValue);
        operatorFunction = opr;
        currentValue = '';
        resetEquationFlag = false;
    };
}

// Display interation functions
function pressButton(e) {
    const btn = e.target.getAttribute('data-key');

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
            pressEquals();
            break;
        case 'back':
            backspaceDigit();
            break;
        case 'clear':
            resetAll();
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
    resetAll();
}

function updateEquation() {
    // Display the in progress equation
    const lhsString = leftOperandValue != null ? leftOperandValue : '';
    const rhsString = rightOperandValue != null ? rightOperandValue : '';
    const operatorString = operatorFunction != null ? operatorFunction.name : '';
    const equalsString = rightOperandValue != null ? '=' : '';
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

let currentValue = '';

let leftOperandValue = null;
let rightOperandValue = null;
let operatorFunction = null;
let resetEquationFlag = false;

// Power off by default, which updates initial display
powerOff();

powerOn(); // TEMP FOR TESTING