(()=>{
    'use strict';
    console.log('reading js');
    const uls = document.querySelectorAll('#clouds ul');
    
    //styleLinks(); // sets the background color for each link cloud independently

    function styleLinks(){
        for(let i=0; i<uls.length; i++){
            let thisLink = uls[i].querySelectorAll('a');
            let colorString = `var(--link-bg-${i+1})`;
            for(let j=0; j<thisLink.length; j++){
                thisLink[j].style.backgroundColor = colorString;
                thisLink[j].style.borderBottomColor = colorString;
                thisLink[j].addEventListener('mouseover', () => {
                    thisLink[j].style.borderBottomColor = 'var(--default-dark)';
                    console.log('hovering')
                });
                thisLink[j].addEventListener('mouseout', () => {
                    thisLink[j].style.borderBottomColor = colorString;
                });
            }
        }
    }
})();