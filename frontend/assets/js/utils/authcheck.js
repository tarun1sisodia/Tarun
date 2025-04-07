// Authentication Check Utility

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }
  
  // Get current user from localStorage
  function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // Get authentication token
  function getToken() {
    return localStorage.getItem('token');
  }
  
  // Update UI based on authentication state
  function updateAuthUI() {
    const isLoggedIn = isAuthenticated();
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userNameElement = document.getElementById('user-name');
    
    if (isLoggedIn) {
      // Hide auth buttons, show user menu
      if (authButtons) authButtons.classList.add('hidden');
      if (userMenu) {
        userMenu.classList.remove('hidden');
        
        // Update user name
        const user = getCurrentUser();
        if (userNameElement && user) {
          userNameElement.textContent = user.name || 'User';
        }
      }
      
      // Show elements that should only be visible to logged-in users
      document.querySelectorAll('.auth-required').forEach(el => {
        el.classList.remove('hidden');
      });
      
      // Hide elements that should only be visible to logged-out users
      document.querySelectorAll('.guest-only').forEach(el => {
        el.classList.add('hidden');
      });
    } else {
      // Show auth buttons, hide user menu
      if (authButtons) authButtons.classList.remove('hidden');
      if (userMenu) userMenu.classList.add('hidden');
      
      // Hide elements that should only be visible to logged-in users
      document.querySelectorAll('.auth-required').forEach(el => {
        el.classList.add('hidden');
      });
      
      // Show elements that should only be visible to logged-out users
      document.querySelectorAll('.guest-only').forEach(el => {
        el.classList.remove('hidden');
      });
    }
  }
  
  // Require authentication for protected pages
  function requireAuth() {
    if (!isAuthenticated()) {
      // Redirect to login page with return URL
      const currentPath = window.location.pathname;
      window.location.href = `/login.html?redirect=${encodeURIComponent(currentPath)}`;
      return false;
    }
    return true;
  }
  
  // Logout user
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  }
  
  // Setup logout button
  function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
      });
    }
  }
  
  // Setup user dropdown
  function setupUserDropdown() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuButton && userDropdown) {
      userMenuButton.addEventListener('click', function() {
        userDropdown.classList.toggle('hidden');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
          userDropdown.classList.add('hidden');
        }
      });
    }
  }
  
  // Check for redirect after login
  function handleLoginRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    
    if (redirectUrl) {
      // Store the redirect URL in localStorage
      localStorage.setItem('loginRedirect', redirectUrl);
    }
  }
  
  // Redirect after successful login
  function redirectAfterLogin() {
    const redirectUrl = localStorage.getItem('loginRedirect');
    
    if (redirectUrl) {
      localStorage.removeItem('loginRedirect');
      window.location.href = redirectUrl;
    } else {
      window.location.href = '/index.html';
    }
  }
  
  // Initialize auth-related UI
  document.addEventListener('DOMContentLoaded', function() {
    // Update UI based on auth state
    updateAuthUI();
    
    // Setup logout button
    setupLogoutButton();
    
    // Setup user dropdown
    setupUserDropdown();
    
    // Handle login redirect if on login page
    if (window.location.pathname.includes('login.html')) {
      handleLoginRedirect();
    }
  });
  