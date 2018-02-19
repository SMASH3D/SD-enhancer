var template = '<div class="container">' +
    '                <div class="slate">' +
    '                    <h2 class="slate-title">Player {0}</h2>' +
    '                    <h3 class="part-title">Attacks during the last 24 hours</h3>' +
    '                    <p class="possible-attack">Next possible attack: {7}</p>' +
    '                    <div class="progress">' +
    '                        <div class="progress-bar progress-bar-info progress-bar-striped progress-bar-animated" role="progressbar" style="width:{1}%" title="{4} attacks more than 12 hours ago">' +
    '                            24h < attack < 12h' +
    '                        </div>' +
    '                        <div class="progress-bar progress-bar-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width:{2}%" title="{5} attacks between 6 and 12 hours ago">' +
    '                            12h < attack < 6h' +
    '                        </div>' +
    '                        <div class="progress-bar progress-bar-danger progress-bar-striped progress-bar-animated" role="progressbar" style="width:{3}%" title="{6} attacks less than 6 hours ago">' +
    '                            6h < attack' +
    '                        </div>' +
    '                    </div>' +
    '                    <span class="pull-right">{8}</span>' +
    '                       <h3 class="part-title">All-time attacks on this player:{9}</h3>' +
    '                </div>' +
    '            </div>';


if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

$( document ).ready(function() {
    var maxPer24hours = 12;
    chrome.storage.local.get(['combats'], function(obj) {
        var wars = obj.combats;
        $.each(wars, function(key, battles) {
            var repartition = getCombatRepartition(battles);
            var oldest = new Date(repartition.oldest);
            oldest.setHours(oldest.getHours()+24);
            var dailyTotal  = repartition.almostOld + repartition.fresh + repartition.freshest;
            $('.content').append(template.format(
                key,
                repartition.almostOld / maxPer24hours * 100,
                repartition.fresh / maxPer24hours * 100,
                repartition.freshest / maxPer24hours * 100,
                repartition.almostOld,
                repartition.fresh,
                repartition.freshest,
                dailyTotal < maxPer24hours ? 'NOW !' : oldest.toLocaleTimeString(),
                dailyTotal + '/' + maxPer24hours,
                repartition.total
            ));
        });
    });
});

function getCombatRepartition(battles) {
    var now = new Date();
    var old =  0;
    var almostOld = 0;
    var fresh = 0;
    var freshest = 0;
    var total = 0;
    var oldestCombat = now;
    $.each(battles, function(key, combat) {
        var combatTime = new Date(combat.t);
        var diff = now - combatTime;
        if (diff > 0) {
            total++;
            var ageInMinutes = Math.floor((diff / 1000) / 60);
            if (ageInMinutes > 24 * 60) {
                old++;
                return;
            } else if (ageInMinutes > 12 * 60) {
                almostOld++;
            } else if (ageInMinutes > 6 * 60) {
                fresh++;
            } else {
                freshest++;
            }
            oldestCombat = (oldestCombat > combatTime) ? combatTime : oldestCombat;
        }

    });
    return {
        freshest: freshest,
        fresh: fresh,
        almostOld: almostOld,
        old: old,
        oldest: oldestCombat,
        total: total
    };
}