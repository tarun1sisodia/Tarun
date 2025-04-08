// Load test environment variables
require('dotenv').config({ path: './backend/.env.test' });

// Import the Express app without connecting to MongoDB
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require('../backend/src/routes/authRoutes');
const usersRoutes = require('../backend/src/routes/usersRoutes');
const requestsRoutes = require('../backend/src/routes/requestsRoutes');
const donationRoutes = require('../backend/src/routes/donationRoutes');
const matchRoutes = require('../backend/src/routes/matchRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/match', matchRoutes);

module.exports = app;
