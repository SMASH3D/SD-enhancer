
var fleet2Companion = function() {
    var targetType = getUrlParameter('target_type');
    if (typeof targetType !== 'undefined') {
        $('select[name="planettype"]  option[value="'+targetType+'"]').prop('selected', true);
    }
    updateSubmitButtonStep2(true);
    $('select').change(function(){
        updateSubmitButtonStep2(true);
    });
    $('input[type="number"]').change(function(){
        updateSubmitButtonStep2(true);
    });
    $('#tabs-2 > table > tbody > tr > td > a').click(function(){
        switchBtnOn(false);
    });
    $('input[type="number"]')[2].select();

    key('enter, space, return', function() {
        $('#tabs-2 > table > tbody > tr > td > input').click();
    });
}

var fleet3Companion = function() {
    var consumptionEl = $('#tabs-3 > table > tbody > tr.left.top > td.top > table > tbody > tr > td').last();
    var refreshContinueBtn = function() {
        var consumption = parseInt(/(\d+)/.exec(consumptionEl.text())[1]);
        var availableFuel = parseInt($('#ress_count_deuterium').text().replace(/\./g, ""));
        if (consumption < availableFuel) {
            consumptionEl.css('color', 'lime');
        } else {
            consumptionEl.css('color', 'red');
        }
        if ($('#remainingresources > font').attr('color') === 'lime' && consumption < availableFuel) {
            switchBtnOn();
        } else {
            switchBtnOff();
        }
    }
    if ($('input[type="radio"]').length === 1) {
        $('input[type="radio"]').first().attr('checked', 'checked');
    }
    $('input[type="text"]').first().focus();
    refreshContinueBtn();
    $('input[name="metal"]').on('change paste keyup', function(){
        refreshContinueBtn();
    });
    $('input[name="crystal"]').on('change paste keyup', function(){
        refreshContinueBtn();
    });
    $('input[name="deuterium"]').on('change paste keyup', function(){
        refreshContinueBtn();
    });
    key('enter, space, return', function() {
        $('#tabs-2 > table > tbody > tr > td > input').click();
    });
    var mission = parseInt(getUrlParameter('mission'));
    if (mission > 0) {
        $("#radio_" + mission).attr('checked', 'checked');
    }
}

var updateSubmitButtonStep2 = function(checkpos) {

    if (checkpos === true) {
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

    var actionUrl = $('#form').attr('action');
    var mission = parseInt(getUrlParameter('mission'));
    if (mission > 0) {
        $('#form').attr('action', actionUrl+'&mission='+mission);
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