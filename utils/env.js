function getServerUrl() {
  // 1. Render provides this automatically
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL;
  }
  
  // 2. Local development or custom URL
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  
  // 3. Default localhost
  return `http://localhost:${process.env.PORT || 3000}`;
}

function getDatabaseUrl() {
  // Priority 1: SUPABASE_DB_URL (your current setup)
  if (process.env.SUPABASE_DB_URL) {
    return process.env.SUPABASE_DB_URL;
  }
  
  // Priority 2: DATABASE_URL (Render PostgreSQL)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Priority 3: LOCAL_DB_URL for local dev
  if (process.env.LOCAL_DB_URL) {
    return process.env.LOCAL_DB_URL;
  }
  
  throw new Error('Database URL not configured. Set SUPABASE_DB_URL, DATABASE_URL, or LOCAL_DB_URL');
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'your-super-secret-jwt-key-change-this') {
    throw new Error('JWT_SECRET not properly configured. Please set a secure secret.');
  }
  return secret;
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function isDevelopment() {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

module.exports = {
  getServerUrl,
  getDatabaseUrl,
  getJwtSecret,
  isProduction,
  isDevelopment,
  port: process.env.PORT || 3000
};