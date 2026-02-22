const request = require('supertest');
const express = require('express');
const redisClient = require('../config/redis'); 
const authRoutes = require('../routes/authRoutes');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
});

afterAll(async () => {
    await redisClient.del('user:testuser'); 
    await redisClient.quit();
});

describe('Authentication API', () => {

    const validUser = {
        username: 'testuser',
        password: 'Password1!'
    };

    describe('POST /register', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(validUser);
            
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User created successfully');
        });

        it('should not allow duplicate usernames', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(validUser);
            
            expect(res.statusCode).toEqual(409); // Conflict
            expect(res.body).toHaveProperty('error', 'Username already taken');
        });

        it('should reject weak passwords', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'weakuser',
                    password: '123' 
                });
            
            expect(res.statusCode).toEqual(400); // Bad Request
            expect(res.body.details[0].msg).toContain('must be at least 8 characters');
        });
    });

    describe('POST /login', () => {
        it('should authenticate valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send(validUser);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Authentication successful');
        });

        it('should reject invalid passwords', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: validUser.username,
                    password: 'WrongPassword!'
                });
            
            expect(res.statusCode).toEqual(401); // Unauthorized
            expect(res.body).toHaveProperty('error', 'Invalid credentials');
        });

        it('should reject non-existent users', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'ghostuser',
                    password: 'Password1!'
                });
            
            expect(res.statusCode).toEqual(401);
        });
    });
});