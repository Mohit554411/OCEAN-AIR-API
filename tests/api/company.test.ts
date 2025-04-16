import { AppDataSource } from '../../src/database/connection';
import { Company } from '../../src/entities/Company';
import { createTestUser, getAuthToken } from '../helpers/auth';
import Koa from 'koa';
import { setupRoutes } from '../../src/api/routes';

const request = require('supertest');

// Create test app
const app = new Koa();
setupRoutes(app);

describe('Company API', () => {
  let testUser: any;
  let authToken: string;
  let testCompany: Company;

  beforeAll(async () => {
    // Create a test user and get token
    testUser = await createTestUser();
    authToken = getAuthToken(testUser.id);
    testCompany = testUser.company;
  });

  afterAll(async () => {
    // Clean up
    await AppDataSource.getRepository(Company).clear();
  });

  describe('GET /api/v1/companies', () => {
    it('should get all companies with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/companies')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('should not get companies without token', async () => {
      const response = await request(app)
        .get('/api/v1/companies');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/companies/:id', () => {
    it('should get a specific company with valid token', async () => {
      const response = await request(app)
        .get(`/api/v1/companies/${testCompany.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testCompany.id);
      expect(response.body).toHaveProperty('name', testCompany.name);
    });

    it('should return 404 for non-existent company', async () => {
      const response = await request(app)
        .get('/api/v1/companies/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/companies', () => {
    it('should create a new company with valid data', async () => {
      const newCompany = {
        name: 'New Test Company',
        companyId: 'NEWTEST123',
        vat: '987654321',
        address: {
          street: 'New Test Street',
          city: 'New Test City',
          country: 'New Test Country'
        },
        isActive: true
      };

      const response = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newCompany);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newCompany.name);
      expect(response.body.companyId).toBe(newCompany.companyId);
    });
  });

  describe('PUT /api/v1/companies/:id', () => {
    it('should update a company with valid data', async () => {
      const updatedData = {
        name: 'Updated Company Name',
        isActive: false
      };

      const response = await request(app)
        .put(`/api/v1/companies/${testCompany.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.isActive).toBe(updatedData.isActive);
    });
  });
}); 