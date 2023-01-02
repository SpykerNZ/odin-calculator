// Types
type ImageUrls = {
  sleep: string;
  smile: string;
  happy: string;
  straight: string;
  worried: string;
};

type Operator = (a: number, b: number) => number;

type BMOExpression = keyof ImageUrls;

// Calculator Functions
function add(a: number, b: number): number {
  return a + b;
}

function subtract(a: number, b: number): number {
  return a - b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

function divide(a: number, b: number): number {
  return a / b;
}

function operate(func: Operator, a: number, b: number): number {
  return func(a, b);
}

// Digit Actions
function backspaceDigit() {
  if (equationComplete) resetAll();
  currentValue = currentValue.slice(0, -1);
}

function addDigit(value: string) {
  if (equationComplete) resetAll();
  if (currentValue.length >= maxLineDigits) return;
  currentValue = currentValue + value.toString();
}

function addDot() {
  if (equationComplete) resetAll();
  if (currentValue === "") currentValue = "0";
  if (!currentValue.includes(".")) addDigit(".");
}

// Calculator actions
function resetAll() {
  currentValue = "";
  leftOperandValue = null;
  operatorFunction = null;
  rightOperandValue = null;
  equationComplete = false;
}

function executeEquals() {
  if (
    typeof operatorFunction === "function" &&
    leftOperandValue != null &&
    rightOperandValue == null &&
    currentValue !== ""
  ) {
    rightOperandValue = parseFloat(currentValue);
    let result = operate(operatorFunction, leftOperandValue, rightOperandValue);
    currentValue = result.toString();
    equationComplete = true;
    if (!isFinite(result)) {
      currentValue = divideByZeroErrorString;
    }
  }
  return equationComplete;
}

function executeOperator(opr: Operator) {
  // If nothing was input into the display
  if (currentValue === "") {
    // If an operator was already set, allow it to change.
    if (typeof operatorFunction === "function") operatorFunction = opr;
  } else {
    // If press another operator consecutively
    if (typeof operatorFunction === "function") {
      executeEquals();
      equationComplete = false;
    }
    // Set the left hand side of the equation
    leftOperandValue = parseFloat(currentValue);
    currentValue = "";
    operatorFunction = opr;
    rightOperandValue = null;
  }
}

// Display interation functions
function pressButton(e: Event) {
  if (!(e.target instanceof Element)) {
    throw Error("CRITICAL ERROR");
  }

  const btn = e.target.getAttribute("data-key");

  // Check for power button first
  if (btn === "power") {
    powerOn();
    return;
  }

  // Don't run if not powered
  if (poweredOn === false) return;

  // Change display when interacted with
  setSmileTemporary();

  // Run function depending on button pressed
  switch (btn) {
    case "add":
      executeOperator(add);
      operatorShorthand = "+";
      break;
    case "subtract":
      executeOperator(subtract);
      operatorShorthand = "-";
      break;
    case "multiply":
      executeOperator(multiply);
      operatorShorthand = "x";
      break;
    case "divide":
      executeOperator(divide);
      operatorShorthand = "÷";
      break;
    case "digit":
      addDigit(e.target.innerHTML);
      break;
    case "equals":
      if (executeEquals()) {
        setHappyTemporary();
      }
      break;
    case "back":
      backspaceDigit();
      break;
    case "clear":
      resetAll();
      break;
    case "dot":
      addDot();
      break;
    case "sleep":
      powerOff();
      break;
    case "power":
      break;
    default:
      console.error("Invalid Button");
  }

  if (currentValue === divideByZeroErrorString) {
    setWorriedOverride();
  }

  updateEquation();
  updateOutput();
}

function updateEquation() {
  const lhsString = leftOperandValue != null ? leftOperandValue : "";
  const rhsString = rightOperandValue != null ? rightOperandValue : "";
  const operatorString = operatorFunction != null ? operatorShorthand : "";
  const equalsString = rightOperandValue != null ? "=" : "";
  equationElem.innerHTML = `${lhsString}
                          ${operatorString} 
                          ${rhsString} 
                          ${equalsString}`;
}

function updateOutput() {
  const stringSliced = currentValue.slice(0, maxLineDigits);
  outputElem.innerHTML = stringSliced;
}

// Expression Functions
function setBgDisplay(imageUrl: string) {
  baseImageUrl = imageUrl;
  displayElem.style.backgroundImage = baseImageUrl;
}

function setSmileTemporary() {
  displayElem.style.backgroundImage = imageUrls.smile;

  if (smileTimeout != null) clearTimeout(smileTimeout);

  smileTimeout = setTimeout(function () {
    displayElem.style.backgroundImage = baseImageUrl;
    smileTimeout = null;
  }, smileTimeMs);
}

function setHappyTemporary() {
  displayElem.style.backgroundImage = imageUrls.happy;

  if (happyTimeout != null) clearTimeout(happyTimeout);

  happyTimeout = setTimeout(function () {
    if (poweredOn) {
      displayElem.style.backgroundImage = imageUrls.smile;
    } else {
      displayElem.style.backgroundImage = imageUrls.sleep;
    }
    happyTimeout = null;
  }, happyTimeMs);
}

function setWorriedOverride() {
  if (smileTimeout != null) clearTimeout(smileTimeout);
  if (happyTimeout != null) clearTimeout(happyTimeout);
  displayElem.style.backgroundImage = imageUrls.worried;
}

// Power Functions
function powerOff() {
  poweredOn = false;
  equationElem.style.display = "none";
  outputElem.style.display = "none";
  setBgDisplay(imageUrls.sleep);
  resetAll();
}

function powerOn() {
  poweredOn = true;
  equationElem.style.display = "block";
  outputElem.style.display = "block";
  setBgDisplay(imageUrls.straight);
  resetAll();
}

function preloadImages() {
  let key: keyof ImageUrls;
  for (key in imageUrls) {
    let img = new Image();
    img.src = imageUrls[key].substring(
      imageUrls[key].indexOf("(") + 1,
      imageUrls[key].indexOf(")")
    );
  }
}

function checkElementNull(elem: Element | null): HTMLElement {
  if (!elem) {
    throw Error("Element is null!");
  }
  if (!(elem instanceof HTMLElement)) {
    throw Error("Element is not HTML!");
  }
  return elem;
}

// Grab relevant elements from DOM
const buttonsElem = document.querySelectorAll(".button");
const outputElem = checkElementNull(document.querySelector(".output"));
const equationElem = checkElementNull(document.querySelector(".equation"));
const displayElem = checkElementNull(document.querySelector(".display"));

// Add Event Listeners
buttonsElem.forEach((digit) =>
  digit.addEventListener("mousedown", pressButton)
);

// Constant variables
const imageUrls: ImageUrls = {
  sleep: "url(./images/face-sleep.gif)",
  smile: "url(./images/face-smile.png)",
  happy: "url(./images/face-happy.png)",
  straight: "url(./images/face-straight.png)",
  worried: "url(./images/face-worried.png)",
};

const maxLineDigits = 14;
const smileTimeMs = 5000;
const happyTimeMs = 1000;

const divideByZeroErrorString = "%ERROR%";

// Global variables
let poweredOn = false;

let currentValue: string = "";
let operatorShorthand: string | null = null;

let leftOperandValue: number | null = null;
let rightOperandValue: number | null = null;
let operatorFunction: Operator | null = null;

let equationComplete: boolean = false;

let baseImageUrl: string = imageUrls.sleep;
let smileTimeout: number | null = null;
let happyTimeout: number | null = null;

// Power off by default, which updates initial display
preloadImages();
powerOff();
