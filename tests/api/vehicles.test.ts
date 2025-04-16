import { AppDataSource } from '../../src/database/connection';
import { Vehicle, VehicleType } from '../../src/entities/Vehicle';
import { createTestUser, getAuthToken } from '../helpers/auth';
import Koa from 'koa';
import { setupRoutes } from '../../src/api/routes';

const request = require('supertest');

// Create test app
const app = new Koa();
setupRoutes(app);

describe('Vehicle API', () => {
  let testUser: any;
  let authToken: string;
  let testCompany: any;
  let testVehicle: Vehicle;

  beforeAll(async () => {
    // Create a test user and get token
    testUser = await createTestUser();
    authToken = getAuthToken(testUser.id);
    testCompany = testUser.company;

    // Create a test vehicle
    const vehicleData = {
      licensePlateNumber: 'TEST123',
      vehicleType: VehicleType.TRACTOR,
      trackerId: 'TRACKER123',
      equipment: [{
        capacity: '1000kg',
        features: ['GPS', 'Temperature Control']
      }],
      isActive: true,
      company: testCompany
    };

    testVehicle = AppDataSource.getRepository(Vehicle).create(vehicleData);
    await AppDataSource.getRepository(Vehicle).save(testVehicle);
  });

  afterAll(async () => {
    // Clean up
    await AppDataSource.getRepository(Vehicle).clear();
  });

  describe('GET /api/v1/vehicles', () => {
    it('should get all vehicles with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/vehicles')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('licensePlateNumber');
    });

    it('should not get vehicles without token', async () => {
      const response = await request(app)
        .get('/api/v1/vehicles');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/vehicles/:id', () => {
    it('should get a specific vehicle with valid token', async () => {
      const response = await request(app)
        .get(`/api/v1/vehicles/${testVehicle.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testVehicle.id);
      expect(response.body).toHaveProperty('licensePlateNumber', 'TEST123');
    });

    it('should return 404 for non-existent vehicle', async () => {
      const response = await request(app)
        .get('/api/v1/vehicles/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/vehicles', () => {
    it('should create a new vehicle with valid data', async () => {
      const newVehicle = {
        licensePlateNumber: 'NEW123',
        vehicleType: 'VAN',
        trackerId: 'NEWTRACKER123',
        equipment: {
          capacity: '500kg',
          features: ['GPS']
        },
        isActive: true
      };

      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newVehicle);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.licensePlateNumber).toBe(newVehicle.licensePlateNumber);
      expect(response.body.vehicleType).toBe(newVehicle.vehicleType);
    });

    it('should not create vehicle with invalid vehicleType', async () => {
      const invalidVehicle = {
        licensePlateNumber: 'INVALID123',
        vehicleType: 'INVALID_TYPE',
        trackerId: 'TRACKER123',
        isActive: true
      };

      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidVehicle);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/v1/vehicles/:id', () => {
    it('should update a vehicle with valid data', async () => {
      const updatedData = {
        licensePlateNumber: 'UPDATED123',
        isActive: false
      };

      const response = await request(app)
        .put(`/api/v1/vehicles/${testVehicle.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.licensePlateNumber).toBe(updatedData.licensePlateNumber);
      expect(response.body.isActive).toBe(updatedData.isActive);
    });
  });
}); 