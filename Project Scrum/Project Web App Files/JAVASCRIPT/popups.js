$(document).ready(function() {

    // 1. SHOW THE LOGOUT POPUP
    $('.logout-card').on('click', function(e) {
        e.preventDefault(); // Stop the browser from going to index.html immediately
        $('#logoutModal').css('display', 'flex').hide().fadeIn(300);
    });

    // 2. HIDE THE POPUP (CANCEL BUTTON)
    $('#closeModal').on('click', function() {
        $('#logoutModal').fadeOut(300);
    });

    // 3. CLOSE IF USER CLICKS OUTSIDE THE BOX
    $(window).on('click', function(event) {
        if ($(event.target).is('#logoutModal')) {
            $('#logoutModal').fadeOut(300);
        }
    });

});