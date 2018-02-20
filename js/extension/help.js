$(document).ready(function() {
    $('.trn').each(function (k, v) {
        var translated = translate(v.innerText.trim());
        $(this).html(translated);
    });
});