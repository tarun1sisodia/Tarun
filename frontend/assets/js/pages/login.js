import { toast } from '../utils/toast.js';
import { authService } from '../services/auth.js';

class LoginPage {
  constructor() {
    this.loginForm = document.getElementById('login-form');
    this.init();
  }

  init() {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      window.location.href = 'index.html';
      return;
    }

    // Add event listener for form submission
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
    }

    // Check for redirect parameter
    this.checkRedirectParam();
  }

  checkRedirectParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect) {
      // Store the redirect URL in session storage
      sessionStorage.setItem('redirectAfterLogin', redirect);
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await authService.login({ email, password });
      toast.success('Login successful!');
      
      // Check if there's a redirect URL
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || 'index.html';
      sessionStorage.removeItem('redirectAfterLogin');
      
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LoginPage();
});

export default LoginPage;
