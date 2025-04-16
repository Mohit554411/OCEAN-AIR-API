import { AppDataSource } from '../../src/database/connection';
import { Place } from '../../src/entities/Place';
import { createTestUser, getAuthToken } from '../helpers/auth';
import Koa from 'koa';
import { setupRoutes } from '../../src/api/routes';
import request from 'supertest';

// Create test app
const app = new Koa();
setupRoutes(app);

describe('Places API', () => {
  let testUser: any;
  let authToken: string;
  let testCompany: any;
  let testPlace: any;

  beforeAll(async () => {
    // Create test user and get auth token
    testUser = await createTestUser();
    authToken = getAuthToken(testUser.id);
    testCompany = testUser.company;

    // Create a test place
    testPlace = await AppDataSource.getRepository(Place).save({
      name: 'Test Place',
      placeId: 'TEST123',
      address: {
        street: '123 Test St',
        city: 'Test City',
        country: 'Test Country'
      },
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      },
      isActive: true,
      company: testCompany
    });
  });

  afterAll(async () => {
    // Clean up
    await AppDataSource.getRepository(Place).clear();
  });

  describe('GET /api/v1/places', () => {
    it('should get all places with valid token', async () => {
      const response = await request(app.callback())
        .get('/api/v1/places')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name).toBe('Test Place');
    });

    it('should not get places without token', async () => {
      const response = await request(app.callback())
        .get('/api/v1/places');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/places/:id', () => {
    it('should get a place by id with valid token', async () => {
      const response = await request(app.callback())
        .get(`/api/v1/places/${testPlace.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Place');
    });

    it('should return 404 for non-existent place', async () => {
      const response = await request(app.callback())
        .get('/api/v1/places/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/places', () => {
    it('should create a new place with valid data', async () => {
      const newPlace = {
        name: 'New Test Place',
        placeId: 'NEW123',
        address: {
          street: '456 New St',
          city: 'New City',
          country: 'New Country'
        },
        coordinates: {
          latitude: 41.7128,
          longitude: -75.0060
        },
        isActive: true
      };

      const response = await request(app.callback())
        .post('/api/v1/places')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newPlace);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Test Place');
      expect(response.body.placeId).toBe('NEW123');
    });

    it('should not create place with invalid data', async () => {
      const invalidPlace = {
        name: 'Invalid Place',
        // Missing required fields
      };

      const response = await request(app.callback())
        .post('/api/v1/places')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPlace);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/v1/places/:id', () => {
    it('should update a place with valid data', async () => {
      const updatedData = {
        name: 'Updated Test Place',
        address: {
          street: '789 Updated St',
          city: 'Updated City',
          country: 'Updated Country'
        }
      };

      const response = await request(app.callback())
        .put(`/api/v1/places/${testPlace.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Test Place');
      expect(response.body.address.street).toBe('789 Updated St');
    });
  });
}); 