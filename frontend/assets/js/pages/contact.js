import { api } from '../services/api.js';
import { toast } from '../utils/toast.js';

class ContactPage {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        try {
            const response = await api.post('/contact', {
                name,
                email,
                subject,
                message
            });

            toast.success('Message sent successfully!');
            this.contactForm.reset();
        } catch (error) {
            console.error('Error sending contact form:', error);
            toast.error(error.message || 'Failed to send message. Please try again later.');
        }
    }
}

// Initialize the contact page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});

export default ContactPage;
