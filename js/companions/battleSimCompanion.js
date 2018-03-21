
var battleSimCompanion = function(playerData) {

    var galaxy = getUrlParameter('galaxy');
    var system = getUrlParameter('system');
    var planet = getUrlParameter('planet');
    var coordinates = null;
    if (typeof(galaxy) !== 'undefined' && typeof(system) !== 'undefined' && typeof(planet) !== 'undefined') {
        coordinates = '[' + parseInt(galaxy) + ':' + parseInt(system) + ':' + parseInt(planet) + ']';
    }
    if (coordinates == null) {
        warningLED('Destination coords no set, please use raid hints before using simulate button.');
    }

    var attackBtn = $('<tr><td class="left"><input type="button" id="attack-btn" style="width:100%;" value="Attaquer '+coordinates+'"></td></tr>');
    $('#submit').parent().append(attackBtn);

    $('#attack-btn').click(function(){
        var fleetUrl = 'game.php?page=fleet';
        var fleetCompo = [];

        $.each(ships, function(k, v) {
            var numericId = k.match('ship([0-9]{3})')[1];
            var qtyInput = $('input[name="battleinput[0][0]['+numericId+']"]');
            var posSelect = $('select[name="shipos[0][0]['+numericId+']"]');
            var qty = parseInt(qtyInput[0].value);
            var pos = parseInt(posSelect.find(":selected").text());
            var shipCompo = {
                id: k,
                qty: qty,
                pos: pos
            };
            fleetCompo.push(shipCompo);
        });

        $.each(fleetCompo, function(k,v) {
            fleetUrl += '&' + v.id+'=' + v.qty + '&' + v.id + 'pos=' + v.pos;
        });
        if (coordinates !== null) {
            fleetUrl += '&galaxy=' + galaxy + '&system=' + system + '&planet=' + planet;
            fleetUrl += '&mission=1';
        }
        window.open(fleetUrl, '_blank');
    });
}

