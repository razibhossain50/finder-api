const { Client } = require('pg');
require('dotenv').config();

async function checkSchema() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '12345',
    database: process.env.DB_NAME || 'Finder'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check if migrations table exists
    const migrationsTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'migrations'
      );
    `);

    if (migrationsTable.rows[0].exists) {
      console.log('📋 Migration History:');
      const migrations = await client.query('SELECT * FROM migrations ORDER BY timestamp');
      if (migrations.rows.length === 0) {
        console.log('  No migrations have been run yet.');
      } else {
        migrations.rows.forEach(migration => {
          console.log(`  ✅ ${migration.name} (${new Date(migration.timestamp).toLocaleString()})`);
        });
      }
    } else {
      console.log('⚠️  Migrations table does not exist. Run migrations first.');
    }

    // Check main tables
    console.log('\n📊 Database Tables:');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    if (tables.rows.length === 0) {
      console.log('  No tables found. Database appears to be empty.');
    } else {
      for (const table of tables.rows) {
        const count = await client.query(`SELECT COUNT(*) FROM "${table.table_name}"`);
        console.log(`  📄 ${table.table_name}: ${count.rows[0].count} records`);
      }
    }

    // Check user accounts
    const userTableExists = tables.rows.some(row => row.table_name === 'user');
    if (userTableExists) {
      console.log('\n👥 User Accounts:');
      const users = await client.query('SELECT id, "fullName", email, mobile, role FROM "user" ORDER BY role, id');
      if (users.rows.length === 0) {
        console.log('  No users found. Run seeding to create default accounts.');
      } else {
        users.rows.forEach(user => {
          console.log(`  👤 ${user.fullName} (${user.role}) - ${user.email || user.mobile}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    console.log('\n🔧 Possible solutions:');
    console.log('  1. Make sure PostgreSQL is running');
    console.log('  2. Check your .env file database credentials');
    console.log('  3. Create the database if it doesn\'t exist');
    console.log('  4. Run: npm run setup');
  } finally {
    await client.end();
  }
}

checkSchema();