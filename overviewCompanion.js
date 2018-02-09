var overviewCompanion = function() {
    getVoteTimer();
}

var getVoteTimer = function() {
    chrome.storage.sync.get(['nextVoteTimer'], function(computedDate) {
        if (computedDate && computedDate.nextVoteTimer) {
            var nextPossibleVoteTime = new Date(computedDate.nextVoteTimer);
            var now = new Date();
            if (nextPossibleVoteTime > now) {
                $(this).parent().append('<p class="vote-timer">/!\ VOTE NOW /!\</p>');
            } else {
                $('#tabs-links > table > tbody > tr:nth-child(6) > td:nth-child(2) > a').hide();
                var resetBtn= $('<input type="button" value="reset" class="ui-button ui-state-default ui-corner-all " id="resetTimer"/>');

                var timerBox = $('<span class="timer"></span>');
                timerBox.append('<p class="vote-timer">Next votes: '+nextPossibleVoteTime.toLocaleTimeString()+'</p>');
                timerBox.append(resetBtn);
                $('#tabs-links > table > tbody > tr:nth-child(6) > td:nth-child(2)').append(timerBox);

                timerBox.on("click", resetBtn, function() {
                    saveVote();
                    timerBox.remove();
                    $('#tabs-links > table > tbody > tr:nth-child(6) > td:nth-child(2) > a').show();
                });
            }
        } else {
            $('#tabs-links > table > tbody > tr:nth-child(6) > td:nth-child(2)').append('<p>VOTE NOW</p>');
        }
    });

    $('#tabs-links > table > tbody > tr:nth-child(6) > td:nth-child(2) > a').on('mousedown', function(e){
        saveVote();
    });
}

var saveVote = function() {
    var now = new Date();
    var twoHoursLater = now.setHours(now.getHours()+2);
    chrome.storage.sync.set({'nextVoteTimer': twoHoursLater}, function() {
        console.log('Vote Time saved', twoHoursLater);
    });
}
