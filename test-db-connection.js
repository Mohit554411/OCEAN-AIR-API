const { AppDataSource } = require('./build/database/connection');

async function testConnection() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection successful!');
    
    // Test a simple query
    const result = await AppDataSource.query('SELECT 1 as test');
    console.log('Query test successful:', result);
    
    // Check if tables exist
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Existing tables:', tables);
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection(); 