import 'dotenv/config';

export const dbConfig = {
  type: 'postgres' as const,
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  username: process.env.PG_USERNAME || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DATABASE || 'ocean_air_db',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  poolSize: Number(process.env.DB_POOL_SIZE) || 10,
  connectTimeoutMS: Number(process.env.DB_CONNECTION_TIMEOUT_MS) || 15000
};
