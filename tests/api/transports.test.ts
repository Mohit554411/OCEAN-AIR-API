import { AppDataSource } from '../../src/database/connection';
import { Transport, TransportType, TrackingState } from '../../src/entities/Transport';
import { Vehicle, VehicleType } from '../../src/entities/Vehicle';
import { createTestUser, getAuthToken } from '../helpers/auth';
import Koa from 'koa';
import { setupRoutes } from '../../src/api/routes';

const request = require('supertest');

// Create test app
const app = new Koa();
setupRoutes(app);

describe('Transport API', () => {
  let testUser: any;
  let authToken: string;
  let testCompany: any;
  let testVehicle: Vehicle;
  let testTransport: Transport;

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

    // Create a test transport
    const transportData = {
      transportId: 'TRANS123',
      transportNumber: 'TN123',
      type: TransportType.ROAD,
      trackingState: TrackingState.PENDING,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour later
      customFields: {
        priority: 'HIGH',
        notes: 'Test transport'
      },
      isFinished: false,
      stops: [
        {
          location: 'Location A',
          time: new Date()
        },
        {
          location: 'Location B',
          time: new Date(Date.now() + 1800000) // 30 minutes later
        }
      ],
      company: testCompany,
      allocatedVehicle: testVehicle
    };

    testTransport = AppDataSource.getRepository(Transport).create(transportData);
    await AppDataSource.getRepository(Transport).save(testTransport);
  });

  afterAll(async () => {
    // Clean up
    await AppDataSource.getRepository(Transport).clear();
    await AppDataSource.getRepository(Vehicle).clear();
  });

  describe('GET /api/v1/transports', () => {
    it('should get all transports with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/transports')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('transportId');
    });

    it('should not get transports without token', async () => {
      const response = await request(app)
        .get('/api/v1/transports');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/transports/:id', () => {
    it('should get a specific transport with valid token', async () => {
      const response = await request(app)
        .get(`/api/v1/transports/${testTransport.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testTransport.id);
      expect(response.body).toHaveProperty('transportId', 'TRANS123');
    });

    it('should return 404 for non-existent transport', async () => {
      const response = await request(app)
        .get('/api/v1/transports/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/transports', () => {
    it('should create a new transport with valid data', async () => {
      const newTransport = {
        transportId: 'NEWTRANS123',
        transportNumber: 'NEWTN123',
        type: TransportType.ROAD,
        trackingState: TrackingState.PENDING,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        customFields: {
          priority: 'MEDIUM',
          notes: 'New test transport'
        },
        isFinished: false,
        stops: [
          {
            location: 'New Location A',
            time: new Date().toISOString()
          }
        ]
      };

      const response = await request(app)
        .post('/api/v1/transports')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTransport);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.transportId).toBe(newTransport.transportId);
      expect(response.body.type).toBe(newTransport.type);
    });

    it('should not create transport with invalid type', async () => {
      const invalidTransport = {
        transportId: 'INVALID123',
        type: 'INVALID_TYPE',
        trackingState: TrackingState.PENDING,
        isFinished: false
      };

      const response = await request(app)
        .post('/api/v1/transports')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTransport);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/v1/transports/:id', () => {
    it('should update a transport with valid data', async () => {
      const updatedData = {
        trackingState: TrackingState.TRACKING,
        isFinished: true
      };

      const response = await request(app)
        .put(`/api/v1/transports/${testTransport.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.trackingState).toBe(updatedData.trackingState);
      expect(response.body.isFinished).toBe(updatedData.isFinished);
    });
  });
}); 