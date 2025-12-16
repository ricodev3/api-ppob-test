require('dotenv').config();

// PORT 
const PORT = process.env.PORT || 3000;


const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const path = require('path'); // ✅ ADD THIS
const fs = require('fs'); // ✅ ADD THIS

const app = express();

app.use(express.json());

// ✅ IMPROVED: Dynamic upload directory for Railway
// Determine the correct upload directory based on environment
const uploadDir = process.env.NODE_ENV === 'production' 
  ? '/tmp/uploads'  // Railway uses /tmp for ephemeral storage
  : 'src/uploads';  // Local development

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Created upload directory: ${uploadDir}`);
}

// ✅ Serve static files from the dynamic upload directory
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

