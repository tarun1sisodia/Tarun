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

    // Add authentication check for navigation links
    setupAuthRequiredLinks();
    
    // Check if we're on the requests page and handle authentication
    if (window.location.pathname.includes('requests.html')) {
        if (!authService.isAuthenticated()) {
            // User is not authenticated, show login prompt
            const requestsContainer = document.getElementById('requests-container');
            if (requestsContainer) {
                requestsContainer.innerHTML = `
                    <div class="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h2 class="text-2xl font-bold text-gray-700 mb-2">Authentication Required</h2>
                        <p class="text-gray-600 mb-6">You need to be logged in to view blood requests.</p>
                        <div class="flex justify-center space-x-4">
                            <a href="login.html?redirect=${encodeURIComponent(window.location.pathname)}" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Login</a>
                            <a href="register.html" class="border border-red-600 text-red-600 px-6 py-2 rounded hover:bg-red-50">Register</a>
                        </div>
                    </div>
                `;
            }
            
            // Hide other elements that shouldn't be visible to unauthenticated users
            document.querySelectorAll('.auth-required').forEach(el => el.classList.add('hidden'));
            
            // Hide filters section
            const filtersSection = document.querySelector('.py-8.bg-white.shadow-sm');
            if (filtersSection) {
                filtersSection.classList.add('hidden');
            }
        }
    }
});

// Add this function to check authentication for navigation links
function setupAuthRequiredLinks() {
    // Get all auth-required links in the navigation
    const authRequiredLinks = document.querySelectorAll('a.auth-required-link');
    
    // If user is not authenticated, add click event listeners to show toast and redirect
    if (!authService.isAuthenticated()) {
        authRequiredLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const toast = new Toast();
                toast.info('Please login to access this feature');
                setTimeout(() => {
                    window.location.href = 'login.html?redirect=' + encodeURIComponent(link.getAttribute('href'));
                }, 1500);
            });
        });
    }
    
    // Specifically handle the "View All Requests" button if it exists
    const viewAllBtn = document.querySelector('a[href="requests.html"]');
    if (!authService.isAuthenticated() && viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const toast = new Toast();
            toast.info('Please login to view all blood requests');
            setTimeout(() => {
                window.location.href = 'login.html?redirect=' + encodeURIComponent('requests.html');
            }, 1500);
        });
    }
}
