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
    if (resetEquationFlag) resetEquation();
    currentValue = currentValue.slice(0, -1)
}

function addDigit(value) {
    if (resetEquationFlag) resetEquation();
    if (currentValue.length>=maxLineDigits) return;
    currentValue=currentValue+value.toString();
}

function addDot() {
    if (resetEquationFlag) resetEquation();
    if (currentValue==='') currentValue='0';
    if (!currentValue.includes('.')) addDigit('.');
}

// Calculator Actions
function resetEquation() {
    leftOperandValue = null;
    operatorFunction = null;
    rightOperandValue = null;
    resetEquationFlag = false;
}

function resetAll() {
    currentValue = '';
    resetEquation();
}

function calculate() {
    rightOperandValue = parseFloat(currentValue);
    result = operate(operatorFunction, leftOperandValue, rightOperandValue);
    currentValue = result.toString();
}

function executeEquals() {
    if (operatorFunction!=null && 
        rightOperandValue==null &&
        currentValue!='') {  
        calculate();
        resetEquationFlag = true;
    }
}

function executeOperator(opr) {
    if (currentValue==='') {
        // Allow operatorFunction to change if left operand is already assigned
        if (leftOperandValue!=null) operatorFunction = opr;
    } else {
        if (operatorFunction!=null && 
            rightOperandValue==null &&
            currentValue!='') {  
            calculate();
        };
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
    if (btn==='power') {
        powerOn();
    } else {
        setDislayImageInteraction();
    }
    if (poweredOn===false) return;

    // Run function depending on button pressed
    switch (btn) {
        case 'add':
            executeOperator(add);
            break;
        case 'subtract':
            executeOperator(subtract);
            break;
        case 'multiply':
            executeOperator(multiply);
            break;
        case 'divide':
            executeOperator(divide);
            break;
        case 'digit':
            addDigit(e.target.innerHTML);
            break;
        case 'equals':
            executeEquals();
            setDisplayImageTemporary(
                newUrl=happyImageUrl, 
                timeMs=1000);
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
    updateOutput();
}

function setDislayImageInteraction() {
    // Set to smile when interacting
    displayElem.style.backgroundImage = smileImageUrl;

    if (smileTimeout!=null) {
        clearTimeout(smileTimeout);
    }
    smileTimeout = setTimeout(function() {
        displayElem.style.backgroundImage = defaultImageUrl;
    smileTimeout = null;
    }, 5000);
}

function setDisplayImageTemporary(newUrl, timeMs) {
    displayElem.style.backgroundImage = newUrl;
    setTimeout(function() {
        displayElem.style.backgroundImage = defaultImageUrl;
    }, timeMs);
}

function powerOff() {
    poweredOn = false;
    equationElem.style.display = 'none';
    outputElem.style.display = 'none';
    defaultImageUrl = sleepImageUrl;
    displayElem.style.backgroundImage = defaultImageUrl;
}

function powerOn() {
    poweredOn = true;
    equationElem.style.display = 'block';
    outputElem.style.display = 'block';
    defaultImageUrl = straightImageUrl;
    displayElem.style.backgroundImage = defaultImageUrl;
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

function updateOutput() {
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
const sleepImageUrl = "url(./images/face-sleep.gif)";
const smileImageUrl = "url(./images/face-smile.png)";
const happyImageUrl = "url(./images/face-happy.png)";
const straightImageUrl = "url(./images/face-straight.png)";
const worriedImageUrl = "url(./images/face-worried.png)";

let defaultImageUrl = sleepImageUrl;
let smileTimeout = null;

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