const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../testServer'); // Use the test server
const User = require('../../backend/src/models/User');
const Request = require('../../backend/src/models/Request');

// Mock auth middleware
jest.mock('../../backend/src/middleware/auth', () => ({
    auth: (req, res, next) => {
        // Add a mock user to the request
        req.user = {
            _id: mongoose.Types.ObjectId(),
            email: 'test@example.com',
            name: 'Test User'
        };
        next();
    },
    ensureUserInMongoDB: (req, res, next) => next()
}));

describe('Request Controller', () => {
    let mongoServer;
    let testUser;

    beforeAll(async () => {
        // Create in-memory MongoDB server
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        // Connect to in-memory database
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        // Disconnect and stop MongoDB server
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    // Rest of your test code...
});


beforeEach(async () => {
    // Clear database before each test
    await User.deleteMany({});
    await Request.deleteMany({});

    // Create a test user
    testUser = await User.create({
        supabaseId: 'test-supabase-id',
        email: 'test@example.com',
        name: 'Test User',
        bloodType: 'A+'
    });

    // Mock auth middleware for all routes
    app.use('/api/requests', (req, res, next) => {
        req.user = testUser;
        next();
    });
});

describe('POST /api/requests', () => {
    test('should create a new blood request', async () => {
        const requestData = {
            patient: {
                name: 'John Doe',
                bloodType: 'B+',
                age: 45
            },
            hospital: {
                name: 'City Hospital',
                city: 'New Delhi',
                state: 'Delhi'
            },
            unitsNeeded: 2,
            urgency: 'high',
            description: 'Urgent need for surgery'
        };

        const response = await request(app)
            .post('/api/requests')
            .send(requestData)
            .expect(201);

        expect(response.body.message).toBe('Blood request created successfully');
        expect(response.body.request).toHaveProperty('_id');
        expect(response.body.request.patient.name).toBe(requestData.patient.name);
        expect(response.body.request.patient.bloodType).toBe(requestData.patient.bloodType);
        expect(response.body.request.hospital.name).toBe(requestData.hospital.name);
        expect(response.body.request.unitsNeeded).toBe(requestData.unitsNeeded);
        expect(response.body.request.urgency).toBe(requestData.urgency);
        expect(response.body.request.status).toBe('pending');

        // Check if request was created in database
        const request = await Request.findById(response.body.request._id);
        expect(request).not.toBeNull();
        expect(request.requester.toString()).toBe(testUser._id.toString());
    });

    test('should return 400 if required fields are missing', async () => {
        const requestData = {
            // Missing patient and hospital
            unitsNeeded: 2,
            urgency: 'high'
        };

        const response = await request(app)
            .post('/api/requests')
            .send(requestData)
            .expect(400);

        expect(response.body.message).toContain('Failed to create request');
    });
});

describe('GET /api/requests', () => {
    test('should get all blood requests', async () => {
        // Create some test requests
        await Request.create({
            requester: testUser._id,
            patient: {
                name: 'John Doe',
                bloodType: 'B+'
            },
            hospital: {
                name: 'City Hospital',
                city: 'New Delhi'
            },
            unitsNeeded: 2,
            urgency: 'high',
            status: 'pending'
        });

        await Request.create({
            requester: testUser._id,
            patient: {
                name: 'Jane Smith',
                bloodType: 'O-'
            },
            hospital: {
                name: 'General Hospital',
                city: 'Mumbai'
            },
            unitsNeeded: 1,
            urgency: 'medium',
            status: 'pending'
        });

        const response = await request(app)
            .get('/api/requests')
            .expect(200);

        expect(response.body.requests).toHaveLength(2);
        expect(response.body.requests[0]).toHaveProperty('_id');
        expect(response.body.requests[0].patient.bloodType).toBe('B+');
        expect(response.body.requests[1].patient.bloodType).toBe('O-');
    });

    test('should filter requests by blood type', async () => {
        // Create some test requests
        await Request.create({
            requester: testUser._id,
            patient: {
                name: 'John Doe',
                bloodType: 'B+'
            },
            hospital: {
                name: 'City Hospital',
                city: 'New Delhi'
            },
            unitsNeeded: 2,
            urgency: 'high',
            status: 'pending'
        });

        await Request.create({
            requester: testUser._id,
            patient: {
                name: 'Jane Smith',
                bloodType: 'O-'
            },
            hospital: {
                name: 'General Hospital',
                city: 'Mumbai'
            },
            unitsNeeded: 1,
            urgency: 'medium',
            status: 'pending'
        });

        const response = await request(app)
            .get('/api/requests?bloodType=B%2B') // URL encoded B+
            .expect(200);

        expect(response.body.requests).toHaveLength(1);
        expect(response.body.requests[0].patient.bloodType).toBe('B+');
    });
});

describe('GET /api/requests/:id', () => {
    test('should get a request by ID', async () => {
        // Create a test request
        const testRequest = await Request.create({
            requester: testUser._id,
            patient: {
                name: 'John Doe',
                bloodType: 'B+'
            },
            hospital: {
                name: 'City Hospital',
                city: 'New Delhi'
            },
            unitsNeeded: 2,
            urgency: 'high',
            status: 'pending'
        });

        const response = await request(app)
            .get(`/api/requests/${testRequest._id}`)
            .expect(200);

        expect(response.body.request).toHaveProperty('_id');
        expect(response.body.request._id).toBe(testRequest._id.toString());
        expect(response.body.request.patient.name).toBe('John Doe');
        expect(response.body.request.patient.bloodType).toBe('B+');
    });

    test('should return 404 for non-existent request', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/requests/${nonExistentId}`)
            .expect(404);

        expect(response.body.message).toBe('Request not found');
    });
});

describe('PUT /api/requests/:id', () => {
    test('should update a request', async () => {
        // Create a test request
        const testRequest = await Request.create({
            requester: testUser._id,
            patient: {
                name: 'John Doe',
                bloodType: 'B+'
            },
            hospital: {
                name: 'City Hospital',
                city: 'New Delhi'
            },
            unitsNeeded: 2,
            urgency: 'high',
            status: 'pending'
        });

        const updateData = {
            patient: {
                name: 'John Doe Updated',
                bloodType: 'B+'
            },
            unitsNeeded: 3,
            urgency: 'critical'
        };

        const response = await request(app)
            .put(`/api/requests/${testRequest._id}`)
            .send(updateData)
            .expect(200);

        expect(response.body.message).toBe('Request updated successfully');
        expect(response.body.request.patient.name).toBe('John Doe Updated');
        expect(response.body.request.unitsNeeded).toBe(3);
        expect(response.body.request.urgency).toBe('critical');

        // Check if request was updated in database
        const updatedRequest = await Request.findById(testRequest._id);
        expect(updatedRequest.patient.name).toBe('John Doe Updated');
        expect(updatedRequest.unitsNeeded).toBe(3);
        expect(updatedRequest.urgency).toBe('critical');
    });

    test('should return 403 if user is not the requester', async () => {
        // Create another user
        const anotherUser = await User.create({
            supabaseId: 'another-supabase-id',
            email: 'another@example.com',
            name: 'Another User',
            bloodType: 'O+'
        });

        // Create a test request with another user as requester
        const testRequest = await Request.create({
            requester: anotherUser._id,
            patient: {
                name: 'John Doe',
                bloodType: 'B+'
            },
            hospital: {
                name: 'City Hospital',
                city: 'New Delhi'
            },
            unitsNeeded: 2,
            urgency: 'high',
            status: 'pending'
        });

        const updateData = {
            unitsNeeded: 3
        };

        const response = await request(app)
            .put(`/api/requests/${testRequest._id}`)
            .send(updateData)
            .expect(403);

        expect(response.body.message).toBe('Not authorized to update this request');
    });
});

describe('DELETE /api/requests/:id', () => {
    test('should delete a request', async () => {
        // Create a test request
        const testRequest = await Request.create({
            requester: testUser._id,
            patient: {
                name: 'John Doe',
                bloodType: 'B+'
            },
            hospital: {
                name: 'City Hospital',
                city: 'New Delhi'
            },
            unitsNeeded: 2,
            urgency: 'high',
            status: 'pending'
        });

        const response = await request(app)
            .delete(`/api/requests/${testRequest._id}`)
            .expect(200);

        expect(response.body.message).toBe('Request deleted successfully');

        // Check if request was deleted from database
        const deletedRequest = await Request.findById(testRequest._id);
        expect(deletedRequest).toBeNull();
    });

    test('should return 403 if user is not the requester', async () => {
        // Create another user
        const anotherUser = await User.create({
            supabaseId: 'another-supabase-id',
            email: 'another@example.com',
            name: 'Another User',
            bloodType: 'O+'
        });

        // Create a test request with another user as requester
        const testRequest = await Request.create({
            requester: anotherUser._id,
            patient: {
                name: 'John Doe',
                bloodType: 'B+'
            },
            hospital: {
                name: 'City Hospital',
                city: 'New Delhi'
            },
            unitsNeeded: 2,
            urgency: 'high',
            status: 'pending'
        });

        const response = await request(app)
            .delete(`/api/requests/${testRequest._id}`)
            .expect(403);

        expect(response.body.message).toBe('Not authorized to delete this request');
    });
});
