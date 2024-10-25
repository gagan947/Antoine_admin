$(document).ready(function(){
    $('.ct_menu_bar').click(function(){
        $('main').addClass('ct_show')
    })
    $('.ct_close_sidebar').click(function(){
        $('main').removeClass('ct_show')
    })
})

$(window).on('load', function() {

    $(".ct_loader_main").fadeOut();
    })