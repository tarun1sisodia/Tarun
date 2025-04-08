const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../backend/src/server');
const User = require('../../backend/src/models/User');
const Request = require('../../backend/src/models/Request');
const Donation = require('../../backend/src/models/Donation');

describe('Donation Controller', () => {
    let mongoServer;
    let testUser;
    let testRequest;

    beforeAll(async () => {
        // Create in-memory MongoDB server
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        // Connect to in-memory database
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        // Disconnect and stop MongoDB server
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        // Clear database before each test
        await User.deleteMany({});
        await Request.deleteMany({});
        await Donation.deleteMany({});

        // Create a test user
        testUser = await User.create({
            supabaseId: 'test-supabase-id',
            email: 'test@example.com',
            name: 'Test User',
            bloodType: 'A+',
            lastDonation: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000) // 120 days ago
        });

        // Create a test request
        testRequest = await Request.create({
            requester: testUser._id,
            patient: {
                name: 'John Doe',
                bloodType: 'A+'
            },
            hospital: {
                name: 'City Hospital',
                city: 'New Delhi'
            },
            unitsNeeded: 2,
            urgency: 'high',
            status: 'pending'
        });

        // Mock auth middleware for all routes
        app.use('/api/donations', (req, res, next) => {
            req.user = testUser;
            next();
        });
    });

    describe('POST /api/donations', () => {
        test('should create a new donation', async () => {
            const donationData = {
                requestId: testRequest._id,
                hospital: {
                    name: 'City Hospital',
                    city: 'New Delhi'
                },
                units: 1,
                notes: 'First time donor'
            };

            const response = await request(app)
                .post('/api/donations')
                .send(donationData)
                .expect(201);

            expect(response.body.message).toBe('Donation recorded successfully');
            expect(response.body.donation).toHaveProperty('_id');
            expect(response.body.donation.donor.toString()).toBe(testUser._id.toString());
            expect(response.body.donation.request.toString()).toBe(testRequest._id.toString());
            expect(response.body.donation.units).toBe(1);

            // Check if donation was created in database
            const donation = await Donation.findById(response.body.donation._id);
            expect(donation).not.toBeNull();

            // Check if user's donation count was updated
            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser.donationCount).toBe(1);
            expect(updatedUser.lastDonation).not.toEqual(testUser.lastDonation);

            // Check if request was updated
            const updatedRequest = await Request.findById(testRequest._id);
            expect(updatedRequest.matchedDonors).toHaveLength(1);
            expect(updatedRequest.matchedDonors[0].donor.toString()).toBe(testUser._id.toString());
            expect(updatedRequest.matchedDonors[0].status).toBe('donated');
        });

        test('should return 400 if user is not eligible to donate', async () => {
            // Update user's last donation to be recent (less than 90 days ago)
            await User.findByIdAndUpdate(testUser._id, {
                lastDonation: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
            });

            const donationData = {
                requestId: testRequest._id,
                hospital: {
                    name: 'City Hospital',
                    city: 'New Delhi'
                },
                units: 1
            };

            const response = await request(app)
                .post('/api/donations')
                .send(donationData)
                .expect(400);

            expect(response.body.message).toContain('not eligible to donate');
        });
    });

    describe('GET /api/donations/me', () => {
        test('should get user donations', async () => {
            // Create some test donations
            await Donation.create({
                donor: testUser._id,
                request: testRequest._id,
                hospital: {
                    name: 'City Hospital',
                    city: 'New Delhi'
                },
                donationDate: new Date(),
                units: 1
            });

            await Donation.create({
                donor: testUser._id,
                hospital: {
                    name: 'General Hospital',
                    city: 'Mumbai'
                },
                donationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
                units: 1
            });

            const response = await request(app)
                .get('/api/donations/me')
                .expect(200);

            expect(response.body.donations).toHaveLength(2);
            expect(response.body.donations[0]).toHaveProperty('_id');
            expect(response.body.donations[0].donor.toString()).toBe(testUser._id.toString());
        });
    });

    describe('GET /api/donations/:id', () => {
        test('should get a donation by ID', async () => {
            // Create a test donation
            const testDonation = await Donation.create({
                donor: testUser._id,
                request: testRequest._id,
                hospital: {
                    name: 'City Hospital',
                    city: 'New Delhi'
                },
                donationDate: new Date(),
                units: 1
            });

            const response = await request(app)
                .get(`/api/donations/${testDonation._id}`)
                .expect(200);

            expect(response.body.donation).toHaveProperty('_id');
            expect(response.body.donation._id).toBe(testDonation._id.toString());
            expect(response.body.donation.hospital.name).toBe('City Hospital');
        });

        test('should return 404 for non-existent donation', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/donations/${nonExistentId}`)
                .expect(404);

            expect(response.body.message).toBe('Donation not found');
        });

        test('should return 403 if user is not authorized to view the donation', async () => {
            // Create another user
            const anotherUser = await User.create({
                supabaseId: 'another-supabase-id',
                email: 'another@example.com',
                name: 'Another User',
                bloodType: 'O+'
            });

            // Create a test donation with another user as donor
            const testDonation = await Donation.create({
                donor: anotherUser._id,
                hospital: {
                    name: 'City Hospital',
                    city: 'New Delhi'
                },
                donationDate: new Date(),
                units: 1
            });

            const response = await request(app)
                .get(`/api/donations/${testDonation._id}`)
                .expect(403);

            expect(response.body.message).toBe('Not authorized to view this donation');
        });
    });

    describe('POST /api/donations/verify/:id', () => {
        test('should verify a donation (admin only)', async () => {
            // Create a test donation
            const testDonation = await Donation.create({
                donor: testUser._id,
                request: testRequest._id,
                hospital: {
                    name: 'City Hospital',
                    city: 'New Delhi'
                },
                donationDate: new Date(),
                units: 1,
                verified: false
            });

            // Mock admin middleware
            app.use('/api/donations/verify', (req, res, next) => {
                req.user.isAdmin = true;
                next();
            });

            const response = await request(app)
                .post(`/api/donations/verify/${testDonation._id}`)
                .expect(200);

            expect(response.body.message).toBe('Donation verified successfully');
            expect(response.body.donation.verified).toBe(true);

            // Check if donation was updated in database
            const updatedDonation = await Donation.findById(testDonation._id);
            expect(updatedDonation.verified).toBe(true);
        });
    });
});

