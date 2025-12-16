const pool = require('./db').pool;

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Creating UUID extension if not exists...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Drop existing tables in correct order
    console.log('Dropping existing tables...');
    await client.query('DROP TABLE IF EXISTS transactions CASCADE');
    await client.query('DROP TABLE IF EXISTS services CASCADE');
    await client.query('DROP TABLE IF EXISTS banners CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    
    // Create users table
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        profile_image TEXT,
        balance BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create banners table
    console.log('Creating banners table...');
    await client.query(`
      CREATE TABLE banners (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        banner_name VARCHAR(100),
        banner_image TEXT,
        description TEXT
      );
    `);
    
    // Create services table
    console.log('Creating services table...');
    await client.query(`
      CREATE TABLE services (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        service_code VARCHAR(20) UNIQUE,
        service_name VARCHAR(100),
        service_icon TEXT,
        service_tariff BIGINT
      );
    `);
    
    // Create transactions table
    console.log('Creating transactions table...');
    await client.query(`
      CREATE TABLE transactions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        invoice_number VARCHAR(50),
        transaction_type VARCHAR(10),
        description VARCHAR(100),
        total_amount BIGINT,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX idx_transactions_created_on ON transactions(created_on);
    `);
    
    await client.query('COMMIT');
    console.log('✅ Database tables created successfully with UUID!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runMigrations };