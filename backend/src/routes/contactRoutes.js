const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/auth');

// Submit contact form - requires authentication
router.post('/', auth, contactController.submitContactForm);

module.exports = router;
