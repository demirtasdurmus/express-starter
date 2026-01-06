import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../env';
import { apiConfig } from '../config';

const devServer = {
  url: `http://${env.HOST}:${env.PORT}`,
  description: 'Development server',
};

const productionServer = {
  url: `https://express-template.durmusdemirtas.com`,
  description: 'Production server',
};

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: apiConfig.title,
      version: apiConfig.version,
      description: `API documentation for ${apiConfig.title}`,
    },
    servers: [apiConfig.isProdLikeEnvironment ? productionServer : devServer],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
});
