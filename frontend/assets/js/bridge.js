// Import from modules
import { toast } from './utils/toast.js';
import { api } from './services/api.js';
import { authService } from './services/auth.js';

// Expose as globals for backward compatibility
window.toast = toast;
window.api = api;
window.authService = authService;
