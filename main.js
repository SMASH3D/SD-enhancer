
window.onload = function(){
    SDCompanion();
};

/**
 * Retrieves stored player data and injects a status LED with advices in the UI
 */
var SDCompanion = function() {
    //Retrieves stored player data and injects a status LED with advices in the UI
    $('#playerName_Box').append('<div title="Warming up companion" id="sd-status-led" class="gray-dot led"></div>');
    chrome.storage.sync.get(['techLevels'], function(techLevels) {
        $('#sd-status-led').removeClass('gray-dot');
        if (!techLevels && Object.keys(techLevels).length) {
            $('#sd-status-led').addClass('orange-dot');
            $('#sd-status-led').prop('title', "SD companion not ready, please visit research tab of empire page");
        } else {
            $('#sd-status-led').addClass('green-dot');
            $('#sd-status-led').prop('title', "SD companion ready to rumble !");
        }


        var playerData = {};
        playerData = $.extend(playerData, techLevels);

        //once playerData is ready, let's run appropriate companion for the current page with playerData
        var pageRef = getUrlParameter('page');
        runCompanions(pageRef, playerData);
    });
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
        battleSimCompanion(playerData);
    }
    if (pageRef === 'ecolo') {
        ecologyCompanion();
    }
    if (pageRef === 'overview') {
        overviewCompanion(playerData);
    }
    if (pageRef === 'imperium') {
        imperiumCompanion(playerData);
    }
}