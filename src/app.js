const express = require('express');
const helmet = require('helmet');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security

// Parsers
app.use(express.json()); // Allows parsing JSON bodies

// Serve Static Files (Your Tailwind Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);

// FUTURE DEVELOPMENT: Add Rate Limiting middleware here to prevent brute-force attacks.

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});