// Menu interaction handling
document.addEventListener('DOMContentLoaded', () => {
    const menuTabs = document.querySelectorAll('.menu-tab');
    const loadingText = document.querySelector('#loading-container > div:first-child');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get the fractal type from data attribute
            const fractalType = tab.dataset.fractal;
            
            // Update loading text
            loadingText.textContent = `Loading ${fractalType.charAt(0).toUpperCase() + fractalType.slice(1)}...`;
            
            // Show loading container
            document.getElementById('loading-container').style.display = 'block';
            
            // Dispatch custom event for fractal change
            const event = new CustomEvent('fractalChange', {
                detail: { type: fractalType }
            });
            window.dispatchEvent(event);
        });
    });
}); 