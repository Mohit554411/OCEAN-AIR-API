// src/middleware/errorHandler.ts
import { Context, Next } from 'koa';
import { logger } from '../utils/logger';

export function errorHandler() {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (err: any) {
      const status = err.status || 500;
      const message = err.message || 'Internal Server Error';
      
      logger.error(`Error: ${message}`, { 
        status,
        stack: err.stack,
        path: ctx.path,
        method: ctx.method
      });

      ctx.status = status;
      ctx.body = {
        error: {
          status,
          message,
          ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
        },
      };
    }
  };
}