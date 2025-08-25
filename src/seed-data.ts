import { AppDataSource } from './data-source';
import * as bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Check if users already exist
    const existingUsers = await AppDataSource.query('SELECT COUNT(*) as count FROM "user"');
    if (parseInt(existingUsers[0].count) > 0) {
      console.log('📊 Users already exist in database. Skipping seed.');
      return;
    }

    console.log('🌱 Seeding initial users...');



    // Hash specific passwords for each user (all use Testpass@50)
    const superadminPassword = await bcrypt.hash('Testpass@50', 10);
    const adminPassword = await bcrypt.hash('Testpass@50', 10);
    const userPassword = await bcrypt.hash('Testpass@50', 10);

    // Create superadmin user
    await AppDataSource.query(`
      INSERT INTO "user" ("fullName", "email", "password", "mobile", "role", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    `, [
      'Super Admin',
      'superadmin@finder.com',
      superadminPassword,
      '01700000000',
      'superadmin'
    ]);

    // Create admin user
    await AppDataSource.query(`
      INSERT INTO "user" ("fullName", "email", "password", "mobile", "role", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    `, [
      'Admin User',
      'admin@finder.com',
      adminPassword,
      '01900000000',
      'admin'
    ]);

    // Create test user
    await AppDataSource.query(`
      INSERT INTO "user" ("fullName", "email", "password", "mobile", "role", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    `, [
      'Test User',
      'user@finder.com',
      userPassword,
      '01800000000',
      'user'
    ]);

    console.log('✅ Successfully seeded initial users:');
    console.log('  - Super Admin: superadmin@finder.com / 01700000000 (password: Testpass@50)');
    console.log('  - Admin: admin@finder.com / 01900000000 (password: Testpass@50)');
    console.log('  - User: user@finder.com / 01800000000 (password: Testpass@50)');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };