(()=>{
    'use strict';
    console.log('reading js');

    let blankDefault; // blankSelected stores the text that is in the prompt 1 blank when no other text is being inserted
    let sectionCriteriaMet; // this should be true when the minimum requires number of inputs to advance are selected
    let currentPrompt; // this number is the prompt the user is currently on

    const clusterListStrings = {
        reasonsfor: ['AI', 'Personal finance', 'Domestic politics', 'International politics', 'Personal relationships', 'Personal health/wellbeing', 'Social media', 'Recent personal success', 'Housing costs', 'Food costs', 'Stock market patterns', 'Family member health'],
        moreof: ['Green spaces', 'Affordable healthcare', 'Respectable politicians', 'Music', 'Trustworthy news sources', 'Bike lanes', 'Regulation on AI', 'Vegetarianism', 'Electric vehicles', 'Walkable urban spaces']
    }

    // store all data the user inputs
    let sessionData = {
        prompt: [],
        response: []
    };

    // stores the clusterItem DOM elements themselves
    let clusterItems;

    // stores booleans
    // for each item in a new cluster, false value is appended
    // if user selects corresponding clusterItem, value changes to true
    // when advance button is clicked, all clusterItem textContents are pushed to sessionData if a corresponding true value is found
    let selectedClusterItems = [];

    const optimisticButton = document.querySelector('#optimistic-button');
    const pessimisticButton = document.querySelector('#pessimistic-button');
    const binaryButtons = document.querySelectorAll('.binary-button');
    const opText = document.querySelector('#op-text');
    const promptSections = document.querySelectorAll('.prompt-section');
    const prompt2Blank = document.querySelector('#prompt-2-blank');
    const prompt2BlankUnderline = document.querySelector('#prompt-2-blank-underline');
    const prompt2SelectionDisplay = document.querySelector('#prompt-2-selection-display');
    const prompt3BlankUnderline = document.querySelector('#prompt-3-blank-underline');
    const prompt3SelectionDisplay = document.querySelector('#prompt-3-selection-display');

    function initializePage(){
        blankDefault = "(unselected)";
        sectionCriteriaMet = false;
        currentPrompt = 0;
        opText.textContent = blankDefault;
        createAdvanceButton();

        // make only the first prompt visible when the page loads
        for(let i=0; i<promptSections.length; i++){
            if (i == currentPrompt){
                promptSections[i].classList.add('prompt-section-active');
            } else {
                promptSections[i].classList.add('prompt-section-inactive');
            }
        }

        // log out info for troubleshooting 
        console.log(`page initialized | currentPrompt: ${currentPrompt} | promptSections found: ${promptSections.length}`)
    }

    function createAdvanceButton(){
        let newAdvanceButton = document.createElement('p');
        let newAdvanceButtonContents = document.createElement('span');

        // this changes the text content of the advance button based on if the current promptSection is the final one
        if (currentPrompt == promptSections.length - 1){
            newAdvanceButtonContents.textContent = ('View Results')
        } else {
            newAdvanceButtonContents.textContent = ('Next');
        }
        
        newAdvanceButton.appendChild(newAdvanceButtonContents);
        newAdvanceButton.classList.add('advance-button-inactive', 'advance-button', 'pointer-on-hover');

        // make sure the current prompt is not attmpting to append to a non-existant promptSection
        if(currentPrompt < promptSections.length){
            promptSections[currentPrompt].appendChild(newAdvanceButton);
            document.querySelector('.advance-button').addEventListener('click', advanceButtonClick);
        }
    }

    function binaryButtonClick(){
        for(let i = 0; i<binaryButtons.length; i++){
            binaryButtons[i].addEventListener('click', (event)=>{
                if (currentPrompt == 0){
                    sessionData.q1 = event.target.textContent;
                    sectionCriteriaMet = true;
                    blankDefault = sessionData.q1;
                    activateAdvanceButton();
                    console.log(`binary selection made: user is ${sessionData.q1}`);
                } else {
                    console.log(`currentPrompt must be 0 to interact. currentPrompt: ${currentPrompt}`);
                }
            });
        }
    }

    // changes advanceButton styling to appear active
    function activateAdvanceButton(){
        let advanceButton = document.querySelector('.advance-button');
        if (sectionCriteriaMet){
            advanceButton.classList.remove('advance-button-inactive');
            advanceButton.classList.add('advance-button-active');
        } else {
            advanceButton.classList.remove('advance-button-active');
            advanceButton.classList.add('advance-button-inactive');
        }
    }

    function advanceButtonClick(){
        // the advance button should only work if the criteria to advance for that section is met
        if (sectionCriteriaMet){

            logSessionData();

            currentPrompt++;

            if (currentPrompt+1 > promptSections.length){
                console.log('ERROR: No additional promptSections found');
                
                // probably remove this eventually.
                printData();
            }

            console.log(`sectionCriteriaMet: ${sectionCriteriaMet} | currentPrompt: ${currentPrompt}`);

            sectionCriteriaMet = false;
            // empty the boolean array (repopulated when a new cluster is created)
            selectedClusterItems = [];
            removeAdvanceButtons();

            // make the new section active
            activatePromptSection(currentPrompt);

            // add the next advance button
            createAdvanceButton();
        } else {
            console.log(`sectionCriteriaMet: ${sectionCriteriaMet} | currentPrompt: ${currentPrompt}`);
        }
    }

    function removeAdvanceButtons(){
        let advanceButtons = document.querySelectorAll('.advance-button');

        // remove all for redundancy (there should only be one on the page at a time)
        for(let i=0; i<advanceButtons.length; i++){
            advanceButtons[i].remove();
        }
    }

    function activatePromptSection(current){
        // take currentPrompt as input

        // control exactly what happnes based on which section is being activated
        if (current == 1){
            prompt2Blank.textContent = sessionData.q1;
            createCluster();
        } else if (current == 2){
            createCluster();
        }

        // change the CSS styling (makes visible)
        // make sure the current prompt is not attmpting to modify classList of a non-existant promptSection
        if (current < promptSections.length){
            promptSections[current].classList.remove('prompt-section-inactive');
            promptSections[current].classList.add('prompt-section-active');
        }
    }

    function createCluster(){
        let newClusterContainer = document.createElement('ul');
        newClusterContainer.classList.add('cluster-container');

        // get the correct list of strings to populate the new cluster with
        let clusterList;
        if(currentPrompt == 1){
            clusterList = clusterListStrings.reasonsfor;
        } else if(currentPrompt == 2) {
            clusterList = clusterListStrings.moreof;
        }
        console.log(`clusterList: ${clusterList}`);

        // create the cluster items--one for each string in the previously selected list
        for(let i=0; i<clusterList.length; i++){
            let newClusterItem = document.createElement('li');
            //let newClusterItemText = document.createElement('span');

            newClusterItem.classList.add('cluster-item', 'pointer-on-hover');

            newClusterItem.textContent = clusterList[i];

            //newClusterItem.appendChild(newClusterItemText);
            newClusterContainer.appendChild(newClusterItem);

            // attach event listeners to each newClusterItem
            newClusterItem.addEventListener('mouseover', clusterItemHoverStart);
            newClusterItem.addEventListener('mouseout', clusterItemHoverEnd);
        }

        // append the cluster to the active promptSection
        promptSections[currentPrompt].appendChild(newClusterContainer);

        manageCluster();
    }

    // cluster item hover states
    function clusterItemHoverStart(event){
        event.target.classList.add('cluster-item-hover');
    }
    function clusterItemHoverEnd(event){
        event.target.classList.remove('cluster-item-hover');
    }


    // Manages cluster item appearance changes, data recorded by cluster interaction
    function manageCluster(){

        clusterItems = document.querySelectorAll('.cluster-item');

        // iterate over the cluster items
        for(let i=0; i<clusterItems.length; i++){

            // For each clusterItem, push a false value to the selectedClusterItems array.
            // Each clusterItem now has an associated false value.
            selectedClusterItems.push(false);

            clusterItems[i].addEventListener('click', ()=>{
                //simple toggle
                if (!selectedClusterItems[i]){
                    selectedClusterItems[i] = true;
                    clusterItems[i].classList.add('cluster-item-selected');
                    clusterItems[i].removeEventListener('mouseover', clusterItemHoverStart);
                } else {
                    selectedClusterItems[i] = false;
                    clusterItems[i].classList.remove('cluster-item-selected');
                    clusterItems[i].addEventListener('mouseover', clusterItemHoverStart);
                }
                updateSelectionDisplays();

                // defines: what happens when at least 1 cluster item is selected, what happens when none is selected again
                if (selectedClusterItems.some(value => value === true)){
                    sectionCriteriaMet = true;
                    console.log(`At least 1 clusterItem selected | sectionCriteriaMet: ${sectionCriteriaMet}`);
                    // make the underline invisible
                    if(currentPrompt == 1){
                        prompt2BlankUnderline.style.visibility = 'hidden';
                        prompt2BlankUnderline.style.position = 'absolute';
                    } else if (currentPrompt == 2){
                        prompt3BlankUnderline.style.visibility = 'hidden';
                        prompt3BlankUnderline.style.position = 'absolute';
                    }
                    activateAdvanceButton();
                } else {
                    sectionCriteriaMet = false;
                    console.log(`No clusterItems selected | sectionCriteriaMet: ${sectionCriteriaMet}`);
                    // make the underline visible
                    if(currentPrompt == 1){
                        prompt2BlankUnderline.style.visibility = 'visible';
                        prompt2BlankUnderline.style.position = 'relative';
                    } else if (currentPrompt == 2){
                        prompt3BlankUnderline.style.visibility = 'visible';
                        prompt3BlankUnderline.style.position = 'relative';
                    }
                    activateAdvanceButton();
                }
                //console.log(`selectedClusterItems: ${selectedClusterItems}`);
            });
        }
    }

    function updateSelectionDisplays(){

        // define which selection display is being targeted
        let targetDisplay;
        if (currentPrompt == 1){
            targetDisplay = prompt2SelectionDisplay;
        } else if (currentPrompt == 2){
            targetDisplay = prompt3SelectionDisplay;
        }

        // empty targetDisplay on each new click
        let existingSpans = targetDisplay.querySelectorAll('span');
        for(let i = 0; i<existingSpans.length; i++){
            existingSpans[i].remove();
        }

        for(let i = 0; i<selectedClusterItems.length; i++){

            // Find each true value and repopulate targetDisplay with text corresponding to true values
            if(selectedClusterItems[i]){
                let newSpan = document.createElement('span');
                newSpan.textContent = clusterItems[i].textContent;
                targetDisplay.append(newSpan);
            }
        }
    }

    function logSessionData(){
        console.log('logSessionData called:')

        // get all of the clusterItems currently in the DOM
        let clusterItems = document.querySelectorAll('.cluster-item');

        // push the user inputs into sessionData
        if (currentPrompt == 0){
            sessionData.prompt.push(currentPrompt);
            sessionData.response.push(sessionData.q1);
        } else if( currentPrompt == 1 || currentPrompt == 2){
            for(let i=0; i<selectedClusterItems.length; i++){
                if (selectedClusterItems[i]){
                    sessionData.prompt.push(currentPrompt);
                    sessionData.response.push(clusterItems[i].textContent);
                }
            }
        }

        // report all session data everytime the function is called
        for (const key in sessionData){
            console.log(sessionData[key]);
        }
    }

    function printData(){
        let newPromptP = document.createElement('p');
        let newResponseP = document.createElement('p');
        newPromptP.textContent = sessionData.prompt;
        newResponseP.textContent = sessionData.response;
        document.querySelector('main').append(newPromptP);
        document.querySelector('main').append(newResponseP);
    }

    // function stack
    initializePage();
    binaryButtonClick();
    advanceButtonClick();

    
    // binary button hover states
    optimisticButton.addEventListener('mouseover', ()=>{
        if (currentPrompt == 0){
            opText.textContent = 'optimistic';
            opText.style.visibility = 'visible';
        }
    });
    optimisticButton.addEventListener('mouseout', ()=>{
        if (currentPrompt == 0){
            if(!sectionCriteriaMet){
                opText.style.visibility = 'hidden';
            }
            opText.textContent = blankDefault;
        }
    });
    pessimisticButton.addEventListener('mouseover', ()=>{
        if (currentPrompt == 0){
            opText.textContent = 'pessimistic';
            opText.style.visibility = 'visible';
        }
    });
    pessimisticButton.addEventListener('mouseout', ()=>{
        if (currentPrompt == 0){
            if(!sectionCriteriaMet){
                opText.style.visibility = 'hidden';
            }
            opText.textContent = blankDefault;
        }
    });
})();