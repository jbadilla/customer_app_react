import $ from 'jquery';

$(document).ready(function () {
    var header = $(".navbar.navbar-expand-lg.mai-sub-header:last");

    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 50) {
            header.addClass("scrolled");
        } else {
            header.removeClass("scrolled");
        }
    });
});

$(document).on('click', '.navbar-brand', function () {
    window.location.replace("/");
});