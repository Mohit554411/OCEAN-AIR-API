import { AppDataSource } from '../src/database/connection';
import { InitialMigration1744390414652 } from '../src/migrations/1744390414652-InitialMigration';

// Global setup for tests
beforeAll(async () => {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    
    // Drop all tables in the correct order to handle foreign key constraints
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.query(`
      DROP TABLE IF EXISTS "public"."transports" CASCADE;
      DROP TABLE IF EXISTS "public"."vehicles" CASCADE;
      DROP TABLE IF EXISTS "public"."users" CASCADE;
      DROP TABLE IF EXISTS "public"."companies" CASCADE;
      DROP TABLE IF EXISTS "public"."places" CASCADE;
      DROP TABLE IF EXISTS "public"."partners" CASCADE;
      DROP TYPE IF EXISTS "public"."vehicles_vehicletype_enum" CASCADE;
      DROP TYPE IF EXISTS "public"."partners_type_enum" CASCADE;
      DROP TYPE IF EXISTS "public"."transports_type_enum" CASCADE;
      DROP TYPE IF EXISTS "public"."transports_trackingstate_enum" CASCADE;
    `);

    // Enable uuid-ossp extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    
    await queryRunner.release();

    // Run migrations manually with proper query runner management
    console.log('Running migrations...');
    const migrationQueryRunner = AppDataSource.createQueryRunner();
    try {
      await migrationQueryRunner.connect();
      await migrationQueryRunner.startTransaction();
      
      const migration = new InitialMigration1744390414652();
      await migration.up(migrationQueryRunner);
      
      await migrationQueryRunner.commitTransaction();
      console.log('Migration completed');
    } catch (error) {
      await migrationQueryRunner.rollbackTransaction();
      throw error;
    } finally {
      await migrationQueryRunner.release();
    }

    // Verify tables were created
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Created tables:', tables.map(t => t.table_name));

    // Verify enum types were created
    const types = await AppDataSource.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      AND typtype = 'e'
    `);
    console.log('Created enum types:', types.map(t => t.typname));
  } catch (error) {
    console.error('Error during test setup:', error);
    throw error;
  }
});

// Cleanup after tests
afterAll(async () => {
  try {
    // Drop all tables in the correct order
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.query(`
      DROP TABLE IF EXISTS "public"."transports" CASCADE;
      DROP TABLE IF EXISTS "public"."vehicles" CASCADE;
      DROP TABLE IF EXISTS "public"."users" CASCADE;
      DROP TABLE IF EXISTS "public"."companies" CASCADE;
      DROP TABLE IF EXISTS "public"."places" CASCADE;
      DROP TABLE IF EXISTS "public"."partners" CASCADE;
      DROP TYPE IF EXISTS "public"."vehicles_vehicletype_enum" CASCADE;
      DROP TYPE IF EXISTS "public"."partners_type_enum" CASCADE;
      DROP TYPE IF EXISTS "public"."transports_type_enum" CASCADE;
      DROP TYPE IF EXISTS "public"."transports_trackingstate_enum" CASCADE;
    `);
    await queryRunner.release();

    // Close the database connection
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during test cleanup:', error);
    throw error;
  }
}); 