// src/server.ts
import 'dotenv/config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import { AppDataSource } from './database/connection';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { setupRoutes } from './api/routes';
import { logger as appLogger } from './utils/logger';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    appLogger.info('Database connection established');

    const app = new Koa();

    // Apply middleware
    app.use(cors());
    app.use(helmet());
    app.use(logger());
    app.use(bodyParser());
    app.use(errorHandler());
    app.use(rateLimiter());

    // Setup routes
    setupRoutes(app);

    // Start server
    app.listen(PORT, () => {
      appLogger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    appLogger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();