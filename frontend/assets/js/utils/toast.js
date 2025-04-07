// Toast Notification Utility

class Toast {
    constructor() {
        this.container = document.getElementById('toast-container');
        
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'fixed bottom-4 right-4 z-50';
            document.body.appendChild(this.container);
        }
    }
    
    // Show a success toast
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }
    
    // Show an error toast
    error(message, duration = 4000) {
        this.show(message, 'error', duration);
    }
    
    // Show an info toast
    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
    
    // Show a warning toast
    warning(message, duration = 3000) {
        this.show(message, 'warning', duration);
    }
    
    // Generic toast display method
    show(message, type = 'info', duration = 3000) {
        // Define colors based on type
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `${colors[type]} text-white px-4 py-3 rounded shadow-lg mb-3 flex items-center justify-between transition-all duration-300 transform translate-x-full opacity-0`;
        
        // Add icon based on type
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>';
                break;
            case 'error':
                icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>';
                break;
            case 'info':
                icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>';
                break;
            case 'warning':
                icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
                break;
        }
        
        // Set toast content
        toast.innerHTML = `
            <div class="flex items-center">
                ${icon}
                <span>${message}</span>
            </div>
            <button class="ml-4 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        
        // Add to container
        this.container.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        }, 10);
        
        // Add close button functionality
        const closeButton = toast.querySelector('button');
        closeButton.addEventListener('click', () => {
            this.removeToast(toast);
        });
        
        // Auto-remove after duration
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
    }
    
    // Remove a toast with animation
    removeToast(toast) {
        toast.classList.add('translate-x-full', 'opacity-0');
        
        // Remove from DOM after animation
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

// Initialize toast
const toast = new Toast();
