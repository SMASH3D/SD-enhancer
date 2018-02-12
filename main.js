window.onload = function(){
    var pageRef = getUrlParameter('page');
    if (pageRef === 'messages') {
        messageCompanion();
    }
    if (pageRef === 'fleet') {
        fleetCompanion();
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
    if (pageRef === 'buildings') {
        var mode = getUrlParameter('mode');
        if (mode === 'research') {
            researchCompanion();
        }
    }
};