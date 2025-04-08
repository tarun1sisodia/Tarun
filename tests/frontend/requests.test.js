// Frontend Tests for Requests Page
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Mock fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Load HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../../frontend/requests.html'), 'utf8');

describe('Requests Page', () => {
    let dom;
    let window;
    let document;

    beforeEach(() => {
        // Set up a fresh DOM for each test
        dom = new JSDOM(html, {
            url: 'http://localhost:8081/requests.html',
            runScripts: 'dangerously',
            resources: 'usable',
            pretendToBeVisual: true
        });

        window = dom.window;
        document = window.document;

        // Mock API responses
        global.fetch.mockImplementation((url) => {
            if (url.includes('/api/requests')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        requests: [
                            {
                                _id: '1',
                                patient: { name: 'John Doe', bloodType: 'A+', age: 45 },
                                hospital: { name: 'City Hospital', city: 'New Delhi', state: 'Delhi' },
                                unitsNeeded: 2,
                                urgency: 'high',
                                status: 'pending',
                                description: 'Urgent need for surgery',
                                createdAt: new Date().toISOString(),
                                requester: { _id: 'user1', name: 'Requester Name' }
                            }
                        ]
                    })
                });
            }

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({})
            });
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should load requests when page loads', async () => {
        // Trigger DOMContentLoaded event
        const event = new window.Event('DOMContentLoaded');
        window.document.dispatchEvent(event);

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if fetch was called
        expect(global.fetch).toHaveBeenCalled();

        // Check if requests are displayed
        const requestsContainer = document.getElementById('requests-container');
        expect(requestsContainer.innerHTML).toContain('A+ Blood Needed');
        expect(requestsContainer.innerHTML).toContain('City Hospital');
    });

    test('should show create request modal when button is clicked', async () => {
        // Mock authenticated user
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'token') return 'fake-token';
            if (key === 'user') return JSON.stringify({ id: 'user1', name: 'Test User' });
            return null;
        });

        // Trigger DOMContentLoaded event
        const event = new window.Event('DOMContentLoaded');
        window.document.dispatchEvent(event);

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));

        // Click create request button
        const createRequestBtn = document.getElementById('create-request-btn');
        createRequestBtn.click();

        // Check if modal is displayed
        const modal = document.getElementById('create-request-modal');
        expect(modal.classList.contains('hidden')).toBe(false);
    });

    test('should apply filters when filter button is clicked', async () => {
        // Trigger DOMContentLoaded event
        const event = new window.Event('DOMContentLoaded');
        window.document.dispatchEvent(event);

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));

        // Set filter values
        document.getElementById('blood-type-filter').value = 'A+';
        document.getElementById('urgency-filter').value = 'high';

        // Click apply filters button
        const applyFiltersBtn = document.getElementById('apply-filters');
        applyFiltersBtn.click();

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if fetch was called with correct parameters
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('bloodType=A+'),
            expect.any(Object)
        );
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('urgency=high'),
            expect.any(Object)
        );
    });

    test('should handle request creation', async () => {
        // Mock authenticated user
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'token') return 'fake-token';
            if (key === 'user') return JSON.stringify({ id: 'user1', name: 'Test User' });
            return null;
        });

        // Mock successful request creation
        global.fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    message: 'Blood request created successfully',
                    request: {
                        _id: 'new-request-id',
                        patient: { name: 'Test Patient', bloodType: 'B+' }
                    }
                })
            });
        });

        // Trigger DOMContentLoaded event
        const event = new window.Event('DOMContentLoaded');
        window.document.dispatchEvent(event);

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));

        // Open create request modal
        const createRequestBtn = document.getElementById('create-request-btn');
        createRequestBtn.click();

        // Fill form
        document.getElementById('patient-name').value = 'Test Patient';
        document.getElementById('patient-blood-type').value = 'B+';
        document.getElementById('hospital-name').value = 'Test Hospital';
        document.getElementById('hospital-city').value = 'Mumbai';
        document.getElementById('units-needed').value = '3';

        // Submit form
        const form = document.getElementById('request-form');
        form.dispatchEvent(new window.Event('submit'));

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if fetch was called with correct data
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/requests'),
            expect.objectContaining({
                method: 'POST',
                body: expect.any(String)
            })
        );

        // Check if modal was closed
        const modal = document.getElementById('create-request-modal');
        expect(modal.classList.contains('hidden')).toBe(true);
    });

    test('should load request details when view details is clicked', async () => {
        // Mock request details response
        global.fetch.mockImplementation((url) => {
            if (url.includes('/api/requests/1')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        request: {
                            _id: '1',
                            patient: { name: 'John Doe', bloodType: 'A+', age: 45 },
                            hospital: { name: 'City Hospital', city: 'New Delhi', state: 'Delhi' },
                            unitsNeeded: 2,
                            urgency: 'high',
                            status: 'pending',
                            description: 'Urgent need for surgery',
                            createdAt: new Date().toISOString(),
                            requester: { _id: 'user1', name: 'Requester Name' },
                            matchedDonors: []
                        }
                    })
                });
            }

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    requests: [
                        {
                            _id: '1',
                            patient: { name: 'John Doe', bloodType: 'A+' },
                            hospital: { name: 'City Hospital', city: 'New Delhi' },
                            unitsNeeded: 2,
                            urgency: 'high',
                            status: 'pending',
                            createdAt: new Date().toISOString()
                        }
                    ]
                })
            });
        });

        // Trigger DOMContentLoaded event
        const event = new window.Event('DOMContentLoaded');
        window.document.dispatchEvent(event);

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));

        // Find and click view details button
        const viewDetailsBtn = document.querySelector('.view-details-btn');
        viewDetailsBtn.click();

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if modal is displayed with correct details
        const detailModal = document.getElementById('request-detail-modal');
        expect(detailModal.classList.contains('hidden')).toBe(false);

        const detailsContainer = document.getElementById('request-details');
        expect(detailsContainer.innerHTML).toContain('John Doe');
        expect(detailsContainer.innerHTML).toContain('A+');
        expect(detailsContainer.innerHTML).toContain('City Hospital');
    });
});
