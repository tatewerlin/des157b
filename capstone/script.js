(()=>{
    'use strict';
    console.log('reading js');

    // Initialize Parse
    Parse.initialize("cyVXM5WPBfjRlMKP9Uk0av2GkD0uh8UGHcqOfZn0", "Xt9nH0lavO2iBdF3x0Aqf8cAA8wmMOVL5RDFVpms");
    // Replace with your app’s server URL from Back4App:
    Parse.serverURL = 'https://parseapi.back4app.com/';


    // strings used to populate cluster items
    const clusterLists = {
        reasonsfor: ['Global conflict/affairs', 'Recent news/current events', 'Access to nutrition', 'Access to outdoors/nature', 'Job security', 'Personal finance', 'Political polarization', 'Government transparency', 'Cost of living', 'Trust in future generations', 'Personal health/wellbeing', 'Access to mental health care', 'Recent personal success', 'Belief/trust in humanity', 'Housing affordability', 'Pollution levels', 'Government corruption', 'Access to education', 'Sense of belonging', 'Personal education', 'Trust in neighbors/community', 'Crime rates', 'Trust in government', 'Family relationships', 'National security', 'Online safety', 'Impacts of AI', 'Access to healthcare', 'Support for creative expression', 'Representation in media', 'International relations', 'Migration issues', 'Global cooperation', 'Acceptance/inclusion of diversity', 'Environmental protection', 'Technological advancements', 'Financial freedom', 'Work/career success', 'Trust in myself'],

        moreof: ['More public parks', 'Increased access to healthcare', 'A shift in political climate', 'Increased cultural diversity', 'Increased access to education', 'Less discrimination/prejudice', 'More art', 'Trustworthier news sources', 'More bike lanes', 'Improved urban spaces', 'Increased regulation on A.I.', 'Higher quality food', 'More public transit', 'Increased city walkability', 'Decreased A.I. use', 'Increased A.I. use', 'Better allocation of public funds', 'Cheaper necessities (housing, food, etc.)', 'Better representation of diversity', 'Equal opportunities for financial success', 'Decreased social media use', 'Less war', 'A fairer criminal justice system', 'Better conservation of nature', 'Equal oppurtunities regardless of identity', 'Stronger sense of community', 'Less polution', 'Cleaner air', 'Cleaner water', 'Reduced systemic inequality', 'More ethical social media use', 'More stable jobs/incomes', 'Better work/life balance', 'Less government corruption', 'Greater accountability in leaders', 'More government transparency', 'More creativity', 'More support for creative expression', 'More support for elderly', 'Better data privacy', 'More ethical technology development']
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

    // 0 = marks any response to prompt 0
    // 1 = marks response to prompt 1 given "optimistic"
    // 2 = marks response to prompt 1 given "pessimistic"
    // 3 = marks any response to prompt 2
    let promptRespondingTo; 

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
        promptRespondingTo = 0; console.log(`promptRespondingTo: ${promptRespondingTo}`);
        updateSectionVisibility(currentSection);

        // hide prompt section contents (prevents unwanted horizaontal scroll on mobile)
        updateSectionContentVisibility(currentSection);

        // set all sectionCriteriaMet values to false
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

            if(i<current){
                sections[i].classList.add('collapsed');
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

            // button styling
            button.classList.add('selectable-hover');

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

            // button styling
            button.classList.remove('selectable-hover');

            defaultMouseoutInput.classList.replace('hidden', 'visible');
            currentHoverInput.classList.replace('visible', 'hidden');
        });

        button.addEventListener('click', (event)=>{

            // button selected styling
            // can use the 'cluster-item-selected' class here because it is purely stylistic
            binaryBtns.forEach((item)=>{
                if(item == event.target){
                    item.classList.add('cluster-item-selected');
                } else {
                    item.classList.remove('cluster-item-selected');
                }
            });

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

            let section1selection = thisSectionData[0];
            
            // Manage data
            thisSectionData.forEach(item => {
                updateSessionData(promptRespondingTo, item);
            });

            // Determine new promptRespondingTo value
            if (currentSection === 0 && section1selection === 'optimistic'){
                promptRespondingTo = 1;
            } else if (currentSection === 0 && section1selection === 'pessimistic'){
                promptRespondingTo = 2;
            } else {
                promptRespondingTo = 3;
            }
            
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

            // add media query classes
            document.querySelector('body').classList.add('body-mobile-cluster-screen');
            document.querySelector('main').classList.add('main-mobile-cluster-screen');

            // Window scrolls back to top (for mobile)
            window.scrollTo({ top: 0, behavior: "smooth" });
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

    // After Submitting Data

    function afterDataSubmitted(){

        const endPrompt = document.querySelector('#end-prompt');

        // display the endPrompt
        endPrompt.classList.replace('hidden', 'visible');
    }

    const finalAdvanceButton = document.querySelector('#final-advance-button');
    finalAdvanceButton.addEventListener('click', () => {

        // Hide all prompt sections
        sections.forEach((section, index) => {
            section.classList.add('hidden');
            headers[index].classList.add('hidden');
        });

        // Save all answers at once
        const Answer = Parse.Object.extend("Answer");
        const answersToSave = [];
    
        for (let i = 0; i < sessionData.prompt.length; i++) {
            const newAnswer = new Answer();
            newAnswer.set("prompt", sessionData.prompt[i]);
            newAnswer.set("response", sessionData.response[i]);
            answersToSave.push(newAnswer);
        }
    
        Parse.Object.saveAll(answersToSave)
            .then((savedAnswers) => {
                console.log("All answers saved successfully!");
                // You could also redirect the user or show a summary here.
                afterDataSubmitted();
            })
            .catch((error) => {
                console.error("Error saving answers:", error.message);
                alert("Oops! Something went wrong: " + error.message);
            });
    });
    


})();