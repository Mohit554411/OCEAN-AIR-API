// src/database/connection.ts
import { DataSource } from 'typeorm';
import { join } from 'path';
import { logger } from '../utils/logger';
import { dbConfig } from './config';

export const AppDataSource = new DataSource({
  ...dbConfig,
  entities: [join(__dirname, '../entities/**/*.{ts,js}')],
  migrations: [join(__dirname, '../migrations/**/*.{ts,js}')],
  subscribers: []
});

export const createConnection = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established successfully');
    return AppDataSource;
  } catch (error) {
    logger.error('Error connecting to database:', error);
    throw error;
  }
};