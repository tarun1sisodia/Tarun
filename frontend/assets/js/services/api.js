// API Service for making HTTP requests

// Base API class with common methods
class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Headers with authorization
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic GET request
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw error;
    }
  }

  // Generic POST request
  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  }

  // Generic PUT request
  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      return await response.json();
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      throw error;
    }
  }

  // Generic DELETE request
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      return await response.json();
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  }
}

// Users API
class UsersAPI extends API {
  constructor(baseURL) {
    super(baseURL);
  }

  // Get current user profile
  async getProfile() {
    return this.get('/api/users/profile');
  }

  // Update user profile
  async updateProfile(data) {
    return this.put('/api/users/profile', data);
  }

  // Get all donors
  async getDonors(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.bloodType) {
      queryParams.append('bloodType', filters.bloodType);
    }

    if (filters.location) {
      queryParams.append('location', filters.location);
    }

    return this.get(`/api/users/donors?${queryParams.toString()}`);
  }

  // Get user by ID
  async getUserById(id) {
    return this.get(`/api/users/${id}`);
  }
}

// Requests API
class RequestsAPI extends API {
  constructor(baseURL) {
    super(baseURL);
  }

  // Create a new blood request
  async createRequest(data) {
    return this.post('/api/requests', data);
  }

  // Get all blood requests
  async getAllRequests(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.bloodType) {
      queryParams.append('bloodType', filters.bloodType);
    }

    if (filters.status) {
      queryParams.append('status', filters.status);
    }

    if (filters.urgency) {
      queryParams.append('urgency', filters.urgency);
    }

    if (filters.location) {
      queryParams.append('location', filters.location);
    }

    if (filters.limit) {
      queryParams.append('limit', filters.limit);
    }

    return this.get(`/api/requests?${queryParams.toString()}`);
  }

  // Get request by ID
  async getRequestById(id) {
    return this.get(`/api/requests/${id}`);
  }

  // Get requests by current user
  async getMyRequests() {
    return this.get('/api/requests/user/me');
  }

  // Update request
  async updateRequest(id, data) {
    return this.put(`/api/requests/${id}`, data);
  }

  // Delete request
  async deleteRequest(id) {
    return this.delete(`/api/requests/${id}`);
  }
}

// Donations API
class DonationsAPI extends API {
  constructor(baseURL) {
    super(baseURL);
  }

  // Record a new donation
  async createDonation(data) {
    return this.post('/api/donations', data);
  }

  // Get donations by current user
  async getMyDonations() {
    return this.get('/api/donations/me');
  }

  // Get donation by ID
  async getDonationById(id) {
    return this.get(`/api/donations/${id}`);
  }
}

// Match API
class MatchAPI extends API {
  constructor(baseURL) {
    super(baseURL);
  }

  // Find matching donors for a request
  async findMatchingDonors(requestId) {
    return this.post(`/api/match/${requestId}`);
  }

  // Volunteer as a donor for a request
  async volunteerForRequest(requestId) {
    return this.post(`/api/match/volunteer/${requestId}`);
  }
}

// Initialize API services
const usersAPI = new UsersAPI(API_URL);
const requestsAPI = new RequestsAPI(API_URL);
const donationsAPI = new DonationsAPI(API_URL);
const matchAPI = new MatchAPI(API_URL);
