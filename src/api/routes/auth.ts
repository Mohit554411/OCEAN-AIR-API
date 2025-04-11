// src/api/routes/auth.ts
import Router from '@koa/router';
import { AuthController } from '../controllers/AuthController';

const router = new Router({ prefix: '/auth' });
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/register', authController.register);

export const authRoutes = router;