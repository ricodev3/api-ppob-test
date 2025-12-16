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

const swaggerOptions = {
  swaggerOptions: {
    defaultModelsExpandDepth: -1, // Hide schemas/models
    docExpansion: 'none', // Keep sections collapsed
    displayRequestDuration: true,
    persistAuthorization: true,
    // ✅ Force light theme
    syntaxHighlight: {
      theme: 'agate' // Light syntax highlighting
    }
  },
  customCss: `
    /* ✅ FORCE LIGHT MODE */
    .swagger-ui {
      color: #333333;
      background: #ffffff;
    }
    
    /* Hide dark mode elements */
    .swagger-ui .scheme-container {
      background: #f7f7f7;
      border-color: #e4e4e4;
    }
    
    .swagger-ui .opblock {
      background: #fafafa;
      border-color: #e8e8e8;
    }
    
    .swagger-ui .opblock .opblock-summary {
      border-color: #e8e8e8;
    }
    
    .swagger-ui .opblock .opblock-summary:hover {
      background: #f0f0f0;
    }
    
    .swagger-ui .opblock.opblock-post {
      border-color: #49cc90;
      background: rgba(73, 204, 144, .1);
    }
    
    .swagger-ui .opblock.opblock-put {
      border-color: #fca130;
      background: rgba(252, 161, 48, .1);
    }
    
    .swagger-ui .opblock.opblock-get {
      border-color: #61affe;
      background: rgba(97, 175, 254, .1);
    }
    
    .swagger-ui .opblock.opblock-delete {
      border-color: #f93e3e;
      background: rgba(249, 62, 62, .1);
    }
    
    .swagger-ui .info .title {
      color: #3b4151;
    }
    
    .swagger-ui .info li, .swagger-ui .info p, .swagger-ui .info table {
      color: #3b4151;
    }
    
    .swagger-ui .btn {
      background: #f0f0f0;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .swagger-ui .btn:hover {
      background: #e8e8e8;
    }
    
    .swagger-ui input[type=text], 
    .swagger-ui input[type=password], 
    .swagger-ui input[type=search], 
    .swagger-ui textarea {
      background: #fff;
      border: 1px solid #ddd;
      color: #333;
    }
    
    /* Hide schemas/models */
    .swagger-ui section.models { 
      display: none !important; 
    }
    
    .swagger-ui .model-box { 
      display: none !important; 
    }
    
    /* Hide top bar */
    .swagger-ui .topbar { 
      display: none; 
    }
    
    /* Custom styling */
    .swagger-ui .info { 
      margin: 20px 0; 
    }
    
    .swagger-ui .scheme-container {
      margin-top: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
  `,
  customJs: `
    // ✅ Force light mode on page load
    document.addEventListener('DOMContentLoaded', function() {
      // Remove any dark mode classes
      document.body.classList.remove('scheme-dark');
      document.body.classList.add('scheme-light');
      
      // Force light theme
      const html = document.querySelector('html');
      html.style.backgroundColor = '#ffffff';
      html.style.color = '#333333';
      
      // Set theme attribute
      document.body.setAttribute('data-theme', 'light');
    });
  `,
  customSiteTitle: "SIMS PPOB API Documentation"
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

