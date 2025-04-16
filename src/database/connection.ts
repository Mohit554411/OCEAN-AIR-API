// src/database/connection.ts
import { DataSource } from 'typeorm';
import { logger } from '../utils/logger';
import { dbConfig } from './config';

export const AppDataSource = new DataSource({
  ...dbConfig,
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