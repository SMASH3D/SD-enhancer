
var fleet2Companion = function() {

}

var updateSubmitButton = function(fleet) {
    //todo check fuel cargo + destination != depart
    if(!$.isEmptyObject(fleet)) {
        $('td > input[type="submit"]').addClass('on');
    } else {
        $('td > input[type="submit"]').removeClass('on');
    }
}