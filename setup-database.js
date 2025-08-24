#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up database for Finder API...\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
    console.log('⚠️  .env file not found. Creating a sample .env file...');
    const sampleEnv = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=12345
DB_NAME=Finder

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
`;
    fs.writeFileSync('.env', sampleEnv);
    console.log('✅ Sample .env file created. Please update it with your database credentials.\n');
}

try {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('\n🏗️  Building the project...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('\n🗄️  Running database migrations...');
    execSync('npm run migration:run', { stdio: 'inherit' });

    console.log('\n🌱 Seeding initial data...');
    execSync('npm run seed', { stdio: 'inherit' });

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📋 Default accounts created:');
    console.log('  🔑 Super Admin: razibmahmud50@gmail.com / 01700000000 (password: 123456)');
    console.log('  🔑 Admin: admin@example.com / 01900000000 (password: 123456)');
    console.log('  🔑 Test User: user@example.com / 01800000000 (password: 123456)');
    console.log('\n🚀 You can now start the application with: npm run dev');

} catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Manual setup steps:');
    console.log('  1. Make sure PostgreSQL is running');
    console.log('  2. Update .env file with correct database credentials');
    console.log('  3. Create the database: CREATE DATABASE "Finder";');
    console.log('  4. Run: npm run build');
    console.log('  5. Run: npm run migration:run');
    console.log('  6. Run: npm run seed');
    process.exit(1);
}