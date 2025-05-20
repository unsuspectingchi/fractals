// Menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuTabs = document.querySelectorAll('.menu-tab');
    const loadingContainer = document.getElementById('loading-container');
    const loadingText = document.getElementById('loading-text');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update loading text
            const fractalType = tab.dataset.fractal;
            loadingText.textContent = `Loading ${fractalType}...`;
            loadingContainer.style.display = 'block';

            // Dispatch custom event for fractal change
            const event = new CustomEvent('fractalChange', {
                detail: { type: fractalType }
            });
            window.dispatchEvent(event);
        });
    });
}); 