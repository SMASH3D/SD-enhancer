window.onload = function(){

    var pageRef;
    pageRef = getUrlParameter('page');
    if (pageRef === 'messages') {
        var link = $('.insideLeftMenu_text > table > tbody > tr > td').first();
        var elt = $('.insideLeftMenu_top');
        var btn = $('<input type="button" value="Raid hints" class="add_button ui-button ui-widget ui-state-default ui-corner-all" id="raid-hint-btn" style="margin-top: 25px;"/>');
        link.click(function () {
            elt.append(btn);
            elt.on("click", btn, function() {
                raidHint();
            });
            link.addClass('spyReport');
        });

        $('.insideLeftMenu_text > table > tbody > tr > td').click(function () {
            if (!$( this ).hasClass('spyReport')) {
                btn.remove();
            }
        });
    }
    if (pageRef === 'fleet') {
        var useGT = true;

        //CARGO FLEET PRESELECTION
        var pt = getUrlParameter('ship'+ships.LightCargo.id);
        var gt = getUrlParameter('ship'+ships.HeavyCargo.id);
        var cp = getUrlParameter('ship'+ships.MercuryBigShipCargo.id);

        var availablePT = parseInt($('#ship202_value').text().replace('.', ''));
        var availableGT = parseInt($('#ship203_value').text().replace('.', ''));
        var availableCP = parseInt($('#ship229_value').text().replace('.', ''));

        if (typeof(pt) !== 'undefined') {
            $('input[name=ship202]').val(Math.min(pt, availablePT));
        }
        if (typeof(gt) !== 'undefined') {
            $('input[name=ship203]').val(Math.min(gt, availableGT));
        }
        if (typeof(cp) !== 'undefined') {
            $('input[name=ship229]').val(Math.min(cp, availableCP));
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
                $('input[name=ship'+ships.MercuryBigShipCargo.id+']').val(cpAmount);
                remainingShipment = remainingShipment - cpAmount*ships.MercuryBigShipCargo.capacity;
            }
            if (remainingShipment > 100000 && availablePT > 0) {
                var ptAmount = Math.min(Math.floor(remainingShipment/ships.LightCargo.capacity), availablePT);
                $('input[name=ship'+ships.LightCargo.id+']').val(ptAmount);
            }
            if (useGT && remainingShipment > 100000 && availableGT > 0) {
                var gtAmount = Math.min(Math.floor(remainingShipment/ships.HeavyCargo.capacity), availableGT);
                $('input[name=ship'+ships.HeavyCargo.id+']').val(gtAmount);
            }
        });
    }
};

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
    var cargoCapacity;
    cargoCapacity =  $('input[name=ship202]').val() * ships.LightCargo.capacity;
    cargoCapacity += $('input[name=ship203]').val() * ships.HeavyCargo.capacity;
    cargoCapacity +=  $('input[name=ship229]').val() * ships.MercuryBigShipCargo.capacity;

    cargoCapacity +=  $('input[name=ship209]').val() * ships.Recycler.capacity;
    cargoCapacity +=  $('input[name=ship219]').val() * ships.GigaRecycler.capacity;

    cargoCapacity +=  $('input[name=ship210]').val() * 5; //sonde
    return cargoCapacity;
}

var raidHint = function() {
    //####### CONFIG START ##########
    var PTcapacity = 12000;
    var GTcapacity = 35000;
    var CPcapacity = 100000;
    var minRaidAmount = 10000000;
    var maxRaidCount = 8;
    //####### CONFIG END ##########

    $('.raid-hint').remove();
    $('tr .messages_body').each(function( k, v ) {
        var rheniumFlag = false;
        var seleFlag = false;
        var azoteFlag = false;
        var rhe = 0;
        var sele = 0;
        var azote = 0;

        $('tr > td', v).each(function( k, v ) {
            if (rheniumFlag === true) {
                rhe = parseInt(v.innerHTML.replace(/\./g, ''));
            }
            if (azoteFlag === true) {
                azote = parseInt(v.innerHTML.replace(/\./g, ''));
            }
            if (seleFlag  === true) {
                sele = parseInt(v.innerHTML.replace(/\./g, ''));
            }
            if (v.innerHTML === 'Rhénium' || v.innerHTML === 'Rhenium') {
                rheniumFlag = true;
                azoteFlag = false
                seleFlag = false;
            } else if (v.innerHTML === 'Sélénium' || v.innerHTML === 'Selenium') {
                seleFlag = true;
                rheniumFlag = false;
                azoteFlag = false;
            } else if (v.innerHTML === 'Azote' || v.innerHTML === 'Nitrogen') {
                azoteFlag = true;
                rheniumFlag = false;
                seleFlag = false;
            } else {
                azoteFlag = false;
                rheniumFlag = false;
                seleFlag = false;
            }
        });
        var total = (rhe + sele + azote);

        var link = $('td > a.destroyElement', v)[0];
        var url  = '';
        if (typeof(link) !== 'undefined') {
            url = link.href;
        }

        for (i = 1; i < maxRaidCount; i++) {
            var factor = Math.pow(2, i);
            var raidAmount = Math.floor(total/factor);
            if (raidAmount > minRaidAmount) {
                var PTcnt = Math.round(total/(factor*ships.LightCargo.capacity));
                var GTcnt = Math.round(total/(factor*ships.HeavyCargo.capacity));
                var CPcnt = Math.round(total/(factor*ships.MercuryBigShipCargo.capacity));
                var pillage = $('<span>', { 'class': 'raid-hint' });

                pillage.append(
                    '<p>Pillage ' + i + ' ['+ raidAmount.toLocaleString() +'] : ' + translate('LC') + ' ' +
                    "<a href=\""+url+'&ship202='+PTcnt+"\">"+PTcnt+"</a> " + ' / ' + translate('HC') + ' ' +
                    "<a href=\""+url+'&ship203='+GTcnt+"\">"+GTcnt+"</a> " + ' / ' + translate('MBSC') + ' ' +
                    "<a href=\""+url+'&ship229='+CPcnt+"\">"+CPcnt+"</a> " +'</p>'
                );
                $('div > center', v).append(pillage);
            }
        }
    });
};