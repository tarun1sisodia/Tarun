import { toast } from '../utils/toast.js';
import { authService } from '../services/auth.js';

class RegisterPage {
  constructor() {
    this.registerForm = document.getElementById('register-form');
    this.init();
  }

  init() {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      window.location.href = 'index.html';
      return;
    }

    // Add event listener for form submission
    if (this.registerForm) {
      this.registerForm.addEventListener('submit', this.handleRegister.bind(this));
    }
  }

  async handleRegister(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const phone = document.getElementById('phone').value;
    const bloodType = document.getElementById('blood-type').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const isDonor = document.getElementById('is-donor').checked;

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Prepare registration data
    const userData = {
      name,
      email,
      password,
      phone,
      bloodType,
      location: {
        city,
        state,
        country: 'India'
      },
      isDonor
    };

    try {
      // Show loading state
      const submitButton = this.registerForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Creating Account...';
      submitButton.disabled = true;

      // Send registration request
      const response = await authService.register(userData);

      // Reset button state
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;

      // Show success message
      toast.success('Registration successful! Please check your email to verify your account.');

      // Redirect to login page after a delay
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');

      // Reset button state
      const submitButton = this.registerForm.querySelector('button[type="submit"]');
      submitButton.textContent = 'Create Account';
      submitButton.disabled = false;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new RegisterPage();
});

export default RegisterPage;
