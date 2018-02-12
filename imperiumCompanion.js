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
    var tech = [];
    $('#tabs-3 > table > tbody > tr:nth-child(1) > th').each(function(k, v){
        i++;
        var matches = headerExtractorRegexp.exec(v.outerHTML);
        if (matches && matches[1]) {
            tech[i] = matches[1];
        }
    });
    var table =  $('#tabs-3 > table').tableToJSON(
        {
            allowHTML: true,
            extractor : function(cellIndex, $cell) {
                console.log(tech[cellIndex], $cell[0].innerText);
            }
        }
    );
}
