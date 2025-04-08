const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../backend/src/server');
const User = require('../../backend/src/models/User');

// Mock Supabase
jest.mock('../../backend/src/utils/supabase', () => ({
  registerUser: jest.fn().mockResolvedValue({
    user: { id: 'test-supabase-id', email: 'test@example.com' }
  }),
  loginUser: jest.fn().mockResolvedValue({
    user: { id: 'test-supabase-id', email: 'test@example.com' },
    session: { access_token: 'test-token' }
  }),
  resetPassword: jest.fn().mockResolvedValue(true)
}));

// Mock email sender
jest.mock('../../backend/src/utils/emailSender', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true)
}));

describe('Auth Controller', () => {
  let mongoServer;
  
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
  });
  
  describe('POST /api/auth/register', () => {
    test('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        bloodType: 'A+',
        phone: '1234567890',
        location: {
          city: 'New Delhi',
          state: 'Delhi'
        }
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      
      // Check if user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).not.toBeNull();
      expect(user.name).toBe(userData.name);
      expect(user.bloodType).toBe(userData.bloodType);
    });
    
    test('should return 400 if required fields are missing', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123'
        // Missing name and bloodType
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
      
      expect(response.body.message).toContain('Missing required fields');
    });
  });
  
  describe('POST /api/auth/login', () => {
    test('should login a user', async () => {
      // Create a user first
      await User.create({
        supabaseId: 'test-supabase-id',
        email: 'test@example.com',
        name: 'Test User',
        bloodType: 'A+'
      });
      
      const loginData = {
        email: 'test@example.com',
        password: 'Password123'
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);
      
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBe('test-token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(loginData.email);
    });
    
    test('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'WrongPassword'
      };
      
      // Mock Supabase to throw error
      require('../../backend/src/utils/supabase').loginUser.mockRejectedValueOnce(
        new Error('Invalid email or password')
      );
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
      
      expect(response.body.message).toContain('Login failed');
    });
  });
  
  describe('GET /api/auth/me', () => {
    test('should return current user data', async () => {
      // Create a user
      const user = await User.create({
        supabaseId: 'test-supabase-id',
        email: 'test@example.com',
        name: 'Test User',
        bloodType: 'A+'
      });
      
      // Mock auth middleware
      app.use('/api/auth/me', (req, res, next) => {
        req.user = user;
        next();
      });
      
      const response = await request(app)
        .get('/api/auth/me')
        .expect(200);
      
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user.name).toBe(user.name);
      expect(response.body.user.bloodType).toBe(user.bloodType);
    });
  });
});
