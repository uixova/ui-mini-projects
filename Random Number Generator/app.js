const generateBtn = document.querySelector('.generate-btn'); 
const numberArea = document.getElementById('number-area');
const inputField = document.getElementById('number');
const pastNumberElements = document.querySelectorAll('.past-number');

let history = [];

function generate() {
    const inputVal = inputField.value.trim();

    if (inputVal === "" || isNaN(inputVal)) {
        alert("Lütfen geçerli bir sayı girin!");
        return; 
    }

    const maxNumber = parseInt(inputVal);

    const result = Math.floor(Math.random() * (maxNumber + 1));

    numberArea.textContent = result;

    history.unshift(result);

    if (history.length > 5) {
        history.pop();
    }

    history.forEach((num, index) => {
        pastNumberElements[index].textContent = num;
        pastNumberElements[index].style.opacity = "1";
    });

    numberArea.style.transform = "scale(1.2)";
    numberArea.style.display = "inline-block"; 
    numberArea.style.transition = "0.1s";
    
    setTimeout(() => {
        numberArea.style.transform = "scale(1)";
    }, 100);
}

generateBtn.addEventListener('click', generate);