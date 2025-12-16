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



// ✅ THIRD: Use PORT variable (now it's defined)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

