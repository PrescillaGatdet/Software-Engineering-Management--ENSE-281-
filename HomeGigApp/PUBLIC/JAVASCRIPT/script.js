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

// -------------------------------
// Chat Button
// -------------------------------
function openChat() {
  window.location.href = "chat-support.html";
}

// -------------------------------
// Bottom Navigation
// -------------------------------
function goHome() {
  window.location.href = "/";
}

function createPost() {
  window.location.href = "create-post.html";
}

function goAccount() {
  window.location.href = "account.html";
}

// -------------------------------
// Highlight Active Bottom Nav Button
// -------------------------------
document.addEventListener("DOMContentLoaded", function() {
  const bottomLinks = document.querySelectorAll(".bottom-nav a");
  const currentPage = window.location.pathname.split("/").pop();

  bottomLinks.forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      // Add an "active" class to highlight current page
      link.classList.add("active-nav");
    }
  });
});