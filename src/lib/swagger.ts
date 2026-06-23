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
    components: {
      schemas: {
        ProblemDetail: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'about:blank' },
            status: { type: 'integer', example: 404 },
            title: { type: 'string', example: 'NOT_FOUND' },
            detail: { type: 'string', example: 'Sample not found' },
            instance: {
              type: 'string',
              example: '/api/v1/samples/123e4567-e89b-12d3-a456-426614174000',
            },
          },
        },
        ValidationError: {
          allOf: [
            { $ref: '#/components/schemas/ProblemDetail' },
            {
              type: 'object',
              properties: {
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string', example: 'name' },
                      message: { type: 'string', example: 'Name is required' },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/*.ts', './dist/*.mjs', './dist/*.cjs'],
});
