
window.onload = function(){
    SDCompanion();
};

/**
 * Retrieves stored player data and injects a status LED with advices in the UI
 */
var SDCompanion = function() {

    var pageRef = getUrlParameter('page');
    $('#playerName_Box').append('<div title="Warming up companion" id="sd-status-led" class="gray-dot led"></div>');
    if (pageRef === 'messages' || pageRef === 'fleet') {
        //Retrieves stored player data and injects a status LED with advices in the UI
        chrome.storage.sync.get(['techLevels'], function(techLevels) {
            $('#sd-status-led').removeClass('gray-dot');
            if (!techLevels && Object.keys(techLevels).length) {
                $('#sd-status-led').addClass('orange-dot');
                $('#sd-status-led').prop('title', "SD companion not ready, please visit research tab of empire page");
            } else {
                okLED();
            }


            var playerData = {};
            playerData = $.extend(playerData, techLevels);

            //once playerData is ready, let's run appropriate companion for the current page with playerData
            runCompanions(pageRef, playerData);
        });
    } else {
        runCompanions(pageRef);
        okLED();
    }
}


/**
 * Runs the appropriate companion for each page
 *
 * @param pageRef
 */
var runCompanions = function(pageRef, playerData) {
    if (pageRef === 'messages') {
        messageCompanion(playerData);
    }
    if (pageRef === 'fleet') {
        fleetCompanion(playerData);
    }
    if (pageRef === 'battlesim') {
        battleSimCompanion();
    }
    if (pageRef === 'ecolo') {
        ecologyCompanion();
    }
    if (pageRef === 'overview') {
        overviewCompanion();
    }
    if (pageRef === 'imperium') {
        imperiumCompanion();
    }
}