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
    var summary = $('#content > div > div > div:nth-last-child(2)')[0].innerText;

    var combatID = getUrlParameter('raport');
    var timeExtractRegex = /([0-9]{2}). ([a-zA-Z]{3}) ([0-9]{4}), ([0-9]{2}):([0-9]{2}):([0-9]{2})/g;
    var tMatch = timeExtractRegex.exec(intro);

    if (tMatch !== null) {
        var combatTime  = new Date(tMatch[3], getMonthNumber(tMatch[2]), tMatch[1], tMatch[4], tMatch[5], tMatch[6]);

        //var now = new Date();
        //var oneDayLater = combatTime.setHours(now.getHours()+24);
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
            });
        });
    }
}

//http://www.spacedestiny.com/play/s2/CombatReport.php?raport=48533&fame=1
