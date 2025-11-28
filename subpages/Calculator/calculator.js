// muutujate defineerimine
let currentInput = '';
let operator = '';
let previousInput = '';

// numbri vajutamise funktsioon
function appendNumber(num) {
  currentInput += num;
  updateDisplay();
}

// Tehte seadistamise funktsioon
function setOperation(op) {
  if (currentInput === '') return;
  if (previousInput !== '') calculate();
  operator = op;
  previousInput = currentInput;
  currentInput = '';
}

// arvutamise funktsioon
function calculate() {
  let result;
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  if (isNaN(prev) || isNaN(curr)) return;

  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '*':
      result = prev * curr;
      break;
    case '/':
      result = curr === 0 ? 'Error' : prev / curr;
      break;
    default:
      return;
  }

  currentInput = result.toString();
  operator = '';
  previousInput = '';
  updateDisplay();
}

// lahtri tühjendamise funktsioon
function clearDisplay() {
  currentInput = '';
  previousInput = '';
  operator = '';
  updateDisplay();
}

// lahtri värskendamise funktsioon
function updateDisplay() {
  document.getElementById('display').innerText = currentInput || '0';
}

// Allikas: https://www.geeksforgeeks.org/javascript/javascript-calculator/