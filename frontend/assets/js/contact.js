/**
 * Contact Form Handler
 * Manages the contact form functionality
 */

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.authRequired = document.getElementById('auth-required');
        this.formContainer = document.getElementById('contact-form-container');
        this.submitButton = document.getElementById('submit-button');
        this.toast = new Toast();

        this.init();
    }

    init() {
        // Check authentication status
        this.checkAuth();

        // Set up form submission handler
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    checkAuth() {
        if (authService.isAuthenticated()) {
            // User is logged in, show contact form
            if (this.authRequired) this.authRequired.classList.add('hidden');
            if (this.formContainer) this.formContainer.classList.remove('hidden');

            // Pre-fill form with user data if available
            this.prefillFormWithUserData();
        } else {
            // User is not logged in, show auth required message
            if (this.authRequired) this.authRequired.classList.remove('hidden');
            if (this.formContainer) this.formContainer.classList.add('hidden');
        }
    }

    prefillFormWithUserData() {
        const user = authService.getCurrentUser();
        if (user) {
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');

            if (nameField && user.name) nameField.value = user.name;
            if (emailField && user.email) emailField.value = user.email;
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        // Check authentication again
        if (!authService.isAuthenticated()) {
            this.toast.error('Please log in to send a message');
            return;
        }

        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Validate form data
        if (!name || !email || !subject || !message) {
            this.toast.error('All fields are required');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Submit form data
            await contactService.submitContactForm({
                name,
                email,
                subject,
                message
            });

            // Show success message
            this.toast.success('Message sent successfully! We will get back to you soon.');

            // Reset form
            this.form.reset();

            // Pre-fill form with user data again
            this.prefillFormWithUserData();
        } catch (error) {
            // Show error message
            this.toast.error(error.message || 'Failed to send message. Please try again later.');
            console.error('Contact form submission error:', error);
        } finally {
            // Reset loading state
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        if (!this.submitButton) return;

        if (isLoading) {
            this.submitButton.disabled = true;
            this.originalButtonText = this.submitButton.textContent;
            this.submitButton.innerHTML = '<span class="spinner mr-2"></span> Sending...';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = this.originalButtonText || 'Send Message';
        }
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});
