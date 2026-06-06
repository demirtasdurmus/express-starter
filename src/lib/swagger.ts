import swaggerJsdoc from 'swagger-jsdoc';

import { apiConfig } from '@/config';
import { isProductionLike } from '@/env';

const devServer = {
  url: apiConfig.apiDocs.devURL,
};

const productionServer = {
  url: apiConfig.apiDocs.prodURL,
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
