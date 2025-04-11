// src/api/routes/vehicles.ts
import Router from '@koa/router';
import { VehicleController } from '../controllers/VehicleController';
import { authMiddleware } from '../../middleware/auth';

const router = new Router({ prefix: '/vehicles' });
const vehicleController = new VehicleController();

// Public routes
router.get('/', vehicleController.getVehicles);
router.get('/:license_plate_number', vehicleController.getVehicleByLicensePlate);

// Protected routes
router.post('/', authMiddleware, vehicleController.createVehicle);
router.put('/:id', authMiddleware, vehicleController.updateVehicle);
router.delete('/:id', authMiddleware, vehicleController.deleteVehicle);

export const vehicleRoutes = router;