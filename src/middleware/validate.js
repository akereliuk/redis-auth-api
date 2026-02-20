const { body, validationResult } = require('express-validator');

// Validation rules for registration
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .escape(), // Sanitize input to prevent XSS
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character'),
];

// Validation rules for login (less strict, just needs existence)
const loginValidation = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Middleware to check for validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation Failed', 
            details: errors.array() 
        });
    }
    next();
};

module.exports = {
    registerValidation,
    loginValidation,
    validate
};