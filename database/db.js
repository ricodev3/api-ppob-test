const { Pool } = require('pg');
const { getDatabaseUrl } = require('../utils/env');

const connectionString = getDatabaseUrl();

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false  // Required for Supabase
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to Supabase:', err.message);
  } else {
    console.log('✅ Connected to Supabase successfully');
    release();
  }
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  getClient: () => pool.connect()
};