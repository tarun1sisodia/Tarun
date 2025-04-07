// Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated and update UI
    updateAuthUI();
    
    // If authenticated, fetch fresh user data
    if (authService.isAuthenticated()) {
        authService.fetchCurrentUser()
            .then(user => {
                if (user) {
                    updateAuthUI();
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
