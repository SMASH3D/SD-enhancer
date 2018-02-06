
var battleSimCompanion = function() {

    var fleetUrl = 'game.php?page=fleet';
    var fleetCompo = [];

    $.each(ships, function(k, v) {
        var numericId = k.match('ship([0-9]{3})')[1];
        var qtyInput = $('input[name="battleinput[0][0]['+numericId+']"]');
        var posSelect = $('select[name="shipos[0][0]['+numericId+']"]');
        var qty = qtyInput[0].value;
        var pos = posSelect.find(":selected").text();
        var shipCompo = {
            id: k,
            qty: qty,
            line: pos
        };
        fleetCompo.push(shipCompo);
    });

    $.each(fleetCompo, function(k,v) {
        fleetUrl += '&' + v.id+'=' + v.qty + '&' + v.id + 'pos=' + v.pos;
    });

    var attackBtn = $('<tr><td class="left"><input type="button" id="attack-btn" style="width:100%;" value="Attaquer"></td></tr>');
    $('#submit').parent().append(attackBtn);

    $('#submit').parent().on("click", attackBtn, function() {
        window.open(fleetUrl, '_blank');
    });
}

