// Saves options to chrome.storage.sync.
function saveOptions() {
    var options = {};
    options.minRaidAmount = $('#raid-min-amount').val();
    options.maxRaidWaves = $('#max-raid-amount').val();

    chrome.storage.sync.set({'options': options}, function() {
        console.log('Options saved', options);
        $('.check-mark').remove();
        $('#buttons-wrapper').append('<i class="material-icons check-mark color--green" >check_circle</i>');
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
    chrome.storage.sync.get(['options'], function(obj) {
        $('#raid-min-amount').val(obj.options.minRaidAmount);
        $('#max-raid-amount').val(obj.options.maxRaidWaves);
    });
}

window.onload = function(){
    restoreOptions();
    $('#save').on('click', function() {
        saveOptions();
    });
    $('#reset').on('click', function() {
        restoreOptions();
    });
    $('#reset-exp').on('click', function() {
        chrome.storage.local.remove('extractions', function() {
            console.log('extractions purged');
            $('#buttons-wrapper').append('<i class="material-icons color--green" >check_circle</i>');
        });
    });

    $('#reset-combats').on('click', function() {
        chrome.storage.local.remove('combats', function() {
            console.log('combat report purged');
            $('#buttons-wrapper').append('<i class="material-icons color--green" >check_circle</i>');
        });
    });


};

