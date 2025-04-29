(()=>{
    'use strict';
    console.log('reading js');
    const back = document.querySelector('#back-arrow')
    const html = document.querySelector('html')

    function manageItemHover(){
        back.addEventListener('mouseover', () => {
            back.classList.add('itemHover');
        });
        back.addEventListener('mouseout', () => {
            back.classList.remove('itemHover');
        });
    }

    manageItemHover();

    $.getJSON('data2.json', function(data) { // this is async, so the following will only occur once the data is collected

        console.log(`data.json length: ${data.length}`);

        $.each(data, function(index, item){
            generateRow(item.timestamp, item.fluid, item.ounces);
        });
    });

    function generateRow(timestamp, fluid, ounces){ // takes arguements
        console.log(timestamp, fluid, typeof(fluid), ounces);

        const row = document.createElement('li'); // create an li (row in the #table)

        const section = document.querySelector('section');

        console.log(section.offsetWidth)

        // create the identifier
        const identifier = document.createElement('p');
        identifier.classList.add('identifier');
        identifier.style.backgroundColor = `var(--${fluid})`;

        // create the timestamp
        const timestampP = document.createElement('p');
        timestampP.textContent = timestamp;
        timestampP.classList.add('timestamp');

        // create the fluid label
        const fluidP = document.createElement('p');
        fluidP.textContent = fluid;
        fluidP.classList.add('fluid');
        fluidP.style.width = `${ ounces * (section.offsetWidth / 60)}px`; // the 20 is added so that the shortest bars are the correct length

        // create the ounces label
        const ouncesP  = document.createElement('p');
        ouncesP.textContent = `${ounces}oz`;
        ouncesP.classList.add('ounces');

        // the following order deterimines appearance in row from left to right
        row.appendChild(timestampP);
        row.appendChild(identifier);
        row.appendChild(fluidP);
        row.appendChild(ouncesP);

        //finally, append the finished row
        $('#table').append(row);
    };

})();