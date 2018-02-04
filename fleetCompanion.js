
var fleetCompanion = function() {
    var useGT = true;

    //CARGO FLEET PRESELECTION
    var pt = getUrlParameter(ships.LightCargo.inputName);
    var gt = getUrlParameter(ships.HeavyCargo.inputName);
    var cp = getUrlParameter(ships.MercuryBigShipCargo.inputName);

    var availablePT = parseInt($('#'+ships.LightCargo.inputName+'_value').text().replace('.', ''));
    var availableGT = parseInt($('#'+ships.HeavyCargo.inputName+'_value').text().replace('.', ''));
    var availableCP = parseInt($('#'+ships.MercuryBigShipCargo.inputName+'_value').text().replace('.', ''));

    if (typeof(pt) !== 'undefined') {
        ptAmount = Math.min(pt, availablePT);
        $('input[name='+ships.LightCargo.inputName+']').val(ptAmount);
    }
    if (typeof(gt) !== 'undefined') {
        gtAmount = Math.min(gt, availableGT);
        $('input[name='+ships.HeavyCargo.inputName+']').val(gtAmount);
    }
    if (typeof(cp) !== 'undefined') {
        cpAmount = Math.min(cp, availableCP);
        $('input[name='+ships.MercuryBigShipCargo.inputName+']').val(cpAmount);
    }

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

    $('.cargoCapacity').change(function (e) {
        var remainingShipment = e.target.value;
        if (availableCP > 0) {
            var cpAmount = Math.min(Math.floor(remainingShipment/ships.MercuryBigShipCargo.capacity), availableCP);
            $('input[name='+ships.MercuryBigShipCargo.inputName+']').val(cpAmount);
            remainingShipment = remainingShipment - cpAmount*ships.MercuryBigShipCargo.capacity;
        }
        if (remainingShipment > 100000 && availablePT > 0) {
            var ptAmount = Math.min(Math.floor(remainingShipment/ships.LightCargo.capacity), availablePT);
            $('input[name='+ships.LightCargo.inputName+']').val(ptAmount);
        }
        if (useGT && remainingShipment > 100000 && availableGT > 0) {
            var gtAmount = Math.min(Math.floor(remainingShipment/ships.HeavyCargo.capacity), availableGT);
            $('input[name='+ships.HeavyCargo.inputName+']').val(gtAmount);
        }
    });
}

var updateFleetInfo = function(fleetData) {
    if (!$('#fleet-info').length) {
        $('form table tr td input').addClass('fleetInput');
        var fleetInfo = $('<span>', { 'id': 'fleet-info' });
        var cargoCapacity = $('<p>Cargo Capacity : </p>');
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
    cargoCapacity +=  getShipAmount("LightCargo") * ships.LightCargo.capacity;
    cargoCapacity += getShipAmount("HeavyCargo") * ships.HeavyCargo.capacity;
    cargoCapacity += getShipAmount("MercuryBigShipCargo") * ships.MercuryBigShipCargo.capacity;
    cargoCapacity += getShipAmount("Recycler") * ships.Recycler.capacity;
    cargoCapacity += getShipAmount("GigaRecycler") * ships.GigaRecycler.capacity;
    return cargoCapacity;
}

var getShipAmount = function(shipType) {
    var amount = 0;
    if (typeof (ships[shipType]) !== 'undefined') {
        if ($('input[name='+ships[shipType].inputName+']').length) {
            amount = parseInt($('input[name='+ships[shipType].inputName+']').val());
        }
    }
    return $.isNumeric(amount) ? amount : 0;
}