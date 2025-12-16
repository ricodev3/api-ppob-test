const pool = require('./db').pool;

async function seedData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Seeding sample data...');
    
    // Insert sample banners
    await client.query(`
      INSERT INTO banners (banner_name, banner_image, description) VALUES
      ('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
      ('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
      ('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
      ('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
      ('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
      ('Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet')
      ON CONFLICT DO NOTHING;
    `);
    
    // Insert sample services
    await client.query(`
      INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES
      ('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
      ('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
      ('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
      ('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
      ('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
      ('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
      ('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
      ('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
      ('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
      ('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000),
      ('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000),
      ('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000)
      ON CONFLICT (service_code) DO NOTHING;
    `);
    
    // Create a test user (password: test1234)
    await client.query(`
      INSERT INTO users (email, password, first_name, last_name, balance) VALUES
      ('test@example.com', '$2b$10$YourHashedPasswordHere', 'Test', 'User', 1000000)
      ON CONFLICT (email) DO NOTHING;
    `);
    
    await client.query('COMMIT');
    console.log('✅ Sample data seeded successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedData };