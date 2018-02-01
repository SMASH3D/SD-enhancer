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
};

var raidHint = function() {
    $('.raid-hint').remove();
    var PTcapacity = 12000;
    var GTcapacity = 35000;
    var CPcapacity = 100000;
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
            if (v.innerHTML === 'Rhénium') {
                rheniumFlag = true;
                azoteFlag = false
                seleFlag = false;
            } else if (v.innerHTML === 'Sélénium') {
                seleFlag = true;
                rheniumFlag = false;
                azoteFlag = false;
            } else if (v.innerHTML === 'Azote') {
                azoteFlag = true;
                rheniumFlag = false;
                seleFlag = false;
            } else {
                azoteFlag = false;
                rheniumFlag = false;
                seleFlag = false;
            }
        });
        var tooltip = $('<span>');
        var total = (rhe + sele + azote);

        var j = 0;

        var link = $('td > a.destroyElement', v)[0];
        var url  = '';
        if (typeof(link) !== 'undefined') {
            url = link.href;
        }


        for (i = 1; i < 5; i++) {
            j++;
            var factor = Math.pow(2, i);
            var PTcnt = Math.round(total/(factor*PTcapacity));
            var GTcnt = Math.round(total/(factor*GTcapacity));
            var CPcnt = Math.round(total/(factor*CPcapacity));

            var pillage = $('<span>', { 'class': 'raid-hint' });

            pillage.append(
                '<p>Pillage ' + j + ' : PT ' +
                "<a href=\""+url+'&PT='+PTcnt+"\">"+PTcnt+"</a> " + ' / GT ' +
                "<a href=\""+url+'&GT='+GTcnt+"\">"+GTcnt+"</a> " + ' / CP ' +
                "<a href=\""+url+'&CP='+CPcnt+"\">"+CPcnt+"</a> " +'</p>'
            );


            $('div > center', v).append(pillage);
        }
    });
};