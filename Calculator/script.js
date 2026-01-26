document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');
    let currentInput = '0';
    let result = null;
    let operator = null;
    let waitingForSecondOperand = false;

    function updateDisplay(value) {
        if (typeof value === 'string' && (value.includes('Infinity') || value.includes('NaN') || value === 'Hata')) {
            display.value = value;
            return;
        }

        let displayValue = String(value);

        if (displayValue.length > 15 && !displayValue.includes('e')) {
            displayValue = parseFloat(displayValue).toPrecision(15);
        }
        
        display.value = displayValue;
    }

    function calculate(first, second, op) {
        first = parseFloat(first);
        second = parseFloat(second);
        if (isNaN(first) || isNaN(second)) return NaN;

        switch (op) {
            case '+':
                return first + second;
            case '-':
                return first - second;
            case '*':
                return first * second;
            case '/':
                if (second === 0) {
                    alert('Sıfıra bölme hatası!');
                    return 'Hata';
                }
                return first / second;
            default:
                return second;
        }
    }

    function calculatePercentage(number, percentage) {
        return number * (percentage / 100);
    }

    function resetCalculator() {
        currentInput = '0';
        result = null;
        operator = null;
        waitingForSecondOperand = false;
    }

    function isErrorOrSpecial(value) {
        const valStr = String(value);
        return valStr.includes('Infinity') || valStr.includes('NaN') || valStr === 'Hata' || valStr.toLowerCase().includes('e');
    }

    function handleButtonClick(buttonValue, buttonType) {
        if (buttonType === 'number') {
            if (isErrorOrSpecial(currentInput)) {
                 resetCalculator();
            }
            
            if (waitingForSecondOperand) {
                if (result !== null && operator === null) {
                    resetCalculator();
                }
                currentInput = buttonValue;
                waitingForSecondOperand = false;
            } else {
                currentInput = currentInput === '0' ? buttonValue : currentInput + buttonValue;
            }
            updateDisplay(currentInput);
            return;
        }

        if (buttonType === 'decimal') {
            if (isErrorOrSpecial(currentInput)) {
                 resetCalculator();
            }

            if (waitingForSecondOperand) {
                currentInput = '0.';
                waitingForSecondOperand = false;
            } else if (!currentInput.includes('.')) {
                currentInput += buttonValue;
            }
            updateDisplay(currentInput);
            return;
        }

        if (buttonType === 'operator' && buttonValue !== '%') {
            if (isErrorOrSpecial(currentInput)) {
                return; 
            }
            
            const inputValue = parseFloat(currentInput);

            if (result === null && !isNaN(inputValue)) {
                result = inputValue;
            } else if (!waitingForSecondOperand && operator !== null) {
                const calculatedResult = calculate(result, inputValue, operator);
                if (isErrorOrSpecial(calculatedResult)) {
                    resetCalculator();
                    updateDisplay(calculatedResult);
                    return;
                }
                result = calculatedResult;
                updateDisplay(result);
            }

            waitingForSecondOperand = true;
            operator = buttonValue;
            return;
        }
        
        if (buttonValue === '%') {
            if (isErrorOrSpecial(currentInput)) {
                return; 
            }
            
            const inputValue = parseFloat(currentInput);
            if (operator === null) {
                currentInput = calculatePercentage(inputValue, 1).toString();
            } else {
                const percentageValue = calculatePercentage(result, inputValue);
                
                if (operator === '+' || operator === '-') {
                    currentInput = calculate(result, percentageValue, operator).toString();
                } else if (operator === '*' || operator === '/') {
                    currentInput = percentageValue.toString();
                }
                
                result = null;
                operator = null;
                waitingForSecondOperand = true;
            }
            updateDisplay(currentInput);
            return;
        }


        if (buttonType === 'equals') {
            if (operator === null || isErrorOrSpecial(currentInput)) {
                return;
            }
            
            const inputValue = parseFloat(currentInput);
            const calculatedResult = calculate(result, inputValue, operator);
            
            if (isErrorOrSpecial(calculatedResult)) {
                resetCalculator();
                updateDisplay(calculatedResult);
                return;
            }

            updateDisplay(calculatedResult);
            
            result = calculatedResult; 
            operator = null; 
            waitingForSecondOperand = false; 
            currentInput = calculatedResult.toString(); 
            return;
        }

        if (buttonType === 'clear') {
            resetCalculator();
            updateDisplay('0');
            return;
        }

        if (buttonType === 'backspace') {
            // Düzeltme: Hata/Özel String (Infinity, NaN, Hata) veya Bilimsel Gösterim ('e' içeren) varsa geri almayı engelle.
            if (isErrorOrSpecial(currentInput)) {
                return;
            }

            if (waitingForSecondOperand === false && result !== null && operator === null) {
                result = null;
            }

            currentInput = currentInput.slice(0, -1);
            if (currentInput === '' || currentInput === '-') {
                currentInput = '0';
            }
            updateDisplay(currentInput);
            return;
        }
    }

    function resetCalculator() {
        currentInput = '0';
        result = null;
        operator = null;
        waitingForSecondOperand = false;
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.value;
            const type = button.dataset.type;
            handleButtonClick(value, type);
        });
    });
    
    document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key === 'Enter') {
        e.preventDefault();
        handleButtonClick('=', 'equals');
        return;
    }

    if (/[0-9]/.test(key)) {
        handleButtonClick(key, 'number');
    } 
    else if (key === '.' || key === ',') {
        handleButtonClick('.', 'decimal');
    } 
    else if (['+', '-', '*', '/'].includes(key)) {
        handleButtonClick(key, 'operator');
    } 
    else if (key === '=') {
        handleButtonClick('=', 'equals');
    } 
    else if (key === 'Delete' || key.toLowerCase() === 'c') {
        handleButtonClick('C', 'clear');
    } 
    else if (key === 'Backspace') {
        handleButtonClick('←', 'backspace');
    }
});


    resetCalculator();
    updateDisplay('0');
});