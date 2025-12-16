require('dotenv').config();

// PORT 
const PORT = process.env.PORT || 3000;


const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const path = require('path'); 
const fs = require('fs'); 

const app = express();

app.use(express.json());

// Determine upload directory (same logic as upload.js)
const uploadDir = process.env.NODE_ENV === 'production' 
  ? '/tmp/uploads'
  : path.join(__dirname, 'src/uploads');

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));

// ✅ ADD Swagger UI options for better token handling
const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true, // Save token across browser refreshes
    docExpansion: 'none', // Keep docs collapsed for cleaner view
  },
  customCss: '.swagger-ui .topbar { display: none }', // Optional: cleaner UI
};

app.use('/uploads', express.static('src/uploads'));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/profileRoute'));
app.use('/api', require('./routes/bannerRoute'));
app.use('/api', require('./routes/serviceRoute'));
app.use('/api', require('./routes/balanceRoute'));
app.use('/api', require('./routes/topupRoute'));
app.use('/api', require('./routes/transactionRoute'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,swaggerOptions));


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uploadDir: uploadDir, 
    apiUrl: process.env.API_URL || 'Not set'
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
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`🔗 API URL: ${process.env.API_URL || 'Not set in env'}`);
});

