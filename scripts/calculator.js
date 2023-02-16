let displayValue = '0';
let firstOperand = null;
let secondOperand = null;
let firstOperator = null;
let secondOperator = null;
let result = null;
const buttons = document.querySelectorAll('button');

window.addEventListener('keydown', function(e){
    const k = e.key;
    console.log('key: '+k);
    const regex = /[^\s]+/;
    // have to appl a regex since some keys has several classes applied
    const key = document.querySelector([`[data-key="${k}"]`]);
    key.click();
    var classCurrent=key.classList.toString().match(regex);
    console.log("class   -> "+classCurrent);9
    const classToApply = {
        operand: "operand:active",
        operandSpecial: "operandSpecial:active",
        clear: "clear:active",
        sign: "sign:active",
        decimal: "decimal:active",
        percent: "percent:active"
        };
    // This will apply the same css effect as we do when manually click 
    key.classList.replace(classCurrent,classToApply[classCurrent]);
    setTimeout(function () {
        key.classList.replace(classToApply[classCurrent],classCurrent);
    }, 100);
    console.log(key.classList);
});

function updateDisplay() {
    const display = document.getElementById('display');
    display.innerText = displayValue;
    if(displayValue.length > 9) {
        display.innerText = displayValue.substring(0, 9);
    }
}
  
updateDisplay();

function clickButton() {
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            if(buttons[i].classList.contains('operand')) {
                inputOperand(buttons[i].value);
                updateDisplay();
            } else if(buttons[i].classList.contains('operator')) {
                inputOperator(buttons[i].value);      
            /*
                Depending of the Button cliked class we will call the correspondent function 
                and update the calculator display 
            */
            } else if(buttons[i].classList.contains('operand-special')) {
                console.log(buttons[i].value);
                if(buttons[i].classList.contains('sqrt')) {
                    inputSqrt(displayValue);
                    updateDisplay();
                } else if(buttons[i].classList.contains('factorial')) {
                    inputFactorial(displayValue);
                    updateDisplay();
                } else if(buttons[i].classList.contains('e_to_x')) {
                    inputEtoX(displayValue);
                    updateDisplay();
                }else {
                    inputLogBase10(displayValue);
                    updateDisplay();
                } 
            } else if(buttons[i].classList.contains('equals')) {
                inputEquals();
                updateDisplay();
            } else if(buttons[i].classList.contains('decimal')) {
                inputDecimal(buttons[i].value);
                updateDisplay();
            } else if(buttons[i].classList.contains('percent')) {
                inputPercent(displayValue);
                updateDisplay();
            } else if(buttons[i].classList.contains('sign')) {
                inputSign(displayValue);
                updateDisplay();
            } else if(buttons[i].classList.contains('clear'))
                clearDisplay();
                updateDisplay();
        }
    )}
}

clickButton();

function inputOperand(operand) {
    if(firstOperator === null) {
        if(displayValue === '0' || displayValue === 0) {
            //1st click - handles first operand input
            displayValue = operand;
        } else if(displayValue === firstOperand) {
            //starts new operation after inputEquals()
            displayValue = operand;
        } else {
            displayValue += operand;
        }
    } else {
        //3rd/5th click - inputs to secondOperand
        if(displayValue === firstOperand) {
            displayValue = operand;
        } else {
        displayValue += operand;
        }
    }
}

function inputOperator(operator) {
    if(firstOperator != null && secondOperator === null) {
        //4th click - handles input of second operator
        secondOperator = operator;
        secondOperand = displayValue;
        result = operate(Number(firstOperand), Number(secondOperand), firstOperator);
        displayValue = roundAccurately(result, 15).toString();
        firstOperand = displayValue;
        result = null;
    } else if(firstOperator != null && secondOperator != null) {
        //6th click - new secondOperator
        secondOperand = displayValue;
        result = operate(Number(firstOperand), Number(secondOperand), secondOperator);
        secondOperator = operator;
        displayValue = roundAccurately(result, 15).toString();
        firstOperand = displayValue;
        result = null;
    } else { 
        //2nd click - handles first operator input
        firstOperator = operator;
        firstOperand = displayValue;
    }
}

function inputEquals() {
    //hitting equals doesn't display undefined before operate()
    if(firstOperator === null) {
        displayValue = displayValue;
    } else if(secondOperator != null) {
        //handles final result
        secondOperand = displayValue;
        result = operate(Number(firstOperand), Number(secondOperand), secondOperator);
        if(result === 'lmao') {
            displayValue = 'lmao';
        } else {
            displayValue = roundAccurately(result, 15).toString();
            firstOperand = displayValue;
            secondOperand = null;
            firstOperator = null;
            secondOperator = null;
            result = null;
        }
    } else {
        //handles first operation
        secondOperand = displayValue;
        result = operate(Number(firstOperand), Number(secondOperand), firstOperator);
        if(result === 'lmao') {
            displayValue = 'lmao';
        } else {
            displayValue = roundAccurately(result, 15).toString();
            firstOperand = displayValue;
            secondOperand = null;
            firstOperator = null;
            secondOperator = null;
            result = null;
        }
    }
}

function inputDecimal(dot) {
    if(displayValue === firstOperand || displayValue === secondOperand) {
        displayValue = '0';
        displayValue += dot;
    } else if(!displayValue.includes(dot)) {
        displayValue += dot;
    } 
}

function inputPercent(num) {
    displayValue = (num/100).toString();
}

function inputSign(num) {
    displayValue = (num * -1).toString();
}

/*
    Function to calc square root of a number 
*/
function inputSqrt(num) {
    displayValue = String((Math.sqrt(num))).substring(0, 9);
    console.log(displayValue);
}

/*
    Function to calc log base10 of x 
*/
function inputLogBase10(num) {
    displayValue = String((Math.log10(num))).substring(0, 9);
    console.log(displayValue);
}

/*
    Function to calc factorial fo x
*/
function inputFactorial(num) {
    let result = 1;
    for (let i = 1; i <= num; i++) {
        result *= i;
    }
    displayValue = String(result).substring(0, 9);
    console.log(displayValue);
}

/*
    Function to calc euler raise to X
*/
function inputEtoX(num) {
    var temp = Math.exp(num);
    displayValue = String(temp).substring(0, 9);
    console.log(displayValue);
    console.log(displayValue);
}

function clearDisplay() {
    displayValue = '0';
    firstOperand = null;
    secondOperand = null;
    firstOperator = null;
    secondOperator = null;
    result = null;
}

function inputBackspace() {
    if(firstOperand != null) {
        firstOperand = null;
        updateDisplay();
    }
}

function operate(x, y, op) {
    if(op === '+') {
        return x + y;
    } else if(op === '-') {
        return x - y;
    } else if(op === '*') {
        return x * y;
    } else if(op === '/') {
        if(y === 0) {
            return 'lmao';
        } else {
        return x / y;
        }
    }
}

function roundAccurately(num, places) {
    return parseFloat(Math.round(num + 'e' + places) + 'e-' + places);
}