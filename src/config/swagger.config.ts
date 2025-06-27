// src/swagger/swagger.config.ts
import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task management',
      version: '1.0.0',
      description: 'API documentation for task management',
    },
    servers: [{ url: process.env.SWAGGER_URL }],
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [ './src/docs/*.ts'], // Adjust paths as necessary

};
