var ptAmount = false;
var gtAmount = false;
var cpAmount = false;

window.onload = function(){
    var pageRef = getUrlParameter('page');
    if (pageRef === 'messages') {
        messageCompanion();
    }
    if (pageRef === 'fleet') {
        fleetCompanion();
    }
};