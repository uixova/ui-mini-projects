// let coockieBox = document.querySelector('.coockie-box');
// let acceptCoockie = document.querySelector('.coockie-accept');
// let rejectCoockie = document.querySelector('.coockie-reject');

// acceptCoockie.addEventListener('click', (e) => {
//     coockieBox.style.display = "none";
// });

// rejectCoockie.addEventListener('click', (e) => {
//     coockieBox.style.display = "none";
// });



let coockieBox = document.querySelector('.coockie-box');
let acceptCoockie = document.querySelector('.coockie-accept');
let rejectCoockie = document.querySelector('.coockie-reject');

acceptCoockie.addEventListener('click', (e) => {
    coockieBox.classList.add("hidden");
});

rejectCoockie.addEventListener('click', (e) => {
    coockieBox.classList.add("hidden");
});
