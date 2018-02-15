
var fleet2Companion = function() {


}

var updateSubmitButton = function(fleet) {
    if(!$.isEmptyObject(fleet)) {
        $('td > input[type="submit"]').addClass('on');
    } else {
        $('td > input[type="submit"]').removeClass('on');
    }
}