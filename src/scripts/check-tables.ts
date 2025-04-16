import { AppDataSource } from '../database/connection';

async function checkTables() {
    try {
        // Initialize the connection
        await AppDataSource.initialize();
        console.log('Connected to database successfully');

        // Get all tables
        const tables = await AppDataSource.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
        
        console.log('\nTables in database:');
        console.log('-------------------');
        tables.forEach((table: { table_name: string }) => {
            console.log(table.table_name);
        });

        // Get table details for each entity
        const entities = AppDataSource.entityMetadatas;
        
        console.log('\nEntity details:');
        console.log('---------------');
        for (const entity of entities) {
            console.log(`\nEntity: ${entity.name}`);
            console.log(`Table: ${entity.tableName}`);
            console.log('Columns:');
            entity.columns.forEach(column => {
                console.log(`- ${column.propertyName}: ${column.type}`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

checkTables(); 