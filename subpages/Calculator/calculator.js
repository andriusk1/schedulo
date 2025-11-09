let currentInput = '';
let operator = '';
let previousInput = '';

function appendNumber(num) {
  currentInput += num;
  updateDisplay();
}

function setOperation(op) {
  if (currentInput === '') return;
  if (previousInput !== '') calculate();
  operator = op;
  previousInput = currentInput;
  currentInput = '';
}

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

function clearDisplay() {
  currentInput = '';
  previousInput = '';
  operator = '';
  updateDisplay();
}

function updateDisplay() {
  document.getElementById('display').innerText = currentInput || '0';
}
