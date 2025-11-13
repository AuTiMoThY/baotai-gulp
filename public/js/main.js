$('.hamburger').click(function (e) { 
    e.preventDefault();
    $(this).toggleClass('is-active');
    $('.header-box .link-box').toggleClass('active');
});