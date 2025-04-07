// Authentication Service

class AuthService extends API {
    constructor(baseURL) {
        super(baseURL);
    }

    // Register a new user
    async register(userData) {
        const response = await this.post('/api/auth/register', userData);
        
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        return response;
    }

    // Login user
    async login(credentials) {
        const response = await this.post('/api/auth/login', credentials);
        
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        return response;
    }

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }

    // Forgot password
    async forgotPassword(email) {
        return this.post('/api/auth/forgot-password', { email });
    }

    // Get current user from API
    async fetchCurrentUser() {
        if (!this.isAuthenticated()) {
            return null;
        }
        
        try {
            const response = await this.get('/api/auth/me');
            
            // Update stored user data
            localStorage.setItem('user', JSON.stringify(response.user));
            
            return response.user;
        } catch (error) {
            console.error('Error fetching current user:', error);
            // If token is invalid, logout
            if (error.message.includes('unauthorized')) {
                this.logout();
            }
            return null;
        }
    }
}

// Initialize auth service
const authService = new AuthService(API_URL);
