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
app.use('/api-docs', swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      // Enable try-it-out by default
      tryItOutEnabled: true,
      // Auto submit requests
      requestSnippetsEnabled: true,
      // Custom JavaScript from swaggerSpec
      onComplete: function() {
        // This runs after Swagger UI loads
        console.log('Swagger UI loaded - auto-auth ready');
        
        // Check URL for token parameter
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
          window.autoAuthorize(tokenFromUrl);
        }
      }
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation'
  })
);


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

