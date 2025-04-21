(()=>{
    'use strict';
    console.log('reading js');

    const back = document.querySelector('#back-arrow')
    back.addEventListener('mouseover', () => {
        back.classList.add('itemHover');
    });
    back.addEventListener('mouseout', () => {
        back.classList.remove('itemHover');
    });
})();