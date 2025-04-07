const { validationResult, body } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Registration validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood type'),
  validate
];

// Login validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Request creation validation rules
const requestValidation = [
  body('patientName').notEmpty().withMessage('Patient name is required'),
  body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood type'),
  body('unitsNeeded').isInt({ min: 1 }).withMessage('At least 1 unit is required'),
  body('hospital.name').notEmpty().withMessage('Hospital name is required'),
  body('urgency').optional().isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid urgency level'),
  validate
];

// Donation validation rules
const donationValidation = [
  body('hospital.name').notEmpty().withMessage('Hospital name is required'),
  body('donationDate').isISO8601().toDate().withMessage('Valid donation date is required'),
  body('units').isInt({ min: 1 }).withMessage('At least 1 unit is required'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  requestValidation,
  donationValidation
};
