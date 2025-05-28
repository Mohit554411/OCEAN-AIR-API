import { Context, Next } from 'koa';
import { Runtype } from 'runtypes';

export function validate(schema: Runtype) {
  return async (ctx: Context, next: Next) => {
    try {
      // Validate request body against schema
      // Runtype's check() method throws if validation fails
      ctx.request.body = schema.check(ctx.request.body);
      await next();
    } catch (error: any) {
      ctx.status = 400; // Bad Request
      ctx.body = {
        success: false,
        error: 'Validation failed',
        details: error.details,
        message: error.message
      };
      // Log the validation error details if needed
      // logger.warn('Validation Error:', error.details);
    }
  };
} 