import swaggerJsdoc from 'swagger-jsdoc';

import { apiConfig } from '@/config';
import { isProductionLike } from '@/env';

const devServer = {
  url: apiConfig.apiDocs.v1.devURL,
  description: 'Development server V1',
};

const productionServer = {
  url: apiConfig.apiDocs.v1.prodURL,
  description: 'Production server V1',
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
  apis: ['./src/routes/**/*.ts', './src/controllers/*.ts', './dist/*.mjs', './dist/*.cjs'],
});
