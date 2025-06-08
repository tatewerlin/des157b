(()=>{
    'use strict';
    console.log('reading js');

    // strings used to populate cluster items
    const clusterLists = {
        reasonsfor: ['AI', 'Personal finance', 'Domestic politics', 'International politics', 'Personal relationships', 'Personal health/wellbeing', 'Social media', 'Recent personal success', 'Housing costs', 'Food costs', 'Stock market patterns', 'Family member health'],
        moreof: ['Green spaces', 'Affordable healthcare', 'Respectable politicians', 'Music', 'Trustworthy news sources', 'Bike lanes', 'Regulation on AI', 'Vegetarianism', 'Electric vehicles', 'Walkable urban spaces']
    }
    
    console.log(clusterLists[0]);

    // store all data the user inputs
    let sessionData = {
        prompt: [],
        response: []
    };

    // stores the data for the current section
    let thisSectionData = [];

    // Stores a boolean value for each clusterItem.
    // Value is FALSE if corresponding clusterItem is unselected. 
    // Value is TRUE if corresponding clusterItem is selected.
    let clusterBooleanArrays = {};

    // Global Variables
    let currentSection;
    const sections = document.querySelectorAll('.prompt-section');
    let sectionCriteriaMet = [];
    const sectionContents = document.querySelectorAll('.prompt-section-contents');
    const headers = document.querySelectorAll('.prompt-header');
    const clusters = document.querySelectorAll('.cluster');
    const advanceButtons = document.querySelectorAll('.advance-button');

    function initializePage(){
        currentSection = 0;
        updateSectionVisibility(currentSection);
        sections.forEach( () => {
            sectionCriteriaMet.push(false);
        });

        // set up the boolean array for each cluster
        clusters.forEach((_, index) => {
            clusterBooleanArrays[`cluster${index}`] = [];
        });

        // populate each cluster AND corresponding booleanArray
        setupCluster(clusters[0], clusterLists.reasonsfor, clusterBooleanArrays.cluster0);
        setupCluster(clusters[1], clusterLists.moreof, clusterBooleanArrays.cluster1);
        console.log(clusterBooleanArrays);
        console.log(sectionCriteriaMet);
    }

    // Sections

    function updateSectionVisibility(current){
        for(let i=0; i<sections.length; i++){
            // Each time this is called, start with all sections hidden
            sections[i].classList.add('hidden');

            // then, if the section index is less than the current section, make it visible
            if(i <= current){
                sections[i].classList.replace('hidden', 'visible');
            }
        }
    }

    function updateSectionContentVisibility(current){
        sectionContents.forEach((sectionContents, index) =>{
            if(current != index){
                sectionContents.classList.add('hidden');
            } else {
                sectionContents.classList.remove('hidden');
            }
        });
    }
    
    // The defaultMouseOut input is grabbed by its id. 
    // This id gets assigned to different elements. 
    // When a new element is assigned the id, redefine the variable.
    let defaultMouseoutInput;
    function updateDefaultMouseoutInput(){
        defaultMouseoutInput = document.querySelector('#default-mouseout-input');
    }

    initializePage();
    updateDefaultMouseoutInput();


    // Binary Buttons 

    const binaryBtns = document.querySelectorAll('.binary-button');
    const currentHoverInput = document.querySelector('.current-hover-input');
    let selection;

    binaryBtns.forEach((button) => {

        button.addEventListener('mouseover', (event) => {

            // make the underline invisible
            if (defaultMouseoutInput.classList.contains('visible')){
                defaultMouseoutInput.classList.replace('visible', 'hidden');
            } else {
                defaultMouseoutInput.classList.add('hidden');
            }

            currentHoverInput.textContent = event.target.textContent;
            currentHoverInput.classList.replace('hidden', 'visible');
        });

        button.addEventListener('mouseout', ()=>{
            defaultMouseoutInput.classList.replace('hidden', 'visible');
            currentHoverInput.classList.replace('visible', 'hidden');
        });

        button.addEventListener('click', (event)=>{

            // hide the hover input
            currentHoverInput.classList.replace('visible', 'hidden');

            // get rid of previous selection inputs
            headers[0].querySelectorAll('.selection-input-span').forEach((span) => {
                span.remove();
            });

            // Get the id of the current defaultMouseoutInput, then remove the id from that element
            let idToTransfer = defaultMouseoutInput.id;
            defaultMouseoutInput.removeAttribute('id');

            // Get the text content of the selected ginary button
            selection = event.target.textContent;
            console.log(selection);

            // Create a new span which will display the new selection
            let selectionInputSpan = document.createElement('span');
            selectionInputSpan.textContent = selection;

            // Make it the new defaultMouseoutInput by transferring the id to it
            selectionInputSpan.id = idToTransfer;

            // Classes
            selectionInputSpan.classList.add('selection-input-span');

            headers[0].append(selectionInputSpan);

            // Update the defaultMouseoutInput variable to reference the newly created and appended one
            updateDefaultMouseoutInput();

            thisSectionData[0] = selection;

            sectionCriteriaMet[0] = true;
            if (sectionCriteriaMet[0]) {console.log('section 0 criteria met');}
            updateAdvanceButtons();
        });
    });


    // Advance Buttons

    advanceButtons.forEach((advanceButton, index) => {
        advanceButton.addEventListener('click', () => {

            // skip if criteria not met
            if (!sectionCriteriaMet[index]) return; 
            
            // Manage data
            thisSectionData.forEach(item => {
                updateSessionData(currentSection, item);
            });
            
            // Increment the current section
            currentSection++;
            console.log(currentSection);

            // Put the binary selection in the section 1 header
            if (currentSection === 1) {
                updatePrompt1HeaderBlank(sessionData.response[0]);
            }

            // Update visibility
            updateSectionVisibility(currentSection);
            updateSectionContentVisibility(currentSection);
            manageCluster();
        });
    });
    
    function updateAdvanceButtons() {
        // Change button styling based on if sectionCriteriaMet
        advanceButtons.forEach((advanceButton, index) => {
            if (sectionCriteriaMet[index]) {
                advanceButton.classList.replace('advance-button-inactive', 'advance-button-active');
                advanceButton.classList.add('pointer-on-hover');
            } else {
                advanceButton.classList.replace('advance-button-active', 'advance-button-inactive');
            }
        });
    }
    

    // Prompt 1 Header

    // Puts the binary selection text in the section 1 header
    const prompt1HeaderBlank = document.querySelector('#prompt-1-blank');
    function updatePrompt1HeaderBlank(thisText){
        prompt1HeaderBlank.textContent = thisText;
    }

    // Clusters / Cluster Items

    function setupCluster(target, list, booleanArray){

        list.forEach((item)=>{
            let newClusterItem = document.createElement('li');
            newClusterItem.textContent = item;
            newClusterItem.classList.add('cluster-item');
            newClusterItem.classList.add('pointer-on-hover');
            newClusterItem.classList.add('cell');
            target.append(newClusterItem);
            booleanArray.push(false);
        });
    }

    const clusterItems = document.querySelectorAll('.cluster-item');

    function manageCluster(){
        let theseClusterItems = sections[currentSection].querySelectorAll('.cluster-item');
        let thisHeader = headers[currentSection];
        let thisBoolArray = clusterBooleanArrays[`cluster${currentSection-1}`];
        let thisBlankUnderline = sections[currentSection].querySelector('.blank-underline');

        theseClusterItems.forEach((item, index) => {
            item.addEventListener('mouseover', ()=>{
                item.classList.add('selectable-hover');
            });
            item.addEventListener('mouseout', ()=> {
                item.classList.remove('selectable-hover');
            });
            item.addEventListener('click', ()=> {
                console.log(`item index: ${index}`)

                // Reset thisSectionData
                thisSectionData = [];
                
                // toggle the corresponding boolean value
                thisBoolArray[index] = !thisBoolArray[index];

                // If at least one boolean Value is true, activate the advance button
                // If all boolean values are false, deactivate the advance button
                if (thisBoolArray.some(value => value === true)){
                    sectionCriteriaMet[currentSection] = true;
                    thisBlankUnderline.classList.remove('visible');
                    thisBlankUnderline.classList.add('hidden');
                    updateAdvanceButtons();
                } else {
                    sectionCriteriaMet[currentSection] = false;
                    thisBlankUnderline.classList.replace('hidden', 'visible');
                    updateAdvanceButtons();
                }

                // All clusterItem functionality attached to booleanArray values
                thisBoolArray.forEach((value, index) => {
                    if(value){
                        theseClusterItems[index].classList.add('cluster-item-selected');
                        thisSectionData.push(theseClusterItems[index].textContent);
                    } else {
                        theseClusterItems[index].classList.remove('cluster-item-selected');
                    }
                });

                modifyHeader();
            })
        });

        // Adds the strigns of selected clusterItems to the header
        // This function is nested because it uses the local variables
        function modifyHeader(){

            // Remove all previously added to prevent duplicates
            thisHeader.querySelectorAll('.new-span-handle').forEach((span) => { span.remove()});

            // If a true value is found, create a span with the associated string and add it to the header
            thisBoolArray.forEach((value, index) => {
                if(value){
                    let newSpan = document.createElement('span');
                    newSpan.textContent = theseClusterItems[index].textContent.toLowerCase();
                    newSpan.classList.add('new-span-handle');
                    thisHeader.append(newSpan);
                }
            });

            // Add a comma to all but the last span
            let arrayOfSpans = thisHeader.querySelectorAll('.new-span-handle');
            arrayOfSpans.forEach((span, index) => {
                if (index < arrayOfSpans.length - 1){
                    span.textContent += ', ';
                }
            });
        }
    }

    // Session Data

    function updateSessionData(thisPrompt, thisResponse){
        sessionData.prompt.push(thisPrompt);
        sessionData.response.push(thisResponse);

        // empty the temprary data store
        thisSectionData = [];

        console.log(`sessionData updated: ${sessionData.prompt}, ${sessionData.response} thisSectionData: ${thisSectionData} | NOTE: thisSectionData should be empty`);
    }


})();