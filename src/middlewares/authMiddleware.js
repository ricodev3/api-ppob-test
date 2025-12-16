const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  console.log('🔐 Auth Middleware triggered - Path:', req.path);
  
  const auth = req.headers.authorization;
  console.log('🔐 Authorization header:', auth ? auth.substring(0, 50) + '...' : 'NOT FOUND');

  // 1. Check if Authorization header exists
  if (!auth) {
    console.log('❌ No Authorization header provided');
    return res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null
    });
  }

  // 2. Check if it starts with 'Bearer '
  if (!auth.startsWith('Bearer ')) {
    console.log('❌ Invalid Authorization format. Expected: "Bearer <token>"');
    console.log('❌ Received:', auth.substring(0, 30));
    return res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null
    });
  }

  // 3. Extract token
  const token = auth.split(' ')[1];
  console.log('🔐 Token extracted (first 30 chars):', token.substring(0, 30) + '...');
  console.log('🔐 Full token length:', token.length);

  // 4. CRITICAL: Check if JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    console.error('❌ CRITICAL ERROR: JWT_SECRET environment variable is not set!');
    console.error('❌ Check Railway environment variables');
    return res.status(500).json({
      status: 1,
      message: 'Konfigurasi server tidak lengkap',
      data: null
    });
  }
  
  console.log('🔑 JWT_SECRET is set (length:', process.env.JWT_SECRET.length + ')');

  try {
    // 5. Verify token with better error handling
    console.log('🔍 Verifying JWT token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ Token valid!');
    console.log('✅ Decoded payload:', decoded);
    console.log('✅ Token issued at:', new Date(decoded.iat * 1000).toISOString());
    console.log('✅ Token expires at:', new Date(decoded.exp * 1000).toISOString());
    
    // 6. Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      console.log('❌ Token expired! Current time:', now, 'Expiry:', decoded.exp);
      return res.status(401).json({
        status: 108,
        message: 'Token telah kadaluarsa',
        data: null
      });
    }

    // 7. Attach user to request
    req.user = {
      user_id: decoded.user_id,  // Make sure this matches your JWT payload
      email: decoded.email
    };
    
    console.log('✅ User authenticated:', req.user.email);
    next();
    
  } catch (error) {
    // 8. Detailed error messages
    console.error('❌ JWT Verification failed!');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    
    let message = 'Token tidak tidak valid atau kadaluwarsa';
    
    if (error.name === 'JsonWebTokenError') {
      message = 'Format token tidak valid - ' + error.message;
    } else if (error.name === 'TokenExpiredError') {
      message = 'Token telah kadaluarsa';
    } else if (error.name === 'NotBeforeError') {
      message = 'Token belum aktif';
    }
    
    return res.status(401).json({
      status: 108,
      message: message,
      data: null
    });
  }
};