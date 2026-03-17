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