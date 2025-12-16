// Validate environment variables
require('dotenv').config();

const requiredVars = ['JWT_SECRET', 'SUPABASE_DB_URL'];
const optionalVars = ['NODE_ENV', 'PORT', 'API_URL', 'LOCAL_DB_URL'];

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;

// Check required variables
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`❌ Required variable ${varName} is not set`);
    hasErrors = true;
  } else if (process.env[varName].includes('change-this') || process.env[varName].includes('example')) {
    console.warn(`⚠️  Variable ${varName} appears to have default value: ${process.env[varName].substring(0, 20)}...`);
  } else {
    console.log(`✅ ${varName} is set`);
  }
}

// Check optional variables
console.log('\n📋 Optional variables:');
for (const varName of optionalVars) {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName}: ${varName === 'JWT_SECRET' || varName.includes('PASSWORD') ? '***hidden***' : process.env[varName]}`);
  }
}

// Database URL check
if (process.env.SUPABASE_DB_URL) {
  if (process.env.SUPABASE_DB_URL.includes('xxxxxx') || process.env.SUPABASE_DB_URL.includes('password')) {
    console.error('\n❌ SUPABASE_DB_URL appears to have placeholder values. Please update it.');
    hasErrors = true;
  } else {
    console.log('\n✅ Database URL looks valid');
  }
}

// JWT secret check
if (process.env.JWT_SECRET) {
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('\n⚠️  JWT_SECRET is shorter than 32 characters. Consider using a longer secret.');
  }
  if (process.env.JWT_SECRET === 'supersecretkey' || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this') {
    console.error('\n❌ JWT_SECRET has default value. Please change it for security.');
    hasErrors = true;
  }
}

console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('❌ Environment validation failed. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('✅ All environment variables are properly configured!');
  process.exit(0);
}