
var fleetCompanion = function() {

    //FLEET PRESELECTION
    var availableShips  = [];
    var requestedShips  = [];
    $.each(ships, function(shipID, ship) {
        var shipAmount = getUrlParameter(shipID);
       if (typeof(shipID) !== 'undefined') {
           requestedShips[shipID] = shipAmount;
           availableShips[shipID] = parseInt($('#'+shipID+'_value').text().replace('.', ''));
           var amountToSend = Math.min(requestedShips[shipID], availableShips[shipID]);
           if (amountToSend > 0) {
               $('input[name='+shipID+']').val(amountToSend);
           }
       }
    });
    //FLEET INFORMATION
    var fleetData = {};
    fleetData.cargoCapacity = getCargoCapacity();
    updateFleetInfo(fleetData);
    $(".fleetInput").on("change cut paste keyup", function() {
        fleetData.cargoCapacity = getCargoCapacity();
        updateFleetInfo(fleetData);
    });
    $('form > table > tbody > tr > td:nth-child(4) > a').click(function () {
        setTimeout(function() {
            fleetData.cargoCapacity = getCargoCapacity();
            updateFleetInfo(fleetData)
        }, 100);
    });

    //if the user changes the amount of desired cargo, we align the fleet composition with it
    $('.cargoCapacity').change(function (e) {
        var remainingShipment = e.target.value;
        $.each(cargoShips, function (k, shipName) {
            if (typeof(shipMap[shipName]) !== 'undefined') {
                var shipID = shipMap[shipName];
                $('input[name='+shipID+']').val(0);
                if (availableShips[shipID] > 0 && remainingShipment > 10000) {
                    var amount = Math.min(Math.floor(remainingShipment/ships[shipID].capacity), availableShips[shipID]);
                    $('input[name='+shipID+']').val(amount);
                    remainingShipment -= ships[shipID].capacity * amount;
                }
            }
        });
        if (remainingShipment > 0) {
            $("#cargo-capacity-hint").append('<span id="lostCargo" style="color: red;">-'+remainingShipment+'</span>');
        }
    });
}

var updateFleetInfo = function(fleetData) {
    $('#lostCargo').remove();
    if (!$('#fleet-info').length) {
        $('form table tr td input').addClass('fleetInput');
        var fleetInfo = $('<span>', { 'id': 'fleet-info' });
        var cargoCapacity = $('<p id="cargo-capacity-hint">Cargo Capacity : </p>');
        cargoCapacity.append($('<input>', {
            type: 'number',
            name: 'cargoCapacity',
            id: 'cargoCapacity',
            class: 'cargoCapacity',
            val: fleetData.cargoCapacity
        }));
        fleetInfo.append(cargoCapacity);
        $('form table tr td input[type="submit"]').closest('td').append(fleetInfo);
    } else {
        $('input[name=cargoCapacity]').val(fleetData.cargoCapacity);
    }
}

var getCargoCapacity = function() {
    var cargoCapacity = 0;
    $.each(ships, function(shipID, ship) {
        cargoCapacity += getShipAmount(shipID) * ship.capacity;
    });
    return cargoCapacity;
}

var getShipAmount = function(shipID) {
    var amount = 0;
    if (typeof (ships[shipID]) !== 'undefined') {
        if ($('input[name='+shipID+']').length) {
            amount = parseInt($('input[name='+shipID+']').val());
        }
    }
    return $.isNumeric(amount) ? amount : 0;
}