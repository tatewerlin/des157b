(()=>{
    'use strict';
    console.log('reading js');

    // stores the prompt/response pairs in the order they were recieved from back4app
    // target structure:
    // data = [
    //     {prompt: 0, response: 'optimistic'};
    // ];
    const data = [];

    // stores the data sorted by prompt
    const sortedData = {};

    // Initialize Parse
    Parse.initialize("cyVXM5WPBfjRlMKP9Uk0av2GkD0uh8UGHcqOfZn0", "Xt9nH0lavO2iBdF3x0Aqf8cAA8wmMOVL5RDFVpms");
    Parse.serverURL = 'https://parseapi.back4app.com/';

    const totalResponsesByCategory = [];
    let totalResponses = 0;

    document.addEventListener('DOMContentLoaded', () => {

        // Get the answer objects and populated the data array

        const Answer = Parse.Object.extend("Answer");
        const query = new Parse.Query(Answer);
        query.limit(2000);

        query.find()
        .then((results) => { // everything handling data from back4app must go inside this async function

            results.forEach((answer, index) => {

                console.log(answer, index);
            
                const prompt = answer.get("prompt");
                const response = answer.get("response");

                // for each answer, create an object and assign it prompt and response key/value pairs
                data[index] = {};
                data[index].prompt = prompt;
                data[index].response = response;
                

            });

            // Sort the data in the data array
            data.forEach(object =>{

                const thisPrompt = object.prompt;
                const thisResponse = object.response;

                // If there is not a key for the prompt, create one and assign an array
                if (!sortedData[thisPrompt]){
                    sortedData[thisPrompt] = [];
                }

                // Push each response to the corresponding array
                sortedData[thisPrompt].push(thisResponse);

            });

            // By prompt, store the frequency of each response
            // target structure:
            // countedResponses = {
            //     0: {optimistic: 12, pessimistic, 2},
            //     1: {Work/career success: 1, Government corruption: 2},
            //     2: {},
            //     3: {}
            // }
            const countedResponses = {};

            // Iterate through array of sortedData keys
            // the keys are the prompts (0, 1, 2, 3)
            Object.keys(sortedData).forEach(prompt => {

                //
                totalResponsesByCategory[prompt] = sortedData[prompt].length;
                totalResponses += sortedData[prompt].length;

                // All responses for each prompt (0, 1, 2, 3)
                const responses = sortedData[prompt];

                // Create an object for each responses array
                const counts = {};

                // for each response to eachh prompt, check if there is a counts object for that response
                // if there is, increment
                // if there isn't, create one and assign it a value of 1
                responses.forEach(response => {
                    if (counts[response]){
                        counts[response]++;
                    } else {
                        counts[response] = 1;
                    }
                });

                // Assign the counts object to the prompt object for the current prompt
                countedResponses[prompt] = counts;
            });


            // Process user optimism data
            // this is easier to do before countedResponses gets sorted below
            let numberOfOptimistic = countedResponses[0].optimistic;
            let numberOfPessimistic = countedResponses[0].pessimistic;
            let percentOptimistic = ( numberOfOptimistic / (numberOfOptimistic + numberOfPessimistic) * 100);

            // add the percentage to screen
            const percentDisplay = document.querySelector('.percent-display');
            percentDisplay.textContent = `${Math.trunc(percentOptimistic)}%`;


            Object.keys(countedResponses).forEach(prompt=> {

                // convert each countedResponses[prompt] to an array
                const entries = Object.entries(countedResponses[prompt]);

                // sort the entries by their second value (indexed as 1) which stores the count
                entries.sort((a, b) => b[1] - a[1]);

                // redefine countedResponses[prompt] as the sorted list of arrays
                countedResponses[prompt] = entries;
            });

            // Get the top n responses to each prompt (1-3: 0 is binary, not categorical)
            let topCategoricalResponses = {};
            Object.keys(countedResponses).forEach(item => {

                if(item > 0){ // item = 0 would access binary data: we dont care about the ranked frequency really
                    topCategoricalResponses[item] = [];
                    // change i to push more responses to the array if u want
                    for(let i=0; i<10; i++){
                        if(countedResponses[item][i]){
                            topCategoricalResponses[item].push(countedResponses[item][i]);
                        }
                    }
                }

            });

            // Populate and Style page

            // Response displays
            const responseCountDisplays = document.querySelectorAll('.response-count-display');
            responseCountDisplays.forEach((item, index) => {
                item.textContent = `${totalResponsesByCategory[index]} responses`;
            });

            // category lists
            console.log(topCategoricalResponses);
            const categoryLists = document.querySelectorAll('.category-list');
            const rgbValues = [
                '92, 255, 122', // reasons for optimistic
                '255, 105, 66', // reasons for pessimistic
                '186, 117, 255' // want to see more of
            ];
            const maxValues = [];

            // get the maximum frequencies for each prompt
            Object.keys(topCategoricalResponses).forEach((_, index) => {
                maxValues.push(topCategoricalResponses[index+1][0][1]); // topCategoricalResponses begins with a 1
            });

            console.log(maxValues);
            categoryLists.forEach((list, index) => {

                topCategoricalResponses[index+1].forEach(item => {

                    let thisAlphaValue = (1/maxValues[index] * item[1]);
                    console.log(thisAlphaValue);
                    let thisFillColor = `rgb(${rgbValues[index]}, ${thisAlphaValue})`;

                    const newLi = document.createElement('li');

                    const newTitleSpan = document.createElement('span');
                    newTitleSpan.textContent = item[0];
                    newTitleSpan.classList.add('category-item-title')

                    const newIndexSpan = document.createElement('span');
                    newIndexSpan.textContent = item[1];

                    newLi.append(newTitleSpan);
                    newLi.append(newIndexSpan);
                    newLi.classList.add('category-item');
                    newLi.classList.add('default-on-hover');

                    list.append(newLi);
                    newLi.style.backgroundColor = thisFillColor;
                });
            });

        })
        .catch((error) => {
            console.error("Error fetching answers:", error.message);
        });

    });
})();