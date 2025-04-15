(()=>{
    'use strict';

    console.log('reading js');

    const fs = document.querySelector(".fa-expand-alt");
    const video = document.querySelector('#myVideo');
    const copy = document.querySelector('#copy');
    let letterContainers = document.querySelectorAll('#copy p');
    let letters = document.querySelectorAll('#copy p span');

    let current = 0;
    appendClass();

    
    function appendClass(){
        setInterval(()=>{
            if (current<letters.length){ // add a condition so that current does not continue to be incremented after classes are added to all letters
                letters[current].classList.add('moving');
                current++;
                console.log(current);
            }
        }, 300);
    }

    fs.addEventListener('click', () => {
        if(!document.fullscreenElement){
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
})();