
var galaxyCompanion = function() {
    $('#galaxy_form input[type="text"]').css('min-width', '');

    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
                $('input[name="systemLeft"]').click();
                break;

            case 38: // up
                $('input[name="galaxyRight"]').click();
                break;

            case 39: // right
                $('input[name="systemRight"]').click();
                break;

            case 40: // down
                $('input[name="galaxyLeft"]').click();
                break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

}

