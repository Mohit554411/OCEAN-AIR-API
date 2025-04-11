// src/api/routes/index.ts
import Koa from 'koa';
import Router from '@koa/router';
import { transportRoutes } from './transports';
import { vehicleRoutes } from './vehicles';
import { partnerRoutes } from './partners';
import { placeRoutes } from './places';
import { authRoutes } from './auth';

export function setupRoutes(app: Koa): void {
  const apiRouter = new Router({ prefix: '/api/v1' });

  // Health check endpoint
  apiRouter.get('/health', (ctx) => {
    ctx.body = { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Apply all routes
  apiRouter.use(authRoutes.routes());
  apiRouter.use(transportRoutes.routes());
  apiRouter.use(vehicleRoutes.routes());
  apiRouter.use(partnerRoutes.routes());
  apiRouter.use(placeRoutes.routes());

  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());
}