// src/api/routes/partners.ts
import Router from '@koa/router';
import { PartnerController } from '../controllers/PartnerController';
import { authMiddleware } from '../../middleware/auth';

const router = new Router({ prefix: '/partners' });
const partnerController = new PartnerController();

// Public routes
router.get('/', partnerController.getPartners);

// Protected routes
router.post('/', authMiddleware, partnerController.createPartner);
router.put('/:id', authMiddleware, partnerController.updatePartner);
router.delete('/:id', authMiddleware, partnerController.deletePartner);

export const partnerRoutes = router;