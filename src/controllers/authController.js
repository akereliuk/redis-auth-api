const redisClient = require('../config/redis');
const bcrypt = require('bcryptjs');

// Helper to format Redis keys
const getUserKey = (username) => `user:${username}`;

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userKey = getUserKey(username);

        const userExists = await redisClient.exists(userKey);
        
        if (userExists) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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

        const userExists = await redisClient.exists(userKey);
        if (!userExists) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const storedPassword = await redisClient.hGet(userKey, 'password');

        const isMatch = await bcrypt.compare(password, storedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Authentication successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};