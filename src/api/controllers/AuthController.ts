// src/api/controllers/AuthController.ts
import { Context } from 'koa';
import { AuthService } from '../../services/AuthService';
import { User } from '../../entities/User';
import { logger } from '../../utils/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (ctx: Context) => {
    try {
      const { email, password } = ctx.request.body as { email: string; password: string };
      
      if (!email || !password) {
        ctx.status = 400;
        ctx.body = { error: { message: 'Email and password are required' } };
        return;
      }

      const result = await this.authService.login(email, password);
      
      if (!result) {
        ctx.status = 401;
        ctx.body = { error: { message: 'Invalid credentials' } };
        return;
      }
      
      ctx.body = result;
    } catch (error) {
      logger.error('Login error:', error);
      ctx.status = 500;
      ctx.body = { 
        error: { 
          message: 'Failed to login',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        } 
      };
    }
  };

  register = async (ctx: Context) => {
    try {
      const userData = ctx.request.body as Partial<User>;
      
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        ctx.status = 400;
        ctx.body = { error: { message: 'Email, password, firstName, and lastName are required' } };
        return;
      }

      const result = await this.authService.register(userData);
      
      if (!result) {
        ctx.status = 409;
        ctx.body = { error: { message: 'User already exists' } };
        return;
      }
      
      ctx.status = 201;
      ctx.body = result;
    } catch (error) {
      logger.error('Registration error:', error);
      ctx.status = 500;
      ctx.body = { 
        error: { 
          message: 'Failed to register user',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        } 
      };
    }
  };
}