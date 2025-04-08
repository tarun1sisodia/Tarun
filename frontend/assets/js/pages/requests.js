import { toast } from '../utils/toast.js';
import { authService } from '../services/auth.js';
import { api } from '../services/api.js';

class RequestsPage {
    constructor() {
        // DOM elements
        this.requestsContainer = document.getElementById('requests-container');
        this.noRequestsMessage = document.getElementById('no-requests');
        this.loadMoreButton = document.getElementById('load-more');
        this.createRequestBtn = document.getElementById('create-request-btn');
        this.createRequestModal = document.getElementById('create-request-modal');
        this.requestForm = document.getElementById('request-form');
        this.closeModalBtn = document.getElementById('close-modal');
        this.cancelRequestBtn = document.getElementById('cancel-request');
        this.requestDetailModal = document.getElementById('request-detail-modal');
        this.closeDetailModalBtn = document.getElementById('close-detail-modal');
        this.findDonorsModal = document.getElementById('find-donors-modal');
        this.closeDonorsModalBtn = document.getElementById('close-donors-modal');
        this.closeDonorsBtn = document.getElementById('close-donors-btn');
        this.applyFiltersBtn = document.getElementById('apply-filters');

        // State
        this.currentPage = 1;
        this.pageSize = 9;
        this.totalRequests = 0;
        this.currentFilters = {};
        this.selectedRequestId = null;

        this.init();
    }

    init() {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            this.showLoginPrompt();
            return;
        }

        this.setupEventListeners();
        this.loadRequests();

        // Check for request ID in URL
        const urlParams = new URLSearchParams(window.location.search);
        const requestId = urlParams.get('id');
        if (requestId) {
            this.loadRequestDetails(requestId);
        }
    }

    showLoginPrompt() {
        if (this.requestsContainer) {
            this.requestsContainer.innerHTML = `
        <div class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 class="text-2xl font-bold text-gray-700 mb-2">Authentication Required</h2>
          <p class="text-gray-600 mb-6">You need to be logged in to view blood requests.</p>
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
    }

    setupEventListeners() {
        if (this.createRequestBtn) {
            this.createRequestBtn.addEventListener('click', () => this.openCreateRequestModal());
        }

        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closeCreateRequestModal());
        }

        if (this.cancelRequestBtn) {
            this.cancelRequestBtn.addEventListener('click', () => this.closeCreateRequestModal());
        }

        if (this.closeDetailModalBtn) {
            this.closeDetailModalBtn.addEventListener('click', () => this.closeRequestDetailModal());
        }

        if (this.closeDonorsModalBtn) {
            this.closeDonorsModalBtn.addEventListener('click', () => this.closeFindDonorsModal());
        }

        if (this.closeDonorsBtn) {
            this.closeDonorsBtn.addEventListener('click', () => this.closeFindDonorsModal());
        }

        if (this.requestForm) {
            this.requestForm.addEventListener('submit', (e) => this.handleCreateRequest(e));
        }

        if (this.loadMoreButton) {
            this.loadMoreButton.addEventListener('click', () => this.loadMoreRequests());
        }

        if (this.applyFiltersBtn) {
            this.applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        }
    }

    openCreateRequestModal() {
        if (!authService.isAuthenticated()) {
            toast.error('Please login to create a blood request');
            setTimeout(() => {
                window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
            }, 2000);
            return;
        }

        this.createRequestModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    closeCreateRequestModal() {
        this.createRequestModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        this.requestForm.reset();
    }

    openRequestDetailModal() {
        this.requestDetailModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    closeRequestDetailModal() {
        this.requestDetailModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    openFindDonorsModal() {
        this.findDonorsModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    closeFindDonorsModal() {
        this.findDonorsModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    async loadRequests(page = 1, filters = {}) {
        try {
            // Show loading state
            if (page === 1) {
                this.requestsContainer.innerHTML = '';
                for (let i = 0; i < 3; i++) {
                    this.requestsContainer.innerHTML += `
            <div class="animate-pulse">
              <div class="bg-white p-6 rounded-lg shadow-sm">
                <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                <div class="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          `;
                }
            }

            // Build query parameters
            const queryParams = new URLSearchParams();

            if (filters.bloodType) {
                queryParams.append('bloodType', filters.bloodType);
            }

            if (filters.urgency) {
                queryParams.append('urgency', filters.urgency);
            }

            if (filters.status) {
                queryParams.append('status', filters.status);
            }

            if (filters.location) {
                queryParams.append('location', filters.location);
            }

            // Add pagination
            queryParams.append('page', page);
            queryParams.append('limit', this.pageSize);

            // Fetch requests from API
            const response = await api.get(`/api/requests?${queryParams.toString()}`);
            const requests = response.requests || [];

            // Clear container if it's the first page
            if (page === 1) {
                this.requestsContainer.innerHTML = '';
            }

            // Display requests or show "no requests" message
            if (requests.length === 0 && page === 1) {
                this.noRequestsMessage.classList.remove('hidden');
                this.loadMoreButton.classList.add('hidden');
            } else {
                this.noRequestsMessage.classList.add('hidden');

                // Render each request
                requests.forEach(request => {
                    const requestCard = this.createRequestCard(request);
                    this.requestsContainer.appendChild(requestCard);
                });

                // Show/hide load more button
                if (requests.length < this.pageSize) {
                    this.loadMoreButton.classList.add('hidden');
                } else {
                    this.loadMoreButton.classList.remove('hidden');
                }
            }

            // Update current page and total
            this.currentPage = page;
            this.totalRequests = requests.length + (page > 1 ? (page - 1) * this.pageSize : 0);

        } catch (error) {
            console.error('Error loading requests:', error);
            toast.error('Failed to load blood requests. Please try again.');

            // Clear loading state
            if (page === 1) {
                this.requestsContainer.innerHTML = '';
            }
        }
    }

    createRequestCard(request) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-sm overflow-hidden';

        // Get urgency class
        const urgencyClass = this.getUrgencyClass(request.urgency);
        const statusClass = this.getStatusBadgeClass(request.status);

        // Format date
        const timeAgo = this.timeElapsed(request.createdAt);

        card.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="inline-block px-2 py-1 ${urgencyClass} rounded text-xs font-semibold">
              ${request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
            </span>
            <span class="inline-block px-2 py-1 ${statusClass} rounded text-xs font-semibold ml-2">
              ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          <span class="text-sm text-gray-500">${timeAgo}</span>
        </div>
        
        <h3 class="font-bold text-lg mb-1">
          ${request.patient?.bloodType || 'Unknown'} Blood Needed
        </h3>
        
        <p class="text-gray-600 mb-3">
          ${request.hospital?.name || 'Unknown Hospital'}, 
          ${request.hospital?.city || 'Unknown Location'}
        </p>
        
        <div class="flex items-center mb-4">
          <span class="text-sm bg-red-50 text-red-600 px-2 py-1 rounded">
            ${request.unitsNeeded} units needed
          </span>
        </div>
        
        <p class="text-gray-700 mb-4 line-clamp-2">
          ${request.description || 'No additional details provided.'}
        </p>
        
        <button class="view-details-btn text-red-600 font-semibold hover:text-red-700" 
                data-request-id="${request._id}">
          View Details →
        </button>
      </div>
    `;

        // Add event listener to view details button
        const viewDetailsBtn = card.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', () => {
            this.loadRequestDetails(request._id);
        });

        return card;
    }

    async loadRequestDetails(requestId) {
        try {
            // Show loading state
            document.getElementById('request-details').innerHTML = `
        <div class="animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
        </div>
      `;

            // Clear actions
            document.getElementById('request-actions').innerHTML = '';

            // Open modal
            this.openRequestDetailModal();

            // Fetch request details
            const response = await api.get(`/api/requests/${requestId}`);
            const request = response.request;

            if (!request) {
                throw new Error('Request not found');
            }

            // Store selected request ID
            this.selectedRequestId = requestId;

            // Update modal title
            document.getElementById('detail-title').textContent =
                `${request.patient?.bloodType || 'Unknown'} Blood Request`;

            // Format dates
            const formattedCreatedDate = this.formatDate(request.createdAt);
            const timeAgo = this.timeElapsed(request.createdAt);

            // Get urgency and status classes
            const urgencyClass = this.getUrgencyClass(request.urgency);
            const statusClass = this.getStatusBadgeClass(request.status);

            // Build details HTML
            let detailsHTML = `
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="inline-block px-2 py-1 ${urgencyClass} rounded text-xs font-semibold">
            ${request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
          </span>
          <span class="inline-block px-2 py-1 ${statusClass} rounded text-xs font-semibold">
            ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
          <span class="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
            Posted ${timeAgo}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="font-semibold text-gray-700 mb-2">Patient Information</h3>
            <div class="bg-gray-50 p-4 rounded">
              <p><span class="font-medium">Name:</span> ${request.patient?.name || 'Not provided'}</p>
              <p><span class="font-medium">Blood Type:</span> ${request.patient?.bloodType || 'Unknown'}</p>
                          <p><span class="font-medium">Age:</span> ${request.patient?.age || 'Not provided'}</p>
              <p><span class="font-medium">Gender:</span> ${request.patient?.gender || 'Not provided'}</p>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-700 mb-2">Hospital Information</h3>
            <div class="bg-gray-50 p-4 rounded">
              <p><span class="font-medium">Name:</span> ${request.hospital?.name || 'Not provided'}</p>
              <p><span class="font-medium">Address:</span> ${request.hospital?.address || 'Not provided'}</p>
              <p><span class="font-medium">City:</span> ${request.hospital?.city || 'Not provided'}</p>
              <p><span class="font-medium">Contact:</span> ${request.hospital?.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="font-semibold text-gray-700 mb-2">Request Details</h3>
          <div class="bg-gray-50 p-4 rounded">
            <p><span class="font-medium">Units Needed:</span> ${request.unitsNeeded}</p>
            <p><span class="font-medium">Created On:</span> ${formattedCreatedDate}</p>
            <p><span class="font-medium">Expires On:</span> ${this.formatDate(request.expiresAt)}</p>
            <p class="mt-2"><span class="font-medium">Description:</span></p>
            <p class="mt-1">${request.description || 'No additional details provided.'}</p>
          </div>
        </div>
      `;

            // Update details container
            document.getElementById('request-details').innerHTML = detailsHTML;

            // Update actions based on request status and user role
            const actionsContainer = document.getElementById('request-actions');
            actionsContainer.innerHTML = '';

            // Add appropriate action buttons based on request status
            if (request.status === 'pending' || request.status === 'active') {
                // Add "Find Donors" button
                const findDonorsBtn = document.createElement('button');
                findDonorsBtn.className = 'bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-4';
                findDonorsBtn.textContent = 'Find Matching Donors';
                findDonorsBtn.addEventListener('click', () => this.findMatchingDonors(request));
                actionsContainer.appendChild(findDonorsBtn);

                // Add "Volunteer to Donate" button if user is not the requester
                if (request.requester !== authService.getCurrentUser()?.id) {
                    const volunteerBtn = document.createElement('button');
                    volunteerBtn.className = 'border border-red-600 text-red-600 py-2 px-4 rounded-lg font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2';
                    volunteerBtn.textContent = 'Volunteer to Donate';
                    volunteerBtn.addEventListener('click', () => this.volunteerToDonate(request._id));
                    actionsContainer.appendChild(volunteerBtn);
                }
            }

            // If user is the requester, add "Cancel Request" button
            if (request.requester === authService.getCurrentUser()?.id &&
                (request.status === 'pending' || request.status === 'active')) {
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
                cancelBtn.textContent = 'Cancel Request';
                cancelBtn.addEventListener('click', () => this.cancelRequest(request._id));
                actionsContainer.appendChild(cancelBtn);
            }

        } catch (error) {
            console.error('Error loading request details:', error);
            toast.error('Failed to load request details');
            this.closeRequestDetailModal();
        }
    }

    async findMatchingDonors(request) {
        try {
            // Show loading state
            const donorsContainer = document.getElementById('matching-donors');
            if (donorsContainer) {
                donorsContainer.innerHTML = `
          <div class="animate-pulse">
            <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
              <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
              <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        `;
            }

            // Open donors modal
            this.openFindDonorsModal();

            // Update modal title
            const modalTitle = document.getElementById('donors-modal-title');
            if (modalTitle) {
                modalTitle.textContent = `Donors for ${request.patient?.bloodType || 'Unknown'} Blood`;
            }

            // Fetch matching donors
            const response = await api.get(`/api/donors/match/${request._id}`);
            const donors = response.donors || [];

            // Update donors container
            if (donorsContainer) {
                if (donors.length === 0) {
                    donorsContainer.innerHTML = `
            <div class="text-center py-8">
              <p class="text-gray-500">No matching donors found in your area.</p>
              <p class="text-gray-500 mt-2">Try expanding your search or check back later.</p>
            </div>
          `;
                } else {
                    donorsContainer.innerHTML = '';

                    donors.forEach(donor => {
                        const donorCard = document.createElement('div');
                        donorCard.className = 'bg-white p-4 rounded-lg shadow-sm mb-4 flex items-center';

                        // Get initials for avatar
                        const initials = donor.name.split(' ').map(n => n[0]).join('').toUpperCase();

                        donorCard.innerHTML = `
              <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg font-bold mr-4">
                ${initials}
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold">${donor.name}</h4>
                <p class="text-sm text-gray-600">${donor.location?.city || ''}, ${donor.location?.state || ''}</p>
                <p class="text-sm text-gray-600">Last donation: ${donor.lastDonation ? this.formatDate(donor.lastDonation) : 'No previous donations'}</p>
              </div>
              <button class="contact-donor-btn text-red-600 hover:text-red-700 font-medium" data-id="${donor._id}">
                Contact
              </button>
            `;

                        donorsContainer.appendChild(donorCard);

                        // Add event listener to contact button
                        const contactBtn = donorCard.querySelector('.contact-donor-btn');
                        contactBtn.addEventListener('click', () => this.contactDonor(donor._id));
                    });
                }
            }
        } catch (error) {
            console.error('Error finding matching donors:', error);
            toast.error('Failed to find matching donors');
            this.closeFindDonorsModal();
        }
    }

    async handleCreateRequest(e) {
        e.preventDefault();

        try {
            // Get form data
            const formData = new FormData(this.requestForm);
            const requestData = {
                patient: {
                    name: formData.get('patientName'),
                    age: formData.get('patientAge'),
                    gender: formData.get('patientGender'),
                    bloodType: formData.get('bloodType')
                },
                hospital: {
                    name: formData.get('hospitalName'),
                    address: formData.get('hospitalAddress'),
                    city: formData.get('hospitalCity'),
                    state: formData.get('hospitalState'),
                    phone: formData.get('hospitalPhone')
                },
                unitsNeeded: formData.get('unitsNeeded'),
                urgency: formData.get('urgency'),
                description: formData.get('description')
            };

            // Show loading state
            const submitButton = this.requestForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Creating Request...';
            submitButton.disabled = true;

            // Send request to API
            const response = await api.post('/api/requests', requestData);

            // Reset form and close modal
            this.requestForm.reset();
            this.closeCreateRequestModal();

            // Show success message
            toast.success('Blood request created successfully');

            // Reload requests
            this.loadRequests(1, this.currentFilters);

        } catch (error) {
            console.error('Create request error:', error);
            toast.error(error.message || 'Failed to create request. Please try again.');

            // Reset button state
            const submitButton = this.requestForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Create Request';
            submitButton.disabled = false;
        }
    }

    async volunteerToDonate(requestId) {
        try {
            await api.post(`/api/donations/volunteer/${requestId}`);
            toast.success('Thank you for volunteering to donate!');
            this.closeRequestDetailModal();
            this.loadRequests(1, this.currentFilters);
        } catch (error) {
            console.error('Volunteer error:', error);
            toast.error(error.message || 'Failed to volunteer. Please try again.');
        }
    }

    async cancelRequest(requestId) {
        if (!confirm('Are you sure you want to cancel this request?')) {
            return;
        }

        try {
            await api.put(`/api/requests/${requestId}/cancel`);
            toast.success('Request cancelled successfully');
            this.closeRequestDetailModal();
            this.loadRequests(1, this.currentFilters);
        } catch (error) {
            console.error('Cancel request error:', error);
            toast.error(error.message || 'Failed to cancel request. Please try again.');
        }
    }

    contactDonor(donorId) {
        // In a real app, this would open a contact form or messaging system
        toast.info('Contact functionality will be implemented in a future update.');
    }

    loadMoreRequests() {
        this.loadRequests(this.currentPage + 1, this.currentFilters);
    }

    applyFilters() {
        const bloodTypeFilter = document.getElementById('blood-type-filter');
        const urgencyFilter = document.getElementById('urgency-filter');
        const statusFilter = document.getElementById('status-filter');
        const locationFilter = document.getElementById('location-filter');

        const filters = {};

        if (bloodTypeFilter && bloodTypeFilter.value) {
            filters.bloodType = bloodTypeFilter.value;
        }

        if (urgencyFilter && urgencyFilter.value) {
            filters.urgency = urgencyFilter.value;
        }

        if (statusFilter && statusFilter.value) {
            filters.status = statusFilter.value;
        }

        if (locationFilter && locationFilter.value) {
            filters.location = locationFilter.value;
        }

        this.currentFilters = filters;
        this.loadRequests(1, filters);
    }

    getUrgencyClass(urgency) {
        switch (urgency) {
            case 'critical':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'fulfilled':
                return 'bg-blue-100 text-blue-800';
            case 'expired':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    timeElapsed(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffDays > 0) {
            return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
        } else if (diffHours > 0) {
            return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
        } else if (diffMinutes > 0) {
            return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
        } else {
            return 'Just now';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RequestsPage();
});

export default RequestsPage;
