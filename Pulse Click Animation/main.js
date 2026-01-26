document.addEventListener('click', function(){
    let i = document.createElement('i');
    i.setAttribute('class','pulse');
    document.body.appendChild(i);
    i.style.top = event.pageY + 'px';
    i.style.left = event.pageX + 'px';


    setTimeout(function(){
        document.body.removeChild(i);
    }, 500)
})