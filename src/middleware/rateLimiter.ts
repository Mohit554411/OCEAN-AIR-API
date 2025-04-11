import { Context, Next } from 'koa';

// Simple in-memory store for rate limiting
const ipRequestCounts: Record<string, { count: number; resetTime: number }> = {};

// Default values if not provided in .env
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000; // 1 minute
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 100; // 100 requests per minute

export function rateLimiter() {
  return async (ctx: Context, next: Next) => {
    const ip = ctx.ip;
    const now = Date.now();
    
    // Initialize or reset if window has passed
    if (!ipRequestCounts[ip] || ipRequestCounts[ip].resetTime < now) {
      ipRequestCounts[ip] = {
        count: 0,
        resetTime: now + RATE_LIMIT_WINDOW_MS
      };
    }
    
    // Increment count
    ipRequestCounts[ip].count += 1;
    
    // Check if over limit
    if (ipRequestCounts[ip].count > RATE_LIMIT_MAX) {
      ctx.status = 429;
      ctx.body = {
        error: {
          message: 'Too many requests, please try again later.',
          retryAfter: Math.ceil((ipRequestCounts[ip].resetTime - now) / 1000)
        }
      };
      return;
    }
    
    // Set headers
    ctx.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
    ctx.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX - ipRequestCounts[ip].count).toString());
    ctx.set('X-RateLimit-Reset', Math.ceil(ipRequestCounts[ip].resetTime / 1000).toString());
    
    await next();
  };
}
