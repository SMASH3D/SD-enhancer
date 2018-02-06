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
};