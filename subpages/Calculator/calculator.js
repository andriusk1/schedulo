// pop-up window function

function openCalculatorWindow() {
  // Open a new window (popup) with width, height, and position
  const popup = window.open(
    "popup.html",   // file for the calculator content
    "SCHEDULO CALCULATOR",       // window name
    "width=400,height=500,top=100,left=100,resizable=no,scrollbars=no")}


// source https://www.educative.io/answers/how-to-build-a-calculator-in-javascript
// Calculator function start


let currentDisplay = "0";
let resultDisplay=false;

function appendToDisplay(value) {
  if (currentDisplay === "0" || resultDisplay) {
    currentDisplay = value;
  } else {
    currentDisplay += value;
  }
  resultDisplay=false;
  updateDisplay();
}

function updateDisplay() {
  const displayElement = document.getElementById("display");
  displayElement.textContent = currentDisplay;
}

function calculateResult() {
  try {
    const result = eval(currentDisplay);
    currentDisplay += "\n"+ result.toString();
    updateDisplay();
  } catch (error) {
    currentDisplay += "\nError";
    updateDisplay();
  }
  resultDisplay=true;
}

function clearLastElement() {
  currentDisplay = currentDisplay.slice(0, -1);
  if (currentDisplay === "") {
    currentDisplay = "0";
  }
  updateDisplay();
}

function clearDisplay() {
  currentDisplay = "0";
  updateDisplay();
}

// Attach handleOverflow to window resize event
window.addEventListener("resize", handleOverflow);

// Call handleOverflow initially to handle any overflow on page load
handleOverflow();


// Calculator function end