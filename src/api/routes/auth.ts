// src/api/routes/auth.ts
import Router from '@koa/router';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../../middleware/validate';
import { AuthEndpoints } from '@mohit554411/ocean-air-types';
import { authMiddleware } from '../../middleware/auth';

const router = new Router({ prefix: '/auth' });
const authController = new AuthController();

// Apply validation middleware before the controller method
router.post(
  '/login', 
  validate(AuthEndpoints.login.request), 
  authController.login
);
router.post(
  '/register', 
  validate(AuthEndpoints.register.request), 
  authController.register
);

// Add GET /auth/me route (needs authentication middleware)
// Assuming you have an 'authenticate' middleware like this:
// import { authenticate } from '../../middleware/authenticate'; 
// router.get('/me', authenticate, authController.getCurrentUser);

// Placeholder - Add your actual authentication middleware here
// For now, let's just add the route pointing to the controller
// YOU WILL NEED TO ADD AUTHENTICATION MIDDLEWARE FOR THIS TO BE SECURE
router.get('/me',authMiddleware, authController.getCurrentUser);

export const authRoutes = router;