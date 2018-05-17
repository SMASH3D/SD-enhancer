
var shipyardCompanion = function() {

    var uri = window.location.pathname;
    var shipID = getUrlParameter('build');
    var targetAmount = getUrlParameter('amount');
    var batchAmount = typeof targetAmount !== 'undefined' ? Math.min(targetAmount, 10000000000000) : 10000000000000;
    if (typeof(shipID) !== 'undefined' && batchAmount > 0 ) {
        targetAmount -= batchAmount;

        var params = getQueryParameters();
        params.amount = targetAmount;
        var search = setQueryParameters(params);

        $('#tabs-3 > form').attr('action', uri+'?'+search);
        build(shipID, batchAmount);
    }
}

