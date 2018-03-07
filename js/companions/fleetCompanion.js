
var fleetCompanion = function(playerData) {

    //FLEET PRESELECTION
    var availableShips = [];
    $.each(ships, function(shipID, ship) {
        var numericId = shipID.match('ship([0-9]{3})')[1];
        var requestedShips = getUrlParameter(shipID);
        var shipPos = parseInt(getUrlParameter(shipID+'pos'));
       if (typeof(shipID) !== 'undefined') {
           availableShips[shipID] = parseInt($('#'+shipID+'_value').text().replace(/\./g,''));
           var amountToSend = Math.min(requestedShips, availableShips[shipID]);
           if (amountToSend > 0) {
               $('input[name='+shipID+']').val(amountToSend);
           }
           if ($.isNumeric(shipPos) && 0 < shipPos < 5) {
               $('#ship_r_' + numericId + '_input').val(shipPos);
           }
       }
    });

    highlightAndBindshortcuts(availableShips);

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

    $('#heros_ship').change(function(){
        var fleet = getFleet(playerData);
        var fleetData = {};
        fleetData.cargoCapacity = getCargoCapacity(fleet);
        updateFleetInfo(fleetData);
        updateSubmitButton(fleet);
    });
    //if the user changes the amount of desired cargo, we align the fleet composition with it
    $('.cargoCapacity').change(function (e) {
        var remainingShipment = e.target.value;
        $.each(cargoShips, function (k, shipName) {
            if (typeof(shipMap[shipName]) !== 'undefined') {
                var shipID = shipMap[shipName];
                $('input[name='+shipID+']').val(0);
                if (availableShips[shipID] > 0) {
                    var amount = Math.min(Math.ceil(remainingShipment/ships[shipID].capacity), availableShips[shipID]);
                    $('input[name='+shipID+']').val(amount);
                    remainingShipment -= ships[shipID].capacity * amount;

                    var fleet = getFleet(playerData);
                    var fleetData = {};
                    fleetData.cargoCapacity = getCargoCapacity(fleet);
                    updateFleetInfo(fleetData);
                    updateSubmitButton(fleet);
                }
            }
        });
        if (remainingShipment > 0) {
            $('#extraCargo').remove();
            $("#cargo-capacity-hint").append('<span id="lostCargo" style="color: red;">-'+remainingShipment+'</span>');
        }
        if (remainingShipment < 0) {
            $('#extraCargo').remove();
            $("#cargo-capacity-hint").append('<span id="extraCargo" style="color: green;">+'+Math.abs(remainingShipment)+'</span>');
        }
    });
}

var highlightAndBindshortcuts = function(availableShips) {

    //common shortcuts
    createShortcutForShip(202, 'l', 'L', availableShips);//Light Cargo
    createShortcutForShip(225, 'e', 'E', availableShips);//extractor
    createShortcutForShip(219, 'r', 'R', availableShips);//Giga Recykler
    createShortcutForShip(209, 'y', 'y', availableShips);//Recykler

    //language specific shortcuts
    if (getLanguage() === 'FR') {
        createShortcutForShip(203, 'g', 'G', availableShips);//Grand transporteur
        createShortcutForShip(229, 'c', 'C', availableShips);//Cargo planétaire
        createShortcutForShip(215, 'x', 'x', availableShips);//eXterminateur
    } else {
        createShortcutForShip(203, 'h', 'H', availableShips);//Heavy Cargo
        createShortcutForShip(229, 'm', 'M', availableShips);//MercuryBigShipCargo
        createShortcutForShip(215, 'a', 'a', availableShips);//BattleCruiser
    }

    key('enter, space, return, right', function() {
        $('#tabs-1 > form > table > tbody > tr > td > input').click();
    });
}

var createShortcutForShip = function(shipID, shortcutLetter, hintLetter, availableShips) {
    var newText = $('#ship'+shipID+'_value').parent().find('a.tooltip').text().replace(
        hintLetter, '<span class="shortcut">'+hintLetter+'</span>'
    );
    $('#ship'+shipID+'_value').parent().find('a.tooltip').html(newText);
    key(shortcutLetter, function() {
        if ($('#ship'+shipID+'_input').val() == 0) {
            $('#ship'+shipID+'_input').val(availableShips['ship'+shipID]);
        } else {
            $('#ship'+shipID+'_input').val(0);
        }

    });
}

var updateSubmitButton = function(fleet) {
    fleet.hasRecycler = getHasRecycler(fleet);
    if(!$.isEmptyObject(fleet) || $('#heros_ship').find(":selected").text() !== "") {
        $('td > input[type="submit"]').removeClass('off');
        $('td > input[type="submit"]').addClass('on');
    } else {
        warningLED('Please select some ships to compose your fleet.');
        $('td > input[type="submit"]').removeClass('on');
        $('td > input[type="submit"]').addClass('off');
    }
    if (fleet.hasRecycler === true) {
        var actionUrl = $('#tabs-1 > form').attr('action');
        $('#tabs-1 > form').attr('action', actionUrl+'&target_type=2');
    }
}

var updateFleetInfo = function(fleetData) {
    $('#lostCargo').remove();
    $('#extraCargo').remove();
    if (!$('#fleet-info').length) {
        $('form table tr td input').addClass('fleetInput');
        var fleetInfo = $('<span>', { 'id': 'fleet-info', 'class': 'infoPanel' });
        fleetInfo.append('<img src="'+chrome.extension.getURL("images/logo/32.png")+'" width="32px" height="30px" title="Fleet Info by SD Companion">');

        var cargoCapacity = $('<p id="cargo-capacity-hint">Cargo Capacity</p>');
        cargoCapacity.append($('<input>', {
            type: 'text',
            pattern: "[0-9]*",
            size:"20",
            name: 'cargoCapacity',
            id: 'cargoCapacity',
            class: 'cargoCapacity',
            val: (typeof fleetData.cargoCapacity !== 'undefined') ? fleetData.cargoCapacity : 0
        }));
        var fleetSpeed = $('<p id="fleet-speed-hint">Fleet Speed</p>');
        fleetSpeed.append($('<input>', {
            type: 'text',
            name: 'fleetSpeed',
            id: 'fleetSpeed',
            size:"4",
            class: 'fleetSpeed',
            disabled: true,
            placeholder: 'N/A',
            val: (typeof fleetData.fleetSpeed !== 'undefined') ? fleetData.fleetSpeed : 0
        }));
        fleetInfo.append(cargoCapacity, fleetSpeed);
        $('form table tr td input[type="submit"]').closest('td').append(fleetInfo);
    } else {
        if (typeof fleetData.cargoCapacity !== 'undefined') {
            $('input[name=cargoCapacity]').val(fleetData.cargoCapacity);
        }
        if (typeof fleetData.fleetSpeed !== 'undefined') {
            $('input[name=fleetSpeed]').val(fleetData.fleetSpeed);
        }
    }
}

var getCargoCapacity = function(fleet) {
    var cargoCapacity = 0;
    $.each(fleet, function(shipID, ship) {
        cargoCapacity += ship.cargo;
    });
    return cargoCapacity;
}

var getHasRecycler = function(fleet) {
    var hasRecycler = false;
    $.each(fleet, function(shipID, ship) {
        if ((shipID === 'ship209' || shipID === 'ship219' && ship.amount > 0)) {
            hasRecycler = true;
        }
    });
    return hasRecycler;
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