import { toast } from '../utils/toast.js';
import { authService } from '../services/auth.js';
import { api } from '../services/api.js';

class DonorsPage {
    constructor() {
        // DOM elements
        this.donorsContainer = document.getElementById('donors-container');
        this.noDonorsMessage = document.getElementById('no-donors');
        this.loadMoreButton = document.getElementById('load-more');
        this.donorDetailModal = document.getElementById('donor-detail-modal');
        this.closeDonorModalBtn = document.getElementById('close-donor-modal');
        this.applyFiltersBtn = document.getElementById('apply-filters');
        this.contactDonorButton = document.getElementById('contact-donor-button');
        this.bloodTypeFilter = document.getElementById('blood-type-filter');
        this.locationFilter = document.getElementById('location-filter');

        // State
        this.currentPage = 1;
        this.hasMoreDonors = false;
        this.currentDonorId = null;

        this.init();
    }

    init() {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            this.showLoginPrompt();
            return;
        }

        // Initialize UI
        this.setupEventListeners();
        this.loadDonors(true);
    }

    showLoginPrompt() {
        if (this.donorsContainer) {
            this.donorsContainer.innerHTML = `
        <div class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 class="text-2xl font-bold text-gray-700 mb-2">Authentication Required</h2>
          <p class="text-gray-600 mb-6">You need to be logged in to view blood donors.</p>
          <div class="flex justify-center space-x-4">
            <a href="login.html?redirect=${encodeURIComponent(window.location.pathname)}" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Login</a>
            <a href="register.html" class="border border-red-600 text-red-600 px-6 py-2 rounded hover:bg-red-50">Register</a>
          </div>
        </div>
      `;
        }

        // Hide other elements that shouldn't be visible to unauthenticated users
        document.querySelectorAll('.auth-required').forEach(el => el.classList.add('hidden'));

        // Hide filters section
        const filtersSection = document.querySelector('.py-8.bg-white.shadow-sm');
        if (filtersSection) {
            filtersSection.classList.add('hidden');
        }

        // Hide blood type info section
        const bloodTypeInfoSection = document.querySelector('section.py-8:not(.bg-white)');
        if (bloodTypeInfoSection) {
            bloodTypeInfoSection.classList.add('hidden');
        }
    }

    setupEventListeners() {
        // Apply filters
        if (this.applyFiltersBtn) {
            this.applyFiltersBtn.addEventListener('click', () => {
                this.currentPage = 1;
                this.loadDonors(true);
            });
        }

        // Load more donors
        if (this.loadMoreButton) {
            this.loadMoreButton.addEventListener('click', () => {
                this.currentPage++;
                this.loadDonors(false);
            });
        }

        // Close donor detail modal
        if (this.closeDonorModalBtn) {
            this.closeDonorModalBtn.addEventListener('click', () => {
                this.donorDetailModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === this.donorDetailModal) {
                this.donorDetailModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });

        // Contact donor button
        if (this.contactDonorButton) {
            this.contactDonorButton.addEventListener('click', () => {
                if (!authService.isAuthenticated()) {
                    toast.warning('Please login to contact donors');
                    setTimeout(() => {
                        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
                    }, 2000);
                    return;
                }

                if (!this.currentDonorId) return;

                // In a real app, this would open a contact form or messaging system
                toast.info('Contact functionality will be implemented in a future update.');
            });
        }
    }

    async loadDonors(reset = false) {
        try {
            // Show loading state
            if (reset && this.donorsContainer) {
                this.donorsContainer.innerHTML = `
          <div class="animate-pulse">
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
              <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div class="animate-pulse">
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
              <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div class="animate-pulse">
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
              <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        `;
            }

            // Build filters
            const filters = {};
            if (this.bloodTypeFilter && this.bloodTypeFilter.value) {
                filters.bloodType = this.bloodTypeFilter.value;
            }
            if (this.locationFilter && this.locationFilter.value) {
                filters.location = this.locationFilter.value;
            }

            // Add pagination
            filters.page = this.currentPage;
            filters.limit = 9;

            // Fetch donors
            const response = await api.get(`/api/users/donors?${new URLSearchParams(filters).toString()}`);
            const donors = response.donors || [];

            // Check if there are more donors
            this.hasMoreDonors = donors.length === filters.limit;

            // Update UI
            if (reset && this.donorsContainer) {
                this.donorsContainer.innerHTML = '';
            }

            if (donors.length === 0 && this.currentPage === 1) {
                if (this.noDonorsMessage) {
                    this.noDonorsMessage.classList.remove('hidden');
                }
                if (this.loadMoreButton) {
                    this.loadMoreButton.classList.add('hidden');
                }
                return;
            } else if (this.noDonorsMessage) {
                this.noDonorsMessage.classList.add('hidden');
            }

            // Show/hide load more button
            if (this.loadMoreButton) {
                if (this.hasMoreDonors) {
                    this.loadMoreButton.classList.remove('hidden');
                } else {
                    this.loadMoreButton.classList.add('hidden');
                }
            }

            // Render donors
            this.renderDonors(donors);
        } catch (error) {
            console.error('Load donors error:', error);
            toast.error('Failed to load donors');
        }
    }

    renderDonors(donors) {
        if (!this.donorsContainer) return;

        donors.forEach(donor => {
            const donorCard = document.createElement('div');
            donorCard.className = 'bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow';

            // Get initials for avatar
            const initials = donor.name.split(' ').map(n => n[0]).join('').toUpperCase();

            // Get blood type badge color
            const bloodTypeColor = this.getBloodTypeColor(donor.bloodType);

            donorCard.innerHTML = `
        <div class="flex items-center mb-4">
          <div class="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mr-4">
            ${initials}
          </div>
          <div>
            <h3 class="font-bold text-lg">${donor.name}</h3>
            <span class="inline-block px-2 py-1 ${bloodTypeColor} rounded text-sm font-semibold">
              ${donor.bloodType}
            </span>
          </div>
        </div>
        <p class="text-gray-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          ${donor.location ? `${donor.location.city}, ${donor.location.state}` : 'Location not specified'}
        </p>
        <p class="text-gray-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Last donation: ${donor.lastDonation ? this.formatDate(donor.lastDonation) : 'No previous donations'}
        </p>
        <button class="view-donor-details text-red-600 font-semibold hover:text-red-700" data-id="${donor._id}">
          View Profile →
        </button>
      `;

            this.donorsContainer.appendChild(donorCard);

            // Add event listener to view details button
            const viewDetailsBtn = donorCard.querySelector('.view-donor-details');
            viewDetailsBtn.addEventListener('click', () => {
                this.openDonorDetails(donor._id);
            });
        });
    }

    async openDonorDetails(donorId) {
        try {
            this.currentDonorId = donorId;

            // Show loading state
            const donorDetailsElement = document.getElementById('donor-details');
            if (donorDetailsElement) {
                donorDetailsElement.innerHTML = `
          <div class="animate-pulse">
            <div class="flex items-center mb-4">
              <div class="h-16 w-16 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
          </div>
        `;
            }

            // Show modal
            if (this.donorDetailModal) {
                this.donorDetailModal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }

            // Fetch donor details
            const response = await api.get(`/api/users/${donorId}`);
            const donor = response.user;

            // Update modal title
            const detailTitle = document.getElementById('detail-title');
            if (detailTitle) {
                detailTitle.textContent = `${donor.name}'s Profile`;
            }

            // Get initials for avatar
            const initials = donor.name.split(' ').map(n => n[0]).join('').toUpperCase();

            // Get blood type badge color
            const bloodTypeColor = this.getBloodTypeColor(donor.bloodType);

            // Format date
            const joinDate = new Date(donor.createdAt);
            const formattedJoinDate = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Update donor details
            if (donorDetailsElement) {
                donorDetailsElement.innerHTML = `
          <div class="flex items-center mb-6">
            <div class="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mr-4">
              ${initials}
            </div>
            <div>
              <h3 class="font-bold text-lg">${donor.name}</h3>
              <span class="inline-block px-2 py-1 ${bloodTypeColor} rounded text-sm font-semibold">
                ${donor.bloodType}
              </span>
            </div>
          </div>
          
          <div class="space-y-3">
            <p class="text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              ${donor.location ? `${donor.location.city}, ${donor.location.state}` : 'Location not specified'}
            </p>
            
            <p class="text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last donation: ${donor.lastDonation ? this.formatDate(donor.lastDonation) : 'No previous donations'}
            </p>
            
            <p class="text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Total donations: ${donor.donationCount || 0}
            </p>
            
            <p class="text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Member since: ${formattedJoinDate}
            </p>
            
            <p class="text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Status: ${donor.isEligible ? '<span class="text-green-600">Available to donate</span>' : '<span class="text-yellow-600">Currently not eligible</span>'}
            </p>
          </div>
        `;
            }

            // Update contact button based on authentication
            if (this.contactDonorButton) {
                if (!authService.isAuthenticated()) {
                    this.contactDonorButton.textContent = 'Login to Contact Donor';
                } else {
                    this.contactDonorButton.textContent = 'Contact Donor';
                }
            }
        } catch (error) {
            console.error('Get donor details error:', error);
            toast.error('Failed to load donor details');
            if (this.donorDetailModal) {
                this.donorDetailModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        }
    }

    getBloodTypeColor(bloodType) {
        switch (bloodType) {
            case 'A+':
            case 'A-':
                return 'bg-red-100 text-red-800';
            case 'B+':
            case 'B-':
                return 'bg-blue-100 text-blue-800';
            case 'AB+':
            case 'AB-':
                return 'bg-purple-100 text-purple-800';
            case 'O+':
            case 'O-':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 30) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DonorsPage();
});

export default DonorsPage;
