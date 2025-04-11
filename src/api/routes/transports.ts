// src/api/routes/transports.ts
import Router from '@koa/router';
import { TransportController } from '../controllers/TransportController';
import { authMiddleware } from '../../middleware/auth';

const router = new Router({ prefix: '/transports' });
const transportController = new TransportController();

// Public routes
router.get('/', transportController.getTransports);
router.get('/:identifier_type/:identifier_value', transportController.getTransportById);

// Protected routes
router.put('/:identifier_type/:identifier_value', authMiddleware, transportController.createOrUpdateTransport);
router.delete('/:identifier_type/:identifier_value', authMiddleware, transportController.deleteTransport);
router.post('/:identifier_type/:identifier_value/allocation', authMiddleware, transportController.allocateVehicle);
router.post('/:identifier_type/:identifier_value/deallocation', authMiddleware, transportController.deallocateVehicle);

export const transportRoutes = router;