var totalLoot;
var rentability;
var profitability;
var lossDamageRatio;

var combatReportCompanion = function() {
    var attacker;
    var defender;
    if ($('#content > div > table').length) {
        attacker = $('#content > div > table > tbody > tr > td:nth-child(1)')[0].innerText;
        defender = $('#content > div > table > tbody > tr > td:nth-child(3)')[0].innerText;
    } else {
        return;
    }


    var galaxy = getUrlParameter('galaxy');
    var system = getUrlParameter('system');
    var planet = getUrlParameter('planet');
    var coordinates = null;
    if (typeof(galaxy) !== 'undefined' && typeof(system) !== 'undefined' && typeof(planet) !== 'undefined') {
        coordinates = '[' + parseInt(galaxy) + ':' + parseInt(system) + ':' + parseInt(planet) + ']';
    }

    var intro = $('#content > div > div > div:nth-child(1)')[0].innerText;
    var summary = $('#content > div > div > div:nth-last-child(2)')[0].innerText.replace(/\./g, "");

    var loots = extractLoot(summary);
    var losses = extractLosses(summary);

    injectInfoPanel(loots, losses);


    var combatID = getUrlParameter('raport');
    var timeExtractRegex = /([0-9]{2}). ([a-zA-Z]{3}) ([0-9]{4}), ([0-9]{2}):([0-9]{2}):([0-9]{2})/g;
    var tMatch = timeExtractRegex.exec(intro);

    if (tMatch !== null) {
        var combatTime  = new Date(tMatch[3], getMonthNumber(tMatch[2]), tMatch[1], tMatch[4], tMatch[5], tMatch[6]);
        chrome.storage.local.get(['combats'], function(obj) {
            var combats = obj.combats;
            if (typeof combats === 'undefined') {
                combats = {};
            }
            if (typeof combats[defender] === 'undefined') {
                combats[defender] = [];
            }
            combats[defender].push({
                id: combatID,
                c: coordinates,
                t: combatTime.toISOString()
            });

            var uniqueCombats = removeDuplicates(combats[defender], 'id');

            combats[defender] = uniqueCombats;
            chrome.storage.local.set({'combats': combats}, function() {
                console.log('combat report saved', combats);
                okLED('Combat report saved');
            });
        });
    }
}

var extractLoot = function(summary){
    var rezExtractor = getLanguage() === 'FR' ? /(\d+)\sRhénium.\D+(\d+)\sSélénium\D+(\d+)\sAzote/gm : /(\d+)\sRhenium.\D+(\d+)\sSelenium\D+(\d+)\sNitrogen/gm;
    var i = 0;
    var directLoot = 0;
    var dfLoot = 0;
    while ((match = rezExtractor.exec( summary )) != null)
    {
        if (i === 0) {
            directLoot = {rhe: new Number(match[1]), sele: new Number(match[2]), nitro: new Number(match[3])};
        } else {
            dfLoot = {rhe: new Number(match[1]), sele: new Number(match[2]), nitro: new Number(match[3])};
        }
        i++;
    }
    return {directLoot: directLoot, dfLoot: dfLoot};
}

var extractLosses = function(summary){
    var unitLossExtractor  = getLanguage() === 'FR' ? /Pertes \D+(\d+)/gm : /losses:\s(\d+)/gm;
    var i = 0;
    var attackersLoss = 0;
    var defendersLoss = 0;
    while ((match = unitLossExtractor.exec( summary )) != null)
    {
        if (i === 0) {
            attackersLoss = new Number(match[1]);
        } else {
            defendersLoss = new Number(match[1]);
        }
        i++;
    }
    return {attackersLoss: attackersLoss, defendersLoss: defendersLoss};
}

var updateInfos = function(consumption) {
    var updRentability = rentability - consumption;
    var updprofitability = updRentability / Math.max(1, totalLoot) * 100;
    $('input[name=rentaInfo]').val(NumberGetHumanReadable(updRentability));
    $('input[name=profitInfo]').val(updprofitability.toFixed(2));
}

var injectInfoPanel = function(loots, losses){
    totalLoot = loots.dfLoot.rhe + loots.dfLoot.sele + loots.dfLoot.nitro + loots.directLoot.rhe + loots.directLoot.sele + loots.directLoot.nitro;

    rentability = totalLoot - losses.attackersLoss;
    profitability = (totalLoot - losses.attackersLoss) / Math.max(1, totalLoot) * 100;
    lossDamageRatio = losses.defendersLoss / Math.max(1, losses.attackersLoss);

    var consumptionBox = $('<p>');
    consumptionBox.append(
        $('<label for="consumption">Fuel consumption</label>'),
        $('<input>', {
            type: 'text',
            pattern: "[0-9]*",
            size:"20",
            name: 'consumption',
            id: 'fuelConsumption',
            placeholder: 'N/A'
        })
    );

    var rentaBox = $('<p>');
    rentaBox.append(
        $('<label for="rentaInfo">Rentability</label>'),
        $('<input>', {
            type: 'text',
            name: 'rentaInfo',
            id: 'rentaInfo',
            size:"20",
            class: 'infoBox',
            disabled: true,
            val: NumberGetHumanReadable(rentability)
        })
    );

    var profitBox = $('<p>');
    profitBox.append(
        $('<label for="profitInfo">Profitability (%)</label>'),
        $('<input>', {
            type: 'text',
            name: 'profitInfo',
            id: 'profitInfo',
            size:"5",
            class: 'infoBox',
            disabled: true,
            val: profitability.toFixed(2)
        })
    );

    var ldrBox = $('<p>');
    ldrBox.append(
        $('<label for="ldrInfo">Damage / Loss ratio</label>'),
        $('<input>', {
            type: 'text',
            name: 'ldrInfo',
            id: 'ldrInfo',
            size:"10",
            class: 'infoBox',
            disabled: true,
            val: Math.round(lossDamageRatio)
        })
    );

    var infoPanel = $('<div>', {
        id: 'raid-info',
        class: 'infoPanel',
    }).append(
        consumptionBox,
        rentaBox,
        profitBox,
        ldrBox,
        '<img src="'+chrome.extension.getURL("images/logo/32.png")+'" title="Raid Info by SD Companion" width="32px" height="32px">'
    );

    $('#content').append(infoPanel);

    $('#fuelConsumption').change(function (e) {
        var fuelConsumption = e.target.value;

        updateInfos(fuelConsumption);
    });
}