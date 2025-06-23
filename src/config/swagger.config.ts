// src/swagger/swagger.config.ts
import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin/User Auth API',
      version: '1.0.0',
      description: 'API documentation for admin and user authentication',
    },
    servers: [{ url: process.env.SWAGGER_URL }],
    components: {
      securitySchemes: {
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
