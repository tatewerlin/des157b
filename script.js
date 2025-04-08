(()=>{
    'use strict';
    console.log('reading js');
    const mySwitch = document.querySelector("#switch");
    const body = document.querySelector('body');
    const html = document.querySelector('html');

    const links = document.querySelectorAll("#clouds ul a");
    const arrows = document.querySelectorAll('.link-arrow');
    const switchSpans = document.querySelectorAll('#switch span');

    let switchCounter = 0; // stores the number of times the switch has been clicked

    changeColors(switchCounter); // ensures everything is the right color
    hideArrows();
    manageLinkHover();
    manageSwitch();

    function hideArrows(){ // hide the arrows on page load
        for (let i=0; i<arrows.length; i++){
            arrows[i].classList.add('hidden');
        }
    }

    function manageLinkHover(){
        for (let i=0; i<links.length; i++){
            links[i].addEventListener('mouseover', () => {
                arrows[i].classList.toggle('hidden');
                if (switchCounter%2!==0){ // darkmode colors here
                    links[i].style.color = 'var(--default-light)';
                }
                else{ // lightmode colors here
                    links[i].style.color = 'var(--default-dark)';
                }
            });
            links[i].addEventListener('mouseout', () => {
                arrows[i].classList.toggle('hidden');
                links[i].style.color = 'var(--offdark)';
            })
        }
    }

    function manageSwitch(){ // manage behavior when switch is clicked
        mySwitch.addEventListener('click', () => {
            switchCounter++;
            console.log('switch flipped');
            changeColors(switchCounter);
        });
    }

    function changeColors(s){ // updates all colors
        if (s%2!==0){ // darkmode colors here
            body.style.backgroundColor = 'var(--default-dark)';
            html.style.color = 'var(--default-light)';
            switchSpans[0].style.color = 'var(--offdark)';
            switchSpans[1].style.color = 'var(--default-light)';
        }
        else{ // lightmode colors here
            body.style.backgroundColor = 'var(--default-light)';
            html.style.color = 'var(--default-dark)';
            switchSpans[0].style.color = 'var(--default-dark)';
            switchSpans[1].style.color = 'var(--offlight)';
        }
    }


})();