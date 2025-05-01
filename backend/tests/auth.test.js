// Authentication tests for Foody backend
// Created: 2025-05-01

const request = require('supertest');
const app = require('../server');

describe('Authentication Endpoints', () => {
    test('POST /api/auth/register - should create new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });
    
    test('POST /api/auth/login - should authenticate user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
