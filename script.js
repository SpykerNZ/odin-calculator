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
    if (equationComplete) resetAll();
    currentValue = currentValue.slice(0, -1)
}

function addDigit(value) {
    if (equationComplete) resetAll();
    if (currentValue.length>=maxLineDigits) return;
    currentValue=currentValue+value.toString();
}

function addDot() {
    if (equationComplete) resetAll();
    if (currentValue==='') currentValue='0';
    if (!currentValue.includes('.')) addDigit('.');
}

// Calculator actions
function resetAll() {
    currentValue = '';
    leftOperandValue = null;
    operatorFunction = null;
    rightOperandValue = null;
    equationComplete = false;
}

function executeEquals() {
    if (typeof operatorFunction === 'function' && 
        rightOperandValue==null &&
        currentValue!=='') {
        rightOperandValue = parseFloat(currentValue);
        result = operate(operatorFunction, leftOperandValue, rightOperandValue);
        currentValue = result.toString();
        equationComplete = true;
    }
}

function executeOperator(opr) {
    // If nothing was input into the display
    if (currentValue==='') { 
        // If an operator was already set, allow it to change.
        if (typeof operatorFunction === 'function') operatorFunction = opr;
    } else { 
        // If press another operator consecutively
        if (typeof operatorFunction === 'function') {
            executeEquals();
            equationComplete = false; 
        }
        // Set the left hand side of the equation
        leftOperandValue = parseFloat(currentValue);
        currentValue = '';
        operatorFunction = opr;
        rightOperandValue = null;
    }
}

// Display interation functions
function pressButton(e) {
    const btn = e.target.getAttribute('data-key');

    // Check for power button first
    if (btn==='power') {
        powerOn();
        return;
    }

    // Don't run if not powered
    if (poweredOn===false) return;

    // Change display when interacted with
    setDislayImageInteraction();

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
                newUrl=imageUrls.happy, 
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
    displayElem.style.backgroundImage = imageUrls.smile;

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
        if (smileTimeout!=null && poweredOn) {
            displayElem.style.backgroundImage = imageUrls.smile;
        }
        else
        {
            displayElem.style.backgroundImage = defaultImageUrl;
        }
    }, timeMs);
}

function powerOff() {
    poweredOn = false;
    equationElem.style.display = 'none';
    outputElem.style.display = 'none';
    defaultImageUrl = imageUrls.sleep;
    displayElem.style.backgroundImage = defaultImageUrl;
}

function powerOn() {
    poweredOn = true;
    equationElem.style.display = 'block';
    outputElem.style.display = 'block';
    defaultImageUrl = imageUrls.straight;
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

function preloadImages() {
    for (let key in imageUrls) {
        img = new Image();
        img.src = imageUrls[key].substring(
            imageUrls[key].indexOf('(')+1,
            imageUrls[key].indexOf(")"));
    }
}

// Grab relevant elements from DOM
const buttonsElem = document.querySelectorAll('.button');
const outputElem = document.querySelector('.output');
const equationElem = document.querySelector('.equation');
const displayElem = document.querySelector('.display');

// Add Event Listeners
buttonsElem.forEach(digit => digit.addEventListener('mousedown', pressButton));

// Constant variables
const imageUrls = {
    sleep: "url(./images/face-sleep.gif)",
    smile: "url(./images/face-smile.png)",
    happy: "url(./images/face-happy.png)",
    straight: "url(./images/face-straight.png)",
    worried: "url(./images/face-worried.png)"
}

const maxLineDigits = 14;

// Global variables
let poweredOn = false;

let currentValue = '';

let leftOperandValue = null;
let rightOperandValue = null;
let operatorFunction = null;

let equationComplete = false;

let defaultImageUrl = imageUrls.sleep;
let smileTimeout = null;

// Power off by default, which updates initial display
preloadImages();
powerOff();