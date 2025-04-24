(()=>{
    'use strict';
    console.log('reading js');
    const back = document.querySelector('#back-arrow')

    function manageItemHover(){
        back.addEventListener('mouseover', () => {
            back.classList.add('itemHover');
        });
        back.addEventListener('mouseout', () => {
            back.classList.remove('itemHover');
        });
    }

    manageItemHover();
    
})();