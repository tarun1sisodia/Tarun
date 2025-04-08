import { api } from '../services/api.js';
import { toast } from '../utils/toast.js';
import { authService } from '../services/auth.js';

class IndexPage {
  constructor() {
    this.becomeDonorBtn = document.getElementById('become-donor-btn');
    this.emergencyRequestsContainer = document.getElementById('emergency-requests');
    this.viewAllRequestsBtn = document.querySelector('a[href="requests.html"]');
    
    this.init();
  }

  init() {
    this.updateDonorButton();
    this.fetchStatistics();
    this.fetchEmergencyRequests();
    this.setupEventListeners();
    this.initCounters();
  }

  updateDonorButton() {
    // Check if user is logged in
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      // Update button to go to profile if user is logged in
      if (this.becomeDonorBtn) {
        this.becomeDonorBtn.href = 'profile.html';
        this.becomeDonorBtn.textContent = 'My Profile';
      }
    }
  }

  setupEventListeners() {
    // Add event listener for "View All Requests" button
    if (this.viewAllRequestsBtn && !authService.isAuthenticated()) {
      this.viewAllRequestsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toast.info('Please login to view all blood requests');
        setTimeout(() => {
          window.location.href = 'login.html?redirect=' + encodeURIComponent('requests.html');
        }, 1500);
      });
    }
  }

  async fetchStatistics() {
    try {
      const data = await api.get('/api/stats');
      // Update counters with real data
      this.animateCounter('donor-count', data.donorCount || 250);
      this.animateCounter('donation-count', data.donationCount || 500);
      this.animateCounter('lives-saved', data.livesSaved || 1500);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use default values if API fails
      this.animateCounter('donor-count', 250);
      this.animateCounter('donation-count', 500);
      this.animateCounter('lives-saved', 1500);
    }
  }

  async fetchEmergencyRequests() {
    try {
      const data = await api.get('/api/requests?urgency=high&limit=3');
      
      if (data.requests && data.requests.length > 0) {
        if (this.emergencyRequestsContainer) {
          this.emergencyRequestsContainer.innerHTML = ''; // Clear placeholder
          
          data.requests.forEach(request => {
            const timeAgo = this.getTimeAgo(new Date(request.createdAt));
            const urgencyClass = request.urgency === 'critical' ? 'red' : 'orange';
            
            this.emergencyRequestsContainer.innerHTML += `
              <div class="p-6 bg-white rounded-lg shadow-sm border-l-4 border-${urgencyClass}-600">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="inline-block px-2 py-1 bg-${urgencyClass}-100 text-${urgencyClass}-800 rounded text-sm font-semibold mb-2">${request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}</span>
                    <h3 class="font-bold text-lg mb-1">${request.patient?.bloodType || 'Unknown'} Blood Needed</h3>
                    <p class="text-gray-600 mb-2">${request.hospital?.name || 'Unknown'}, ${request.hospital?.city || 'Unknown'}</p>
                  </div>
                  <span class="text-sm text-gray-500">${timeAgo}</span>
                </div>
                <p class="mb-4">${request.description || `Patient needs ${request.unitsNeeded} units.`}</p>
                <a href="requests.html?id=${request._id}" class="text-red-600 font-semibold hover:text-red-700">View Details →</a>
              </div>
            `;
          });
        }
      }
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
      if (this.emergencyRequestsContainer) {
        this.emergencyRequestsContainer.innerHTML = `
          <div class="col-span-1 md:col-span-2 lg:col-span-3 p-6 bg-white rounded-lg text-center">
            <p class="text-gray-600">Unable to load emergency requests. Please try again later.</p>
          </div>
        `;
      }
    }
  }

  initCounters() {
    // Initialize counter elements if they exist
    const counterElements = document.querySelectorAll('.counter');
    if (counterElements.length === 0) {
      return;
    }
  }

  // Counter animation function
  animateCounter(id, target) {
    const counter = document.getElementById(id);
    if (!counter) return;
    
    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      counter.textContent = Math.floor(current);

      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      }
    }, stepTime);
  }

  // Time ago helper function
  getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
  }
}

// Initialize the index page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new IndexPage();
});

export default IndexPage;
