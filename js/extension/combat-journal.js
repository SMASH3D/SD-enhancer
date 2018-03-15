var template = '<div class="container">' +
    '                <div class="slate">' +
    '                    <h3 class="slate-title">Player: {0}</h3>' +
    '                    <h4 class="part-title">Attacks during the last 24 hours</h4>' +
    '                    <p class="possible-attack">Next possible attack: {1}</p>' +
    '                    <div class="progress">' +
    '                        <div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" title="{2} attacks more than 12 hours ago">' +
    '                            12h+' +
    '                        </div>' +
    '                        <div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" title="{3} attacks between 6 and 12 hours ago">' +
    '                            6h+' +
    '                        </div>' +
    '                        <div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" title="{4} attacks less than 6 hours ago">' +
    '                            -6h' +
    '                        </div>' +
    '                        <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" title="{5} Attacks Remaining">' +
    '                            Remaining: {5}' +
    '                        </div>' +
    '                    </div>' +
    '                    <span class="pull-right">{6}</span>' +
    '                       <h4 class="part-title">All-time attacks on this player:{7}</h4>' +
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
    restoreRank();
    $('#save').on('click', function() {
        saveRank();
    });

    var maxPer24hours = 10;
    chrome.storage.local.get(['combats'], function(obj) {
        var wars = obj.combats;
        $.each(wars, function(key, battles) {
            if (key === 'PNJ') {
                maxPer24hours = parseInt($('#current-position').val())+5;
            }
            var repartition = getCombatRepartition(battles);
            var oldest = new Date(repartition.oldest);
            oldest.setHours(oldest.getHours()+24);
            var dailyTotal  = repartition.almostOld + repartition.fresh + repartition.freshest;
            $('.content').append(template.format(
                key,
                dailyTotal < maxPer24hours ? 'NOW !' : oldest.toLocaleTimeString(),
                repartition.almostOld,
                repartition.fresh,
                repartition.freshest,
                maxPer24hours - dailyTotal,
                dailyTotal + '/' + maxPer24hours,
                repartition.total
            ));
            updateBars(repartition.almostOld, repartition.fresh, repartition.freshest, dailyTotal, maxPer24hours);
            if (key === 'PNJ') {
                $('#current-position').on('change paste keyup', function() {
                    var newMaxPer24hours = parseInt($(this).val())+5;
                    updateBars(repartition.almostOld, repartition.fresh, repartition.freshest, dailyTotal, newMaxPer24hours);
                    $(".pull-right").text(dailyTotal + '/' + newMaxPer24hours);
                    var newRemaining = newMaxPer24hours - dailyTotal;
                    $(".progress-bar-success").text('Remaining: ' + newRemaining);
                });
            }
        });
        /*if (typeof obj.combats === 'undefined') {
            $('message-box').show();
        }*/
    });


});

function updateBars(almostOld, fresh, freshest, dailyTotal, maxPer24hours) {
    $('.progress-bar-info').css('width', almostOld / maxPer24hours * 100 + '%');
    $('.progress-bar-warning').css('width', fresh / maxPer24hours * 100 + '%');
    $('.progress-bar-danger').css('width', freshest / maxPer24hours * 100 + '%');
    $('.progress-bar-success').css('width', (maxPer24hours - dailyTotal) / maxPer24hours * 100 + '%');
}

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

// Saves rank to chrome.storage.sync.
function saveRank() {
    var rank = $('#current-position').val();
    chrome.storage.sync.set({'rank': rank}, function() {
        console.log('rank saved', rank);
        $('#buttons-wrapper').append('<i class="material-icons color--green" >check_circle</i>');
    });
}

function restoreRank() {
    chrome.storage.sync.get(['rank'], function(obj) {
        $('#current-position').val(obj.rank);
    });
}