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
        BearerAuth: {
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

module.exports = swaggerJSDoc(options);
