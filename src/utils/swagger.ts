import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../env';
import { apiConfig } from '../config';

const devServer = {
  url: `http://localhost:${env.PORT}`,
};

const productionServer = {
  url: `https://express-template.durmusdemirtas.com`,
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
  apis: ['./dist/routes/*.js', './dist/controllers/*.js'],
});
