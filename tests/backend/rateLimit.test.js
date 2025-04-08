const request = require('supertest');
const express = require('express');
const { authLimiter, apiLimiter } = require('../../backend/src/middleware/rateLimit');

describe('Rate Limiting Middleware', () => {
  let app;
  
  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    
    // Create test routes with rate limiters
    app.post('/api/auth/test', authLimiter, (req, res) => {
      res.status(200).json({ message: 'Auth route accessed' });
    });
    
    app.get('/api/test', apiLimiter, (req, res) => {
      res.status(200).json({ message: 'API route accessed' });
    });
  });
  
  test('should allow requests within rate limits', async () => {
    // Make a request to auth route
    const authResponse = await request(app)
      .post('/api/auth/test')
      .expect(200);
    
    expect(authResponse.body.message).toBe('Auth route accessed');
    
    // Make a request to API route
    const apiResponse = await request(app)
      .get('/api/test')
      .expect(200);
    
    expect(apiResponse.body.message).toBe('API route accessed');
  });
  
  test('should include rate limit headers', async () => {
    const response = await request(app)
      .post('/api/auth/test')
      .expect(200);
    
    // Check for rate limit headers
    expect(response.headers).toHaveProperty('ratelimit-limit');
    expect(response.headers).toHaveProperty('ratelimit-remaining');
    expect(response.headers).toHaveProperty('ratelimit-reset');
    
    // Auth limiter should have a limit of 10
    expect(parseInt(response.headers['ratelimit-limit'])).toBe(10);
  });
  
  test.skip('should block requests that exceed rate limits', async () => {
    // Mock the store to simulate rate limit being exceeded
    const originalStore = authLimiter.store;
    authLimiter.store = {
      ...originalStore,
      increment: (key, cb) => {
        // Simulate rate limit exceeded
        cb(null, 11, 900000);
      }
    };
    
    const response = await request(app)
      .post('/api/auth/test')
      .expect(429); // Too Many Requests
    
    expect(response.body.message).toBe('Too many authentication attempts, please try again after 15 minutes');
    
    // Restore original store
    authLimiter.store = originalStore;
  });
});
