
var fleet2Companion = function() {
    var targetType = getUrlParameter('target_type');
    if (typeof targetType !== 'undefined') {
        $('select[name="planettype"]  option[value="'+targetType+'"]').prop('selected', true);
    }
    updateSubmitButtonStep2();
    $('select').change(function(){
        updateSubmitButtonStep2();
    });
    $('input[type="number"]').change(function(){
        updateSubmitButtonStep2();
    });
    $('#tabs-2 > table > tbody > tr > td > a').click(function(){
        updateSubmitButtonStep2();
    });
    $('input[type="number"]')[2].select();
}

var fleet3Companion = function() {
    if ($('input[type="radio"]').length === 1) {
        $('input[type="radio"]').first().attr('checked', 'checked');
    }
    $('input[type="text"]').first().focus();
}

var updateSubmitButtonStep2 = function() {
    var currentPosText = $('#planetselector > select').find(":selected").text();
    var targetGalaxy = $('input[name="galaxy"]').val();
    var targetSystem = $('input[name="system"]').val();
    var targetPlanet = $('input[name="planet"]').val();
    var targetType = $('select[name="planettype"]').find(":selected").val();

    if (currentPosText.indexOf("["+targetGalaxy+":"+targetSystem+":"+targetPlanet+"]") !== -1) {
        if ((currentPosText.indexOf('(Moon)') !== -1 || currentPosText.indexOf('(Lune)') !== -1) && targetType === "3") {
            switchBtnOff();
            return;
        } else if ((currentPosText.indexOf('(Moon)') == -1 && currentPosText.indexOf('(Lune)') == -1) && targetType === "1") {
            switchBtnOff();
            return;
        } else {
            switchBtnOn();
        }
    }

    if($('#storage > font').attr('color') == 'lime') {
        switchBtnOn();
    } else {
        switchBtnOff();
        return;
    }

    if($('#consumption > font').attr('color') == 'lime') {
        switchBtnOn();
    } else {
        switchBtnOff();
        return;
    }
}

var switchBtnOn = function() {
    $('td > input[type="submit"]').removeClass('off');
    $('td > input[type="submit"]').addClass('on');
}
var switchBtnOff = function() {
    $('td > input[type="submit"]').removeClass('on');
    $('td > input[type="submit"]').addClass('off');
}