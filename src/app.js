require('dotenv').config();

// ✅ SECOND: Define PORT with fallback
const PORT = process.env.PORT || 3000;


const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

app.use(express.json());

app.use('/uploads', express.static('src/uploads'));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/profileRoute'));
app.use('/api', require('./routes/bannerRoute'));
app.use('/api', require('./routes/serviceRoute'));
app.use('/api', require('./routes/balanceRoute'));
app.use('/api', require('./routes/topupRoute'));
app.use('/api', require('./routes/transactionRoute'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Root redirect to docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Add this route for debugging
app.get('/debug-token', (req, res) => {
  const auth = req.headers.authorization;
  
  console.log('=== TOKEN DEBUG ===');
  console.log('Authorization header:', auth);
  
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.json({ error: 'No Bearer token provided' });
  }
  
  const token = auth.split(' ')[1];
  console.log('Token length:', token.length);
  console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
  
  // Check JWT_SECRET
  console.log('JWT_SECRET exists?', !!process.env.JWT_SECRET);
  console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token VALID');
    console.log('Decoded:', decoded);
    
    return res.json({
      valid: true,
      decoded: decoded,
      issued_at: new Date(decoded.iat * 1000).toISOString(),
      expires_at: new Date(decoded.exp * 1000).toISOString(),
      expires_in_seconds: decoded.exp - Math.floor(Date.now() / 1000)
    });
    
  } catch (error) {
    console.log('❌ Token INVALID');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    
    return res.json({
      valid: false,
      error: error.message,
      error_name: error.name,
      suggestion: getSuggestion(error)
    });
  }
  
  function getSuggestion(err) {
    if (err.name === 'JsonWebTokenError') return 'JWT_SECRET mismatch or malformed token';
    if (err.name === 'TokenExpiredError') return 'Token expired, login again';
    return 'Unknown error';
  }
});

// ✅ THIRD: Use PORT variable (now it's defined)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

