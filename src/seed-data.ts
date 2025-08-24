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

    // Hash passwords
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Create superadmin user
    await AppDataSource.query(`
      INSERT INTO "user" ("fullName", "username", "email", "password", "mobile", "role", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `, [
      'Super Admin',
      'superadmin',
      'razibmahmud50@gmail.com',
      hashedPassword,
      '01700000000',
      'superadmin'
    ]);

    // Create admin user
    await AppDataSource.query(`
      INSERT INTO "user" ("fullName", "username", "email", "password", "mobile", "role", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `, [
      'Admin User',
      'admin',
      'admin@example.com',
      hashedPassword,
      '01900000000',
      'admin'
    ]);

    // Create test user
    await AppDataSource.query(`
      INSERT INTO "user" ("fullName", "username", "email", "password", "mobile", "role", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `, [
      'Test User',
      'testuser',
      'user@example.com',
      hashedPassword,
      '01800000000',
      'user'
    ]);

    console.log('✅ Successfully seeded initial users:');
    console.log('  - Super Admin: razibmahmud50@gmail.com / 01700000000 (password: superadmin)');
    console.log('  - Admin: testadmin@example.com / 01900000000 (password: aaaaa)');
    console.log('  - Test User: user@example.com / 01800000000 (password: 12345)');

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