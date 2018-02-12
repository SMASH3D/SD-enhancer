var imperiumCompanion = function() {



    //buildings
    /*
    $('#tabs-2 > table').tableToJSON(
        {
            extractor : function(cellIndex, $cell) {
                console.log(cellIndex);
                console.log($cell);

                return {
                    name: $cell.find('td').text(),
                    avatar: $cell.find('td').innerHTML
                };
            }
        }
    )*/

    extractTechLevels();
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
