// src/api/controllers/AuthController.ts
import { Context } from 'koa';
import { AuthService } from '../../services/AuthService';
import { User } from '../../entities/User';
import { logger } from '../../utils/logger';
import { 
  AuthResponse, 
  UserCreatePayload, 
  LoginPayload, 
  AuthEndpoints 
} from '@mohit554411/ocean-air-types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (ctx: Context) => {
    try {
      // ctx.request.body is already validated by the middleware
      // and matches the LoginPayload type
      console.log("ctx.request.body", ctx.request.body);
      const { email, password } = ctx.request.body as LoginPayload;
      const result = await this.authService.login(email, password);
      
      if (!result) {
        ctx.status = 401;
        ctx.body = { 
          success: false, 
          error: 'Invalid credentials' 
        };
        return;
      }
      
      // Validate the response data against the runtype before sending
      const responsePayload = AuthEndpoints.login.response.check({
        success: true,
        data: result // result should match AuthResponse interface
      });
      console.log("responsePayload", responsePayload);
      ctx.body = responsePayload;

    } catch (error: any) {
      logger.error('Login error:', { 
        message: error.message, 
        details: error.details, // Include details if validation error
        stack: error.stack 
      });
      // Don't check response here as it's an error
      ctx.status = error.name === 'ValidationError' ? 400 : 500;
      ctx.body = { 
        success: false, 
        error: error.name === 'ValidationError' ? 'Validation failed' : 'Failed to login',
        details: error.details
      };
    }
  };

  register = async (ctx: Context) => {
    try {
      // ctx.request.body is validated and matches UserCreatePayload
      const userData = ctx.request.body as UserCreatePayload;

      const result = await this.authService.register(userData);
      
      if (!result || !result.user) {
         // Handle cases like user already exists, which the service should signal
         // (This might need adjustment based on how authService.register indicates errors)
        ctx.status = 409; // Conflict
        ctx.body = { 
          success: false, 
          error: 'User registration failed (e.g., user already exists)' 
        };
        return;
      }
      
      // Validate the response payload
      const responsePayload = AuthEndpoints.register.response.check({
        success: true,
        data: {
          user: result.user // Assuming register returns { user: User }
        }
      });

      ctx.status = 201; // Created
      ctx.body = responsePayload;

    } catch (error: any) {
      logger.error('Registration error:', { 
        message: error.message, 
        details: error.details, 
        stack: error.stack 
      });
      ctx.status = error.name === 'ValidationError' ? 400 : 500;
      ctx.body = { 
        success: false, 
        error: error.name === 'ValidationError' ? 'Validation failed' : 'Failed to register user',
        details: error.details
      };
    }
  };

  // Method to handle GET /auth/me
  getCurrentUser = async (ctx: Context) => {
    // Assuming JWT middleware adds authenticated user info to ctx.state.user
    if (!ctx.state.user || !ctx.state.user.id) {
      ctx.status = 401; // Unauthorized
      ctx.body = { success: false, error: 'Authentication required' };
      return;
    }

    try {
      // In this simple case, the user object might already be attached.
      // If not, you might fetch it from the service based on ctx.state.user.id
      const user = await this.authService.findById(ctx.state.user.id);
      // For now, assume ctx.state.user contains the necessary user info
      // const user = ctx.state.user; 

      // Remove sensitive info like password hash if it's present
      const { password, ...safeUser } = user;

      // Validate the response data against the runtype before sending
      const responsePayload = AuthEndpoints.me.response.check({
        success: true,
        data: safeUser // safeUser should match the UserRuntype structure
      });

      ctx.body = responsePayload;
    } catch (error: any) {
      logger.error('Get current user error:', {
        userId: ctx.state.user?.id,
        message: error.message,
        details: error.details, // Include details if validation error
        stack: error.stack
      });
      ctx.status = error.name === 'ValidationError' ? 400 : 500;
      ctx.body = {
        success: false,
        error: error.name === 'ValidationError' ? 'Invalid user data format' : 'Failed to retrieve user information',
        details: error.details
      };
    }
  };

}