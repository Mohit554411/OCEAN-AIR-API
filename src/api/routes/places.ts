import Router from '@koa/router';
import { PlaceController } from '../controllers/PlaceController';
import { authMiddleware } from '../../middleware/auth';

const router = new Router({ prefix: '/places' });
const placeController = new PlaceController();

// Public routes
router.get('/', placeController.getPlaces);
router.get('/:place_reference_id', placeController.getPlaceById);

// Protected routes
router.put('/:place_reference_id', authMiddleware, placeController.updatePlace);
router.delete('/:place_reference_id', authMiddleware, placeController.deletePlace);

export const placeRoutes = router;
