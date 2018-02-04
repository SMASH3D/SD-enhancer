var messageCompanion = function() {
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

var raidHint = function() {
    //####### CONFIG START ##########
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