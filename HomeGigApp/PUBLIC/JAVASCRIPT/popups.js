$(document).ready(function() {

    // LOGOUT POPUP
    $('.logout-card').on('click', function(e) {
        e.preventDefault(); 
        $('#logoutModal').css('display', 'flex').hide().fadeIn(300);
    });

    $('#closeModal').on('click', function() {
        $('#logoutModal').fadeOut(300);
    });

    // FORM SUCCESS POPUP
    $('#gigForm').on('submit', function(e) {
        e.preventDefault(); 
        $('#postSuccessModal').css('display', 'flex').hide().fadeIn(300);
        $(document).one('click', function() {
            e.target.submit();
        });
    });

    // GLOBAL CLICK TO CLOSE POPUPS
    $(window).on('click', function(event) {
        if ($(event.target).is('.modal-overlay')) {
            $('.modal-overlay').fadeOut(300);
        }
    });

    // OPEN GIG DETAILS (CUSTOMER SIDE)
    $('.customer-mode .gig-detail-tile').on('click', function() {
        const d = $(this).data();
        
        // Passing ID to the remove and edit buttons
        $('.remove-btn').attr('data-id', d.id);
        $('.edit-btn').attr('data-id', d.id);

        $('#cust-display-title').text(d.title.toUpperCase());
        $('#cust-display-category').text(d.category);
        $('#cust-display-description').text(d.description || "No description provided.");
        $('#cust-display-budget').text('$' + d.budget);
        $('#cust-display-date').text(d.date || "On The Spot");
        $('#cust-display-address').text(d.address);

        const imgArea = $('#cust-display-images');
        imgArea.empty();
        if (d.images) {
            const imgList = d.images.split(',');
            imgList.forEach(src => {
                imgArea.append(`<img src="${src}" class="preview-thumbnail">`);
            });
        } else {
            imgArea.append('<p class="no-data">No images provided</p>');
        }

        $('#gigDetailsModalCustomer').css('display', 'flex').hide().fadeIn(300);
    });

    // EDIT GIG ACTION
    $(document).on('click', '.edit-btn', function() {
        const gigId = $(this).attr('data-id');
        if (gigId) {
            window.location.href = `/edit-gig/${gigId}`;
        }
    });

    // OPEN GIG DETAILS (WORKER SIDE)
    $('.worker-mode .gig-detail-tile').on('click', function() {
        const d = $(this).data();
        const gigId = d.id; 

        $('#work-display-title').text(d.title.toUpperCase());
        $('#work-display-category').text(d.category);
        $('#work-display-description').text(d.description || "No description provided.");
        $('#work-display-budget').text('$' + d.budget);
        $('#work-display-date').text(d.date || "On The Spot");
        $('#work-display-address').text(d.address);

        // Passing ID to the Accept and Bargain buttons
        $('.accept-btn').attr('data-id', gigId);
        $('.bargain-btn').attr('data-id', gigId);

        const imgArea = $('#work-display-images');
        imgArea.empty();
        if (d.images) {
            const imgList = d.images.split(',');
            imgList.forEach(src => {
                imgArea.append(`<img src="${src}" class="preview-thumbnail">`);
            });
        } else {
            imgArea.append('<p class="no-data">No images provided</p>');
        }

        $('#gigDetailsModalWorker').css('display', 'flex').hide().fadeIn(300);
    });

    // ACCEPT GIG ACTION
    $(document).on('click', '.accept-btn', function() {
        const gigId = $(this).attr('data-id');
        if (gigId) {
            const form = $('<form>', {
                action: `/accept-gig/${gigId}`,
                method: 'POST'
            });
            $('body').append(form);
            form.submit();
        }
    });

    // BARGAIN GIG ACTION
    $(document).on('click', '.bargain-btn', function() {
        const gigId = $(this).attr('data-id');
        if (gigId) {
            const form = $('<form>', {
                action: `/bargain-gig/${gigId}`,
                method: 'POST'
            });
            $('body').append(form);
            form.submit();
        }
    });

    // REMOVE GIG ACTION
    $(document).on('click', '#gigDetailsModalCustomer .remove-btn', function() {
        $('#removeConfirmModal').css('display', 'flex').hide().fadeIn(300);
    });

    $('#confirmRemoveNo').on('click', function() {
        $('#removeConfirmModal').fadeOut(300);
    });

    // Submitting the deletion request
    $('#confirmRemoveYes').on('click', function() {
        const gigId = $('#gigDetailsModalCustomer .remove-btn').attr('data-id');
        if (gigId) {
            const form = $('<form>', {
                action: `/remove-gig/${gigId}`,
                method: 'POST'
            });
            $('body').append(form);
            form.submit();
        }
    });

});