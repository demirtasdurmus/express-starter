import swaggerJsdoc from 'swagger-jsdoc';
import { env, isProductionLike } from '@/env';
import { apiConfig } from '@/config';

const devServer = {
  url: `http://localhost:${env.PORT}`,
};

const productionServer = {
  url: `https://express-starter.durmusdemirtas.com`,
};

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: apiConfig.title,
      version: apiConfig.version,
      description: `API documentation for ${apiConfig.title}`,
    },
    servers: [isProductionLike ? productionServer : devServer],
  },
  apis: [
    './dist/routers/*.js',
    './dist/controllers/*.js',
    './src/routers/*.ts',
    './src/controllers/*.ts',
    // For bundled outputs
    './dist-bundle/*.cjs',
    './dist-bundle/*.mjs',
  ],
});
