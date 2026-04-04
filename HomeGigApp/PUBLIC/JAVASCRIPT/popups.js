$(document).ready(function() {

    // 1. SHOW THE LOGOUT POPUP
    $('.logout-card').on('click', function(e) {
        e.preventDefault(); 
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

    // GIG POSTED LOGIC
    $('#gigForm').on('submit', function(e) {
        e.preventDefault(); 
        $('#postSuccessModal').css('display', 'flex').hide().fadeIn(300);

        // Submit form when user clicks anywhere on the screen
        $(document).one('click', function() {
            e.target.submit();
        });
    });

});