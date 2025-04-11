import 'dotenv/config';
import { AppDataSource } from './database/connection';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    logger.info('Worker database connection established');

    // Setup any background job handlers here
    setupJobs();

    logger.info('Worker started successfully');
  } catch (error) {
    logger.error('Failed to start worker:', error);
    process.exit(1);
  }
}

function setupJobs() {
  // Initialize job handling here
  // For example:
  // - Data synchronization jobs
  // - Periodic cleanup tasks
  // - Message queue consumers
  logger.info('Background jobs initialized');
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down worker gracefully');
  // Close connections, finish current jobs, etc.
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down worker gracefully');
  // Close connections, finish current jobs, etc.
  process.exit(0);
});

bootstrap();
