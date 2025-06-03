(()=>{
    'use strict';
    console.log('reading js');

    let blankDefault = "(unselected)"; // blankSelected stores the text that is in the prompt 1 blank when no other text is being inserted
    let firstCriteriaMet = false; // the first binary input is unselected by default.

    let optimisticOutcome; // set to 0 if user selects hopeful ; set to 1 if user selects unhopeful

    // strings to populate clusters
    const clusterListStrings = {
        reasonsfor: ['Personal finance', 'Domestic politics', 'International politics', 'Personal relationships', 'Personal health/wellbeing', 'Social media'],
        moreof: ['Green spaces', 'Affordable healthcare', 'Respectable politicians', 'Music', 'Trustworthy news sources']
    }

    // store the inputs as the user fills them out
    const sessionData = {}

    // refers to the binary selector for "hopeful"
    // is a jquery object: must use jquery methods
    const optimisticButton = $('#optimistic-button');

    // refers to the binary selector for "not hopeful"
    const pessimisticButton = $('#pessimistic-button');

    const opText = $('#op-text'); // <span> -- modify the text content to fill in the blank for prompt 1

    let currentPrompt;

    // main function sequence
    initializePage();
    manageBinaryButtonHover();
    manageBinaryButtonClick();
    manageAdvanceButtonClick();

    function initializePage(){ // this function should set up the page in it's initial state
        $(opText).text(blankDefault);
        currentPrompt = 0;
        createAdvanceButton(currentPrompt);
    };

    function manageBinaryButtonHover(){

        // binary buttons are the clickable items when selecting response to prompt 1

        if (currentPrompt == 0){ // the hover states should only change while the user is on prompt 1
            optimisticButton.hover(
                () => { // hover begins, do following
                    opText.text('optimistic');
                    opText.css('visibility', 'visible');
                },
                () => { // hover ends, do following
                    if (!firstCriteriaMet){
                        opText.css('visibility', 'hidden');
                    }
                    opText.text(blankDefault);
                }
            );
        
            pessimisticButton.hover( () => { // hover begins, do following
                    opText.text('pessimistic');
                    opText.css('visibility', 'visible');
                }, () => { // hover ends, do following
                    if (!firstCriteriaMet){
                        opText.css('visibility', 'hidden');
                    }
                    opText.text(blankDefault);
                }
            );
        }
    }

    function manageBinaryButtonClick(){

        $('.op-button').click((event) => { // when one of the op buttons is pressed, do the following
            console.log('op button pressed');
            firstCriteriaMet = true;
            console.log(`firstCriteriaMet: ${firstCriteriaMet}`);
            let target = $(event.target); 
            let sibling = target.siblings();

            blankDefault = target.text();

            activateAdvanceButton();

            // handle background colors
            target.css('background-color', 'yellow');
            sibling.css('background-color', '');
        });

    }

    function createAdvanceButton(current){
        let newAdvanceButton = $('<p>');
        let newAdvanceButtonContents = $('<span>');
        newAdvanceButtonContents.text('Next');
        newAdvanceButton.append(newAdvanceButtonContents);
        newAdvanceButton.addClass('advance-button-inactive advance-button pointer-on-hover');
        $('.prompt-section').eq(current).append(newAdvanceButton);
    }

    function activateAdvanceButton(){
        // when the criteria for each prompt is met by the user, allow them the ability to advance to the next prompt
        $('.advance-button').removeClass('advance-button-inactive');
        $('.advance-button').addClass('advance-button-active');
    }

    function manageAdvanceButtonClick(){
        $('.advance-button').click( () => {
            if (firstCriteriaMet){
                currentPrompt++;
                console.log(`New currentPrompt: ${currentPrompt}`);

                $('.advance-button').remove();
                createAdvanceButton(currentPrompt);
            }
        });
    }

})();