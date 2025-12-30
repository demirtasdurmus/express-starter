import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../env';
import { apiConfig } from '../config';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: apiConfig.title,
      version: apiConfig.version,
      description: `API documentation for ${apiConfig.title}`,
    },
    servers: [
      {
        url: `http://${env.HOST}:${env.PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
});
