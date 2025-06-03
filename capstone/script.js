(()=>{
    'use strict';
    console.log('reading js');

    let blankDefault; // blankSelected stores the text that is in the prompt 1 blank when no other text is being inserted
    let sectionCriteriaMet; // this should be true when the minimum requires number of inputs to advance are selected
    let currentPrompt; // this number is the prompt the user is currently on

    const clusterListStrings = {
        reasonsfor: ['Personal finance', 'Domestic politics', 'International politics', 'Personal relationships', 'Personal health/wellbeing', 'Social media'],
        moreof: ['Green spaces', 'Affordable healthcare', 'Respectable politicians', 'Music', 'Trustworthy news sources']
    }

    // store all data the user inputs
    let sessionData = {
        prompt: [],
        response: []
    };

    let selectedClusterItems = [];

    const optimisticButton = document.querySelector('#optimistic-button');
    const pessimisticButton = document.querySelector('#pessimistic-button');
    const binaryButtons = document.querySelectorAll('.binary-button');
    const opText = document.querySelector('#op-text');
    const promptSections = document.querySelectorAll('.prompt-section');
    const prompt2Blank = document.querySelector('#prompt-2-blank');

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
        promptSections[currentPrompt].appendChild(newAdvanceButton);

        // once added, add a new click event listener
        // run the advanceButtonClick function when clicked
        document.querySelector('.advance-button').addEventListener('click', advanceButtonClick);
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
                    logSessionData();
                } else {
                    console.log(`currentPrompt must be 0 to interact. currentPrompt: ${currentPrompt}`);
                }
            });
        }
    }

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
            currentPrompt++;
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
        promptSections[current].classList.remove('prompt-section-inactive');
        promptSections[current].classList.add('prompt-section-active');
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

    function clusterItemHoverStart(event){
        event.target.classList.add('cluster-item-hover');
    }
    function clusterItemHoverEnd(event){
        event.target.classList.remove('cluster-item-hover');
    }

    function manageCluster(){

        let clusterItems = document.querySelectorAll('.cluster-item');

        // iterate over the cluster items
        for(let i=0; i<clusterItems.length; i++){

            // for each cluster item, push a false value to the selectedClusterItems array
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

                // everytime a cluster item is clicked, check if at least 1 is selected, using the booleans in selectedClusterItems array
                if (selectedClusterItems.some(value => value === true)){
                    sectionCriteriaMet = true;
                    console.log(`At least 1 clusterItem selected | sectionCriteriaMet: ${sectionCriteriaMet}`);
                    activateAdvanceButton();
                } else {
                    sectionCriteriaMet = false;
                    console.log(`No clusterItems selected | sectionCriteriaMet: ${sectionCriteriaMet}`);
                    activateAdvanceButton();
                }

                console.log(`selectedClusterItems: ${selectedClusterItems}`);
            });
        }

        console.log(`selectedClusterItems: ${selectedClusterItems}`);
    }

    function logSessionData(){
        for (const key in sessionData){
            console.log(sessionData[key]);
        }
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