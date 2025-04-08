// Authentication Service

class AuthService extends API {
    constructor(baseURL) {
        super(baseURL);
    }

    // Register a new user
    async register(userData) {
        try {
            const response = await this.post('/api/auth/register', userData);
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }
            
            return response;
        } catch (error) {
            console.error('Error during registration:', error);
            throw new Error('Registration failed. Please try again later.');
        }
    }

    // Login user
    async login(credentials) {
        try {
            const response = await this.post('/api/auth/login', credentials);
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }
            
            return response;
        } catch (error) {
            console.error('Error during login:', error);
            throw new Error('Login failed. Please check your credentials and try again.');
        }
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
        try {
            return await this.post('/api/auth/forgot-password', { email });
        } catch (error) {
            console.error('Error during password reset request:', error);
            throw new Error('Failed to send password reset email. Please try again later.');
        }
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
            throw new Error('Failed to fetch current user. Please try again later.');
        }
    }
}

// Initialize auth service
const authService = new AuthService(API_URL);
