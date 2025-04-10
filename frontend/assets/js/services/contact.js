// Contact Service for handling contact form operations

class ContactService extends API {
    constructor(baseURL) {
        super(baseURL);
    }

    // Submit contact form
    async submitContactForm(formData) {
        try {
            // Check if user is authenticated
            if (!this.getToken()) {
                throw new Error('Authentication required to submit contact form');
            }

            // Validate form data
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                throw new Error('All fields are required');
            }

            // Send request to API
            const response = await this.post('/api/contact', formData);
            return response;
        } catch (error) {
            console.error('Error submitting contact form:', error);
            throw error;
        }
    }

    // Get contact form submissions (for admin users)
    async getContactSubmissions() {
        try {
            // Check if user is authenticated
            if (!this.getToken()) {
                throw new Error('Authentication required');
            }

            // Send request to API
            const response = await this.get('/api/contact');
            return response;
        } catch (error) {
            console.error('Error fetching contact submissions:', error);
            throw error;
        }
    }
}

// Initialize contact service
const contactService = new ContactService(API_URL);
