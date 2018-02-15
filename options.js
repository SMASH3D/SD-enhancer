// Saves options to chrome.storage.sync.
function saveOptions() {
    var options = {};
    options.minRaidAmount = $('#raid-min-amount').val();

    chrome.storage.sync.set({'options': options}, function() {
        console.log('Options saved', options);
        $('#buttons-wrapper').append('<i class="material-icons color--green" >check_circle</i>');
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
    chrome.storage.sync.get(['options'], function(obj) {
        $('#raid-min-amount').val(obj.options.minRaidAmount);
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
};

