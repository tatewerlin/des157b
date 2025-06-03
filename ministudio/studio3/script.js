(()=>{
    'use strict';
    console.log('reading js');

    const colors = {
        static: {
            alt: '90b4dd'
        },
        day: {
            sky: '99e2ff',
            orb: 'ffff00',
            text: '1b1464'
        },
        night: {
            sky: '000000',
            orb: 'ffffff',
            text: '65bbff'
        }
    }

    // manage date and time
    const current = new Date();
    const hour =  current.getHours(); // get the hour from the  date
    const time = current.toLocaleTimeString(); // convert the date to a easier string to read
    console.log(`it is currently: ${current} current hour: ${hour}`);
    $('#time').text(time);

    // get the weather data and populate the page with it
    function getWeather(){
        const api = 'https://api.open-meteo.com/v1/forecast?latitude=38.5449&longitude=-121.7405&hourly=temperature_2m&current=temperature_2m&timezone=America%2FLos_Angeles&forecast_days=1&temperature_unit=fahrenheit';
        $.getJSON(api, function(data){ // get JSON from the api url. jQuery method is async by default
            const returnedTemp = data.hourly.temperature_2m[hour]; // access the temp using the hour integer as index
            const returnedTime = data.hourly.time[hour]; // access the time using the hour integer as index
            console.log(returnedTime, returnedTemp);
            $('#temp').text(`${returnedTemp}º F`);
            
            $('#temp').addClass('temp-big');
            $('#temp').removeClass('temp-small');
        });
    }

    // check the time and change the page colors based on it
    function colorPage(){
        if(hour <= 5 || hour >= 20){
            $('#back-arrow').css('color', `#${colors.night.text}`);
            $('p').css('color', `#${colors.night.text}`);
            $('#info p').css('color', `#${colors.static.alt}`);
            $('body').css('background-color', `#${colors.night.sky}`);
            $('#orb').css('background-color', `#${colors.night.orb}`);
        } else {
            $('#back-arrow').css('color', `#${colors.day.text}`);
            $('p').css('color', `#${colors.day.text}`);
            $('#info p').css('color', `#${colors.static.alt}`);
            $('body').css('background-color', `#${colors.day.sky}`);
            $('#orb').css('background-color', `#${colors.day.orb}`);
        }
    }

    // run functions here
    colorPage();
    getWeather();


})();