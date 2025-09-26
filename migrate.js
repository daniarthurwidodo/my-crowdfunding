#!/usr/bin/env node

/**
 * Database migration script
 * This script pushes the schema to PostgreSQL using Drizzle Kit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting database migration...');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Please copy .env.example to .env and configure it.');
    process.exit(1);
}

try {
    // Run drizzle-kit push
    console.log('📡 Pushing schema to database...');
    execSync('npx drizzle-kit push', {
        stdio: 'inherit',
        cwd: __dirname
    });

    console.log('✅ Database migration completed successfully!');
    console.log('');
    console.log('🎉 Your database is ready!');
    console.log('   You can now run: npm run dev');

} catch (error) {
    console.error('❌ Database migration failed:', error.message);
    console.log('');
    console.log('🔍 Troubleshooting:');
    console.log('   1. Make sure PostgreSQL is running');
    console.log('   2. Check your DATABASE_URL in .env');
    console.log('   3. Verify database credentials');
    process.exit(1);
}