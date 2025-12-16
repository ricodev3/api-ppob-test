const swaggerJSDoc = require('swagger-jsdoc');
const { getServerUrl } = require('../utils/env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Contract SIMS PPOB',
      version: '1.0.0',
      description: 'API Documentation for Membership, Services, Transaction & Balance'
    },
    servers: [
      {
        url: getServerUrl(),
        description: `${process.env.NODE_ENV} server`,
      },
      
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};

// Add custom JavaScript for auto-authorization
swaggerSpec.customJs = `
// Auto-authorize after login
function autoAuthorizeWithToken(token) {
  if (!token) return;
  
  // Set in Swagger UI
  ui.authActions.authorize({
    bearerAuth: {
      name: 'bearerAuth',
      schema: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      value: token
    }
  });
  
  // Store in localStorage for page refreshes
  localStorage.setItem('swagger_token', token);
  console.log('✅ Token auto-authorized:', token.substring(0, 30) + '...');
}

// Check for token on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedToken = localStorage.getItem('swagger_token');
  if (savedToken) {
    setTimeout(() => autoAuthorizeWithToken(savedToken), 1000);
  }
  
  // Monitor login responses
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    
    // Clone response to read body
    const clone = response.clone();
    
    // Check if it's a login response
    if (args[0] && args[0].includes('/api/login') && response.ok) {
      clone.json().then(data => {
        if (data.data && data.data.token) {
          autoAuthorizeWithToken(data.data.token);
        }
      });
    }
    
    return response;
  };
});

// Expose function to console for manual use
window.autoAuthorize = function(token) {
  autoAuthorizeWithToken(token);
};
`;


module.exports = swaggerJSDoc(options);
