var messageCompanion = function(playerData) {
    if (typeof playerData === 'undefined' || typeof playerData.techLevels === 'undefined') {
        warningLED('Player technology levels unknown, please visit research tab of imperium page.');
        return true;
    }
    var messageBox = $('.insideLeftMenu_top');
    var spyReportLink = $('.insideLeftMenu_text > table > tbody > tr > td').first();
    var spyHintBtn = buildCompanionButton('raid-hint-btn', 'spyReport', translate('Raid&nbsp;hints'), spyReportLink);
    var spyReportAnalyserBtn = buildCompanionButton('spy-analyser-btn', 'spyAnalyser', translate('Analyzer'), spyReportLink);
    spyReportLink.click(function () {
        messageBox.append(spyHintBtn);
        messageBox.append(spyReportAnalyserBtn);
        messageBox.on("click", spyHintBtn, function() {
            injectCoordinatesToSimulator();
            chrome.storage.sync.get(['options'], function(obj) {
                if (typeof(obj.options) === 'undefined') {
                    obj.options = {};
                }
                raidHint(playerData, obj.options);
            });
        });
        messageBox.on("click", spyReportAnalyserBtn, function() {
            chrome.storage.sync.get(['options'], function(obj) {
                if (typeof(obj.options) === 'undefined') {
                    obj.options = {};
                }
                spyReportAnalyzer(playerData, obj.options);
            });
        });
        spyReportLink.addClass('spyReport SDC');
    });

    var combatReportLink = $('.insideLeftMenu_content > div > table > tbody > tr:nth-child(4) > td');
    var combatJournaltBtn = buildCompanionButton('combat-journal-btn', 'combatReport', translate('Combat&nbsp;journal'), combatReportLink);
    combatReportLink.click(function () {
        messageBox.append(combatJournaltBtn);
        messageBox.on("click", combatJournaltBtn, function() {
            combatJournal();
        });
        combatReportLink.addClass('spyReport SDC');
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

var combatJournal = function() {
    $('a.fancybox').each(function(){
        if ($(this).text() !== "") {
            var combatLocation = extractCoordsFromString($(this).text());
            var link = $(this).attr('href').replace('&ajax=1', '');
            link = addCoordsToUrl(link,  combatLocation);
            $(this).attr('href', link);
            $(this).removeClass('fancybox.iframe');
            $(this).removeClass('fancybox');
        }
    });
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
    //(expQueue, 'extractions');
};

var injectCoordinatesToSimulator = function() {
    $('a.destroyElement').each(function() {
        var galaxy = getUrlParameter('galaxy', $(this)[0].href);
        var system = getUrlParameter('system', $(this)[0].href);
        var planet = getUrlParameter('planet', $(this)[0].href);
        var simulateBtn = $(this).parent().next('td').find('a.linkElement');
        var _href = simulateBtn.attr("href");
        var newUrl = _href + '&galaxy=' + galaxy + '&system=' + system + '&planet=' + planet;
        simulateBtn.attr("href", newUrl);
    });
};

var spyReportAnalyzer = function(playerData, options) {

    //####### CONFIG START ##########
    var minRaidAmount = typeof(options.minRaidAmount) !== 'undefined' ? options.minRaidAmount : 1000000;
    var minShipAmount = typeof(options.minShipAmount) !== 'undefined' ? options.minShipAmount : 1000;
    //####### CONFIG END ##########
    var toDelete = 0;
    $('tr .messages_body').each(function( k, v ) {
        if (!$('table > tbody> tr > th > a', v).length) {
            return;
        }
        var details = getSpyReportDetails(v);
        if (details.loot.total < minRaidAmount && details.ships.total < minShipAmount) {
            toDelete++;
            $(v).prev('.message_head').find('.checkboxMessages').prop('checked', true);
        }
    });
    if (toDelete > 0) {
        $('#messagestable > tbody > tr > td > input[type="submit"]').click();
    }
}

var getSpyReportDetails = function(messageBody) {
    var lang = getLanguage();
    var loot = {};
    loot.rhe = 0;
    loot.sele = 0;
    loot.nitro = 0;
    loot.total = 0;
    var seenShips = {};
    seenShips.total = 0;
    $('tr > td.transparent', messageBody).each(function(k, tdEl) {

        var currentRes = tdEl.innerHTML.toLowerCase();

        //Looking for resources
        if (currentRes === translate('rhenium')) {
            loot.rhe = parseInt($(this).next('td.transparent').text().replace(/\./g, ''));
        }
        if (currentRes === translate('selenium')) {
            loot.sele = parseInt($(this).next('td.transparent').text().replace(/\./g, ''));
        }
        if (currentRes === translate('nitrogen')) {
            loot.nitro = parseInt($(this).next('td.transparent').text().replace(/\./g, ''));
        }
        //Looking for ships
        var shipID = getShipIdByLabel(currentRes, lang);
        if (shipID !== 0) {
            //it's a ship, let's find out how many
            var shipAmount = parseInt($(this).next('td.transparent').text().replace(/\./g, ''));
            seenShips[shipID] = shipAmount;
            seenShips.total += shipAmount;
        }
    });
    loot.total = loot.rhe + loot.sele + loot.nitro;
    return {loot: loot, ships: seenShips};
}

var getShipIdByLabel = function(label, lang) {
    var id = 0;
    $.each(ships, function(shipID, ship) {
        if (label.toLowerCase().indexOf(ship.name[lang].toLowerCase()) !== -1) {
            id = shipID;
            return false;
        }
    });
    return id;
}

var raidHint = function(playerData, options) {
    //####### CONFIG START ##########
    var minRaidAmount = typeof(options.minRaidAmount) !== 'undefined' ? options.minRaidAmount : 1000000;
    var maxRaidCount = typeof(options.maxRaidWaves) !== 'undefined' ? options.maxRaidWaves : 10;
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

        var details = getSpyReportDetails(v);
        var total = details.loot.total;

        var link = $('td > a.destroyElement', v)[0];
        var url  = '';
        if (typeof(link) !== 'undefined') {
            url = link.href;
        }

        for (var i = 1; i <= maxRaidCount; i++) {
            var factor = Math.pow(2, i);
            var raidAmount = Math.floor(total/factor);
            var raidMetalAmount = Math.floor(details.loot.rhe/factor);
            var raidCrystalAmount = Math.floor(details.loot.sele/factor);
            var raidNitrogenAmount = Math.floor(details.loot.nitro/factor);
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
                            " <a href="+url+'&'+shipID+'='+shipCnt+" title='"+translate(ships[shipID].name.EN)+"'>"+shortly_number(shipCnt)+"</a>"
                        );
                    }
                });
                var pillage = $('<span>', { 'class': 'raid-hint' });
                pillage.append(
                    '<p class="hint">Pillage ' + i + ' ['+ shortly_number(raidAmount) +'] : ' + hints.join(' / ') +'</p>' +
                    '<div class="hint-detail">' + translate('Loot') + ': ' +
                        '<span class="metal" title='+translate("rhenium")+'>'+shortly_number(raidMetalAmount)+'</span> - ' +
                        '<span class="crystal" title='+translate("selenium")+'>'+shortly_number(raidCrystalAmount)+'</span> - ' +
                        '<span class="nitrogen" title='+translate("nitrogen")+'>'+shortly_number(raidNitrogenAmount)+'</span>' +
                    '</div>'
                );
                $('div > center', v).append(pillage);
            }
        }
    });
};