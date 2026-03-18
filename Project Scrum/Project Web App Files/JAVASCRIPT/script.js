document.addEventListener('DOMContentLoaded', () => {
    const loadingSection = document.getElementById('loading-section');
    const buttonSection = document.getElementById('button-section');

    if (loadingSection && buttonSection) {
        const hasSeenAnimation = sessionStorage.getItem('animationDone');

        if (hasSeenAnimation) {
            loadingSection.style.display = 'none';
            buttonSection.style.display = 'flex';
        } else {
            loadingSection.style.display = 'flex';
            loadingSection.style.justifyContent = 'center';
            buttonSection.style.display = 'none';

            setTimeout(() => {
                loadingSection.style.display = 'none';
                buttonSection.classList.add('fade-in');
                sessionStorage.setItem('animationDone', 'true');
            }, 4000); 
        }
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".login-btn");
    const registerBtn = document.querySelector(".register-btn");

    // LOGIN REDIRECTION
    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault(); 
            if (document.body.classList.contains("worker-page")) {
                window.location.href = "dashboard-worker.html";
            } else {
                window.location.href = "dashboard-customer.html";
            }
        });
    }

    // REGISTER REDIRECTION
    if (registerBtn) {
        registerBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (document.body.classList.contains("worker-page")) {
                window.location.href = "dashboard-worker.html";
            } else {
                window.location.href = "dashboard-customer.html";
            }
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {

    const gigDescription = document.querySelector('textarea[name="description"]');

    if (gigDescription) {
        gigDescription.addEventListener('input', function() {
            // Reset height to shrink if text is deleted
            this.style.height = 'auto';
            // Set height to match the internal content height
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
});