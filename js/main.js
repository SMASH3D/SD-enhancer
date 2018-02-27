
window.onload = function(){
    try {
        var matches = window.location.href.match(/(\w+)\.php/);
        if (typeof matches === 'undefined' || matches === null) {
            //not a page we're interested in
            return;
        }
        var controller = matches[1];
        if (controller === 'CombatReport') {
            $('#top_menu').append('<div title="Warming up companion" id="sd-status-led" class="gray-dot led"></div>');
            combatReportCompanion();
        } else {
            SDCompanion();
        }
        //TODO move that in a shipyard companion
        $('#auftr').attr('size', '');
    } catch(error) {
        var message = translate('Oops SD Companion crashed, check console for details between SDCompanion Exception START & END');
        console.log('%c SDCompanion Exception START', 'color: red; font-weight: bold;');
        console.log(error);
        console.log('%c SDCompanion Exception END', 'color: red; font-weight: bold;');
        errorLED(message);
    }
};

/**
 * Retrieves stored player data and injects a status LED with advices in the UI
 */
var SDCompanion = function() {

    var pageRef = getUrlParameter('page');
    $('#top_menu').append('<div title="Warming up companion" id="sd-status-led" class="gray-dot led"></div>');
    if (pageRef === 'messages' || pageRef === 'fleet' || pageRef === 'imperium') {
        //Retrieves stored player data and injects a status LED with advices in the UI
        chrome.storage.sync.get(['techLevels'], function(techLevels) {
            $('#sd-status-led').removeClass('gray-dot');
            if (!techLevels && Object.keys(techLevels).length) {
                warningLED('SD companion not ready, please visit research tab of empire page');
            } else {
                okLED();
            }

            var playerData = {};
            playerData = $.extend(playerData, techLevels);

            //once playerData is ready, let's run appropriate companion for the current page with playerData
            runCompanions(pageRef, playerData);
        });
    } else {
        okLED();
        runCompanions(pageRef);
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
    if (pageRef === 'fleet1') {
        fleet2Companion();
    }
    if (pageRef === 'fleet2') {
        fleet3Companion();
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
        imperiumCompanion(playerData);
    }
    if (pageRef === 'galaxytext' || pageRef === 'galaxy') {
        galaxyCompanion(pageRef);
    }
}