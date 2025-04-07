const express = require('express');
const userController = require('../controllers/userController');
const { profileUpdateValidation } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put('/profile', auth, profileUpdateValidation, userController.updateProfile);

// Get all donors
router.get('/donors', userController.getDonors);

// Get user by ID
router.get('/:id', userController.getUserById);

module.exports = router;
