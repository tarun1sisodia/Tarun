class DonationCentersAPI extends API {
    constructor(baseURL) {
        super(baseURL);
    }

    // Get all donation centers with optional filters
    async getAllCenters(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (filters.city) queryParams.append('city', filters.city);
            if (filters.date) queryParams.append('date', filters.date);
            if (filters.timeSlot) queryParams.append('timeSlot', filters.timeSlot);
            
            const queryString = queryParams.toString();
            const endpoint = `/api/donation-centers${queryString ? '?' + queryString : ''}`;
            
            return await this.get(endpoint);
        } catch (error) {
            console.error('Error fetching donation centers:', error);
            throw error;
        }
    }

    // Get nearby donation centers
    async getNearbyDonationCenters(distance = 10) {
        try {
            return await this.get(`/api/donation-centers/nearby?distance=${distance}`);
        } catch (error) {
            console.error('Error fetching nearby donation centers:', error);
            throw error;
        }
    }

    // Get a single donation center by ID
    async getDonationCenterById(id) {
        try {
            return await this.get(`/api/donation-centers/${id}`);
        } catch (error) {
            console.error(`Error fetching donation center with ID ${id}:`, error);
            throw error;
        }
    }

    // Book an appointment
    async bookAppointment(appointmentData) {
        try {
            return await this.post('/api/donation-centers/appointments', appointmentData);
        } catch (error) {
            console.error('Error booking appointment:', error);
            throw error;
        }
    }

    // Get user's appointments
    async getUserAppointments() {
        try {
            return await this.get('/api/donation-centers/appointments/me');
        } catch (error) {
            console.error('Error fetching user appointments:', error);
            throw error;
        }
    }

    // Cancel an appointment
    async cancelAppointment(appointmentId) {
        try {
            return await this.put(`/api/donation-centers/appointments/${appointmentId}/cancel`);
        } catch (error) {
            console.error(`Error cancelling appointment with ID ${appointmentId}:`, error);
            throw error;
        }
    }

    // Get all cities with donation centers
    async getAllCities() {
        try {
            return await this.get('/api/donation-centers/cities');
        } catch (error) {
            console.error('Error fetching cities:', error);
            throw error;
        }
    }

    // Get available slots for a specific donation center and date
    async getAvailableSlots(centerId, date) {
        try {
            return await this.get(`/api/donation-centers/${centerId}/slots?date=${date}`);
        } catch (error) {
            console.error(`Error fetching available slots for center ${centerId}:`, error);
            throw error;
        }
    }
}

// Create an instance of the DonationCentersAPI
const donationCentersAPI = new DonationCentersAPI(API_URL);
