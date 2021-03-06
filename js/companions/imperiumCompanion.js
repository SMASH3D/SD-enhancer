var imperiumCompanion = function(playerData) {



    //buildings
//(?:\<br\ \/\>){2}(.+)\:<br\ \/\>

    $('#tabs-4 > table > tbody > tr').each(function() {
        $('td', $(this)).each(function(k, v) {
            if (typeof($(this).attr('name')) !== 'undefined') {

                var entry = removeDiacritics($(this).attr('name').replace(/<br \/>/g, '|'));
                console.log(entry);
            }
        });
    });



    var techLevels = extractTechLevels();
    if (typeof(playerData) == 'undefined' || typeof(playerData.techLevels) == 'undefined' || !isEquivalent(techLevels, playerData.techLevels)) {
        saveTechs(techLevels);
    }
}

var extractTechLevels = function() {
    var headerExtractorRegexp = /Dialog\.info\(([0-9]+)\)/;
    var i = 0;
    var techCols = {};
    var techLevels;
    //Build map of colIndex => techID
    $('#tabs-3 > table > tbody > tr:nth-child(1) > th').each(function(k, v){
        i++;
        var matches = headerExtractorRegexp.exec(v.outerHTML);
        if (matches && matches[1] && matches[1].length) {
            techCols[i] = matches[1];
        }
    });

    //Parse the tech levels and store them in format techID => techLvl
    var techLevels = {};
    var j = 0;
    $('#tabs-3 > table > tbody > tr > td').each(function(k, v) {
        j++;
        techLevels[techCols[j]] = parseInt(v.innerText);
    });
    return techLevels;
}

var saveTechs = function(techLevels) {
    chrome.storage.sync.set({'techLevels': techLevels}, function() {
        console.log('Technology Levels saved', techLevels);
        okLED("Technology Levels saved");
    });
}