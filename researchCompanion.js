var researchCompanion = function() {
    updateTechs();
}

var updateTechs = function() {
    var language = getLanguage();
    var techExtractRegex = /(.*)\ \(Level\ ([0-9]+)\)/;
    if (language === 'FR') {
        techExtractRegex = /(.*)\ \(Niveau\ ([0-9]+)\)/;
    }
    var techLevels = {};
    $('#tabs-2 > table > tbody > tr > td > table > tbody > tr:nth-child(1) > th > a:not(".tooltip_sticky")').each(function(k, v){

        if ($(this).parent()[0]) {
            var techString = $(this).parent()[0].innerText;
            var matches = techExtractRegex.exec(techString);
            if (matches !== null) {
                techLevels[matches[1]] = parseInt(matches[2]);
            }
        }
    });

    if (!jQuery.isEmptyObject(techLevels)) {
        techLevels.lang = language;
        saveTechs(techLevels);
    } else {
        $('#tabs-2 > table > tbody').prepend(
            $('<tr><th colspan="2" style="color:red;">Parsing des technologies KO.</th></tr>')
        );
    }
}

var saveTechs = function(techLevels) {
    chrome.storage.sync.set({'techLevels': techLevels}, function() {
        console.log('Technology Levels saved', techLevels);
        $('#tabs-2 > table > tbody').prepend(
            $('<tr><th colspan="2" style="color:green;">Parsing des technologies OK.</th></tr>')
        );
    });
}