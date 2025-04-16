import { AppDataSource } from '../../src/database/connection';
import { User } from '../../src/entities/User';
import { createTestUser, getAuthToken } from '../helpers/auth';
import Koa from 'koa';
import { setupRoutes } from '../../src/api/routes';

const request = require('supertest');

// Create test app
const app = new Koa();
setupRoutes(app);

describe('Auth API', () => {
  let testUser: User;
  let authToken: string;

  beforeAll(async () => {
    // Create a test user
    testUser = await createTestUser();
    authToken = getAuthToken(testUser.id);
  });

  afterAll(async () => {
    // Clean up
    await AppDataSource.getRepository(User).clear();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('should not get current user without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me');

      expect(response.status).toBe(401);
    });
  });
}); 