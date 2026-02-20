const redisClient = require('../config/redis');
const bcrypt = require('bcryptjs');

// Helper to format Redis keys
const getUserKey = (username) => `user:${username}`;

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userKey = getUserKey(username);

        // 1. Check if user already exists
        // redisClient.exists returns 1 if key exists, 0 if not
        const userExists = await redisClient.exists(userKey);
        
        if (userExists) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        // 2. Hash the password (Security Requirement)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Store user in Redis
        // We use a Hash map to store user details. 
        // SECURITY NOTE: In a real production app, we might also store a creation timestamp 
        // or user roles here.
        await redisClient.hSet(userKey, {
            username: username,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userKey = getUserKey(username);

        // 1. Check if user exists
        const userExists = await redisClient.exists(userKey);
        if (!userExists) {
            // SECURITY NOTE: Use generic error messages to prevent username enumeration attacks
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 2. Get the stored hash
        const storedPassword = await redisClient.hGet(userKey, 'password');

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, storedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 4. Successful Login
        // FUTURE DEVELOPMENT: Implement JWT (JSON Web Tokens) or Session IDs here 
        // to maintain login state across requests.
        res.status(200).json({ message: 'Authentication successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};