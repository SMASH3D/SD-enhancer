var messageCompanion = function(playerData) {
    var messageBox = $('.insideLeftMenu_top');
    var spyReportLink = $('.insideLeftMenu_text > table > tbody > tr > td').first();
    var spyHintBtn = buildCompanionButton('raid-hint-btn', 'spyReport', translate('Raid&nbsp;hints'), spyReportLink);
    spyReportLink.click(function () {
        messageBox.append(spyHintBtn);
        messageBox.on("click", spyHintBtn, function() {
            injectCoordinatesToSimulator();
            raidHint(playerData);
        });
        spyReportLink.addClass('spyReport SDC');
    });

    var expReportLink = $('.insideLeftMenu_content > div > table > tbody > tr:nth-child(7) > td');
    var expJournaltBtn = buildCompanionButton('exp-journal-btn', 'expReport', translate('Expedition&nbsp;journal'), expReportLink);
    expReportLink.click(function () {
        messageBox.append(expJournaltBtn);
        messageBox.on("click", expJournaltBtn, function() {
            expeditionJournal();
        });
        expReportLink.addClass('spyReport SDC');
    });
};

var buildCompanionButton = function(id, SDCclass, label) {
    var spyHintBtn = $('<input type="button" value="'+label+'" class="ui-button ui-state-default ui-corner-all hintbtn" id='+id+' style="margin-top: 25px;"/>');
    $('.insideLeftMenu_text > table > tbody > tr > td').click(function () {
        if (!$(this).hasClass(SDCclass) ) {
            $('#'+id).remove();
        }
    });
    return spyHintBtn;
};

var expeditionJournal = function () {
    var expQueue = {};
    var timeExtractRegex = /([0-9]{2}). ([a-zA-Z]{3}) ([0-9]{4}), ([0-9]{2}):([0-9]{2}):([0-9]{2})/g;
    var resourcesExtractRegex = /Rhénium ([0-9]+)\, Sélénium ([0-9]+)/;
    $('.message_head').each(function(k, v) {
        var expID = (v.id.match('message_([0-9]+)')[1]);
        var tMatch = timeExtractRegex.exec(v.innerText);
        if (tMatch !== null) {
            var expTime  = new Date(tMatch[3], getMonthNumber(tMatch[2]), tMatch[1], tMatch[4], tMatch[5], tMatch[6]);
            var msgText = $(this).next('tr')[0].innerText.replace(/\./g, "");
            if (msgText.indexOf('Elle ramène') !== -1) {
                var rMatch = msgText.match(resourcesExtractRegex);
                var rhe = rMatch[1];
                var sele = rMatch[2];
                var extraction = {
                    id: expID,
                    t: expTime.toISOString(),
                    rh: rhe,
                    sl: sele
                };
                expQueue[expID] = extraction;
            }
        }
    });

    console.log(expQueue); //TODO FIXME
    //updateReports(expQueue, 'extractions');
};

var injectCoordinatesToSimulator = function() {
    $('a.destroyElement').each(function(k, v) {
        var galaxy = getUrlParameter('galaxy', $(this)[0].href);
        var system = getUrlParameter('system', $(this)[0].href);
        var planet = getUrlParameter('planet', $(this)[0].href);
        var simulateBtn = $(this).parent().next('td').find('a.linkElement');
        var _href = simulateBtn.attr("href");
        var newUrl = _href + '&galaxy=' + galaxy + '&system=' + system + '&planet=' + planet;
        simulateBtn.attr("href", newUrl);
    });
}

var raidHint = function(playerData) {
    //####### CONFIG START ##########
    var minRaidAmount = 10000000;
    var maxRaidCount = 8;
    //####### CONFIG END ##########

    var origCoords = $('#planetselector option:selected')[0].innerText.match('\[[0-9]{1}:[0-9]+:[0-9]+\]');
    var origPlanet = buildPlanetObjFromCoords(origCoords);


    $('.raid-hint').remove();
    $('tr .messages_body').each(function( k, v ) {
        if (!$('table > tbody> tr > th > a', v).length) {
            return;
        }
        var targetCoords = $('table > tbody> tr > th > a', v)[0].innerText.match(/\[[0-9]{1}:[0-9]+:[0-9]+\]/);
        var targetPlanet = buildPlanetObjFromCoords(targetCoords);
        var distance = getDistance(origPlanet, targetPlanet);
        var rheniumFlag = false;
        var seleFlag = false;
        var azoteFlag = false;
        var rhe = 0;
        var sele = 0;
        var azote = 0;

        $('tr > td', v).each(function( k, v ) {
            if (rheniumFlag === true) {
                rhe = parseInt(v.innerHTML.replace(/\./g, ''));
            }
            if (azoteFlag === true) {
                azote = parseInt(v.innerHTML.replace(/\./g, ''));
            }
            if (seleFlag  === true) {
                sele = parseInt(v.innerHTML.replace(/\./g, ''));
            }
            if (v.innerHTML === 'Rhénium' || v.innerHTML === 'Rhenium') {
                rheniumFlag = true;
                azoteFlag = false;
                seleFlag = false;
            } else if (v.innerHTML === 'Sélénium' || v.innerHTML === 'Selenium') {
                seleFlag = true;
                rheniumFlag = false;
                azoteFlag = false;
            } else if (v.innerHTML === 'Azote' || v.innerHTML === 'Nitrogen') {
                azoteFlag = true;
                rheniumFlag = false;
                seleFlag = false;
            } else {
                azoteFlag = false;
                rheniumFlag = false;
                seleFlag = false;
            }
        });
        var total = (rhe + sele + azote);

        var link = $('td > a.destroyElement', v)[0];
        var url  = '';
        if (typeof(link) !== 'undefined') {
            url = link.href;
        }

        for (i = 1; i < maxRaidCount; i++) {
            var factor = Math.pow(2, i);
            var raidAmount = Math.floor(total/factor);
            if (raidAmount > minRaidAmount) {
                var hints = [];
                $.each(cargoShips, function (k, shipName) {
                    if (typeof(shipMap[shipName]) !== 'undefined') {
                        var shipID = shipMap[shipName];
                        var shipSpeed = getShipSpeed(shipID, playerData.techLevels);
                        var shipConsumption = getShipConsumption(shipID, playerData.techLevels);
                        var shipCnt = Math.round(total/(factor * ships[shipID].capacity));
                        var fleet = {
                            shipID: {consumption: shipConsumption, speed: shipSpeed, amount: shipCnt}
                        };
                        var duration = getDuration(shipSpeed, speedsMap[100], 0, distance, 5);
                        var totalConsumption = getConsumption(fleet, distance, duration, speedsMap[100], 0, 5);
                        shipCnt += Math.round(totalConsumption / ships[shipID].capacity) + 1 ;
                        hints.push(
                            translate(ships[shipID].codename) +
                            " <a href=\""+url+'&'+shipID+'='+shipCnt+"\">"+shortly_number(shipCnt)+"</a>"
                        );
                    }
                });
                var pillage = $('<span>', { 'class': 'raid-hint' });
                pillage.append(
                    '<p>Pillage ' + i + ' ['+ shortly_number(raidAmount) +'] : ' + hints.join(' / ') +'</p>'
                );
                $('div > center', v).append(pillage);
            }
        }
    });
};