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
        //CARGO FLEET PRESELECTION
        var pt = getUrlParameter('ship202');
        var gt = getUrlParameter('ship203');
        var cp = getUrlParameter('ship229');

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
    }
};

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
                var PTcnt = Math.round(total/(factor*PTcapacity));
                var GTcnt = Math.round(total/(factor*GTcapacity));
                var CPcnt = Math.round(total/(factor*CPcapacity));
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