
var fleetCompanion = function(playerData) {

    //FLEET PRESELECTION
    $.each(ships, function(shipID, ship) {
        var numericId = shipID.match('ship([0-9]{3})')[1];
        var requestedShips = getUrlParameter(shipID);
        var shipPos = parseInt(getUrlParameter(shipID+'pos'));
       if (typeof(shipID) !== 'undefined') {
           var availableShips = parseInt($('#'+shipID+'_value').text().replace(/\./g,''));
           var amountToSend = Math.min(requestedShips, availableShips);
           if (amountToSend > 0) {
               $('input[name='+shipID+']').val(amountToSend);
           }
           if ($.isNumeric(shipPos) && 0 < shipPos < 5) {
               $('#ship_r_' + numericId + '_input').val(shipPos);
           }
       }
    });
    //FLEET INFORMATION
    var fleet = getFleet(playerData);
    var fleetData = {};
    fleetData.cargoCapacity = getCargoCapacity(fleet);
    fleetData.fleetSpeed = getFleetSpeed(fleet);
    updateFleetInfo(fleetData);
    updateSubmitButton(fleet);
    $(".fleetInput").on("change cut paste keyup", function() {
        fleet = getFleet(playerData);
        fleetData.cargoCapacity = getCargoCapacity(fleet);
        fleetData.fleetSpeed = getFleetSpeed(fleet);
        updateSubmitButton(fleet);
        updateFleetInfo(fleetData);
    });
    //click on max btn
    $(
        'form > table > tbody > tr > td:nth-child(4) > a,' +
        'form > table > tbody > tr:nth-last-child(2) > td > a,' +
        '#attaqpos'
    ).click(function () {
        setTimeout(function() {
            fleet = getFleet(playerData);
            fleetData.cargoCapacity = getCargoCapacity(fleet);
            fleetData.fleetSpeed = getFleetSpeed(fleet);
            updateFleetInfo(fleetData);
            updateSubmitButton(fleet);
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

var updateSubmitButton = function(fleet) {
    if(!$.isEmptyObject(fleet)) {
        $('td > input[type="submit"]').addClass('on');
    } else {
        warningLED('Please select some ships to compose your fleet.');
        $('td > input[type="submit"]').removeClass('on');
    }
}

var updateFleetInfo = function(fleetData) {
    $('#lostCargo').remove();
    if (!$('#fleet-info').length) {
        $('form table tr td input').addClass('fleetInput');
        var fleetInfo = $('<span>', { 'id': 'fleet-info' });
        fleetInfo.append('<img src="'+chrome.extension.getURL("images/32.png")+'" title="Fleet Info by SD Companion">');
        var cargoCapacity = $('<p id="cargo-capacity-hint">Cargo Capacity</p>');
        cargoCapacity.append($('<input>', {
            type: 'text',
            pattern: "[0-9]*",
            size:"20",
            name: 'cargoCapacity',
            id: 'cargoCapacity',
            class: 'cargoCapacity',
            val: fleetData.cargoCapacity
        }));
        var fleetSpeed = $('<p id="fleet-speed-hint">Fleet Speed</p>');
        fleetSpeed.append($('<input>', {
            type: 'text',
            name: 'fleetSpeed',
            id: 'fleetSpeed',
            size:"4",
            class: 'fleetSpeed',
            disabled: true,
            val: fleetData.fleetSpeed
        }));
        fleetInfo.append(cargoCapacity, fleetSpeed);
        $('form table tr td input[type="submit"]').closest('td').append(fleetInfo);
    } else {
        $('input[name=cargoCapacity]').val(fleetData.cargoCapacity);
        $('input[name=fleetSpeed]').val(fleetData.fleetSpeed);
    }
}

var getCargoCapacity = function(fleet) {
    var cargoCapacity = 0;
    $.each(fleet, function(shipID, ship) {
        cargoCapacity += ship.cargo;
    });
    return cargoCapacity;
}

var getFleetSpeed = function(fleet) {
    var fleetSpeed = 'N/A';
    $.each(fleet, function(shipID, ship) {
        if (fleetSpeed === 'N/A') {
            fleetSpeed = 200000;
        }
        fleetSpeed = Math.min(fleetSpeed, ship.speed);
    });
    return fleetSpeed;
}

var getFleet = function(playerData) {
    if (typeof(playerData) == 'undefined' || typeof(playerData.techLevels) == 'undefined') {
        warningLED('Player technology levels unknown, please visit research tab of imperium page.');
        return false;
    }
    var fleet = {};
    $.each(ships, function(shipID, ship) {
        var shipAmount = getShipAmount(shipID);
        if (shipAmount > 0) {
            fleet[shipID] = {
                consumption: getShipConsumption(shipID, playerData.techLevels),
                speed: getShipSpeed(shipID, playerData.techLevels),
                cargo: shipAmount * ship.capacity,
                amount: shipAmount
            };
        }
    });
    return fleet;
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