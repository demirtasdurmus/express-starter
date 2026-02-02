import { Router } from 'express';
import {
  createSampleRequestBodySchema,
  getSamplesQuerySchema,
  sampleIdParamsSchema,
  updateSampleRequestBodySchema,
} from '../schemas/sample.schema';
import { validate } from '../middleware/validate.middleware';
import {
  createSampleController,
  deleteSampleByIdController,
  getSampleByIdController,
  getSamplesController,
  updateSampleByIdController,
} from '../controllers/sample.controller';

const router = Router();

/**
 * @swagger
 * /api/samples:
 *   get:
 *     summary: Get samples
 *     tags: [Samples]
 *     description: Returns samples with pagination
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           example: 10
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - page
 *                 - totalPages
 *                 - totalCount
 *                 - samples
 *               properties:
 *                 page:
 *                   type: number
 *                   example: 1
 *                 totalPages:
 *                   type: number
 *                   example: 10
 *                 totalCount:
 *                   type: number
 *                   example: 100
 *                 samples:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       name:
 *                         type: string
 *                         example: "Sample 1"
 */
router.get(
  '/',
  validate({ validationMap: 'query', schema: getSamplesQuerySchema }),
  getSamplesController,
);

/**
 * @swagger
 * /api/samples:
 *   post:
 *     summary: Create a sample
 *     tags: [Samples]
 *     description: Creates a new sample
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sample 1"
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *                 - name
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Sample 1"
 */
router.post(
  '/',
  validate({ validationMap: 'body', schema: createSampleRequestBodySchema }),
  createSampleController,
);

/**
 * @swagger
 * /api/samples/{id}:
 *   get:
 *     summary: Get a sample by ID
 *     tags: [Samples]
 *     description: Returns a sample by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *                 - name
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Sample 1"
 */
router.get(
  '/:id',
  validate({ validationMap: 'params', schema: sampleIdParamsSchema }),
  getSampleByIdController,
);

/**
 * @swagger
 * /api/samples/{id}:
 *   patch:
 *     summary: Update a sample by ID
 *     tags: [Samples]
 *     description: Updates a sample by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sample 1"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *                 - name
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Sample 1"
 */
router.patch(
  '/:id',
  validate({ validationMap: 'params', schema: sampleIdParamsSchema }),
  validate({ validationMap: 'body', schema: updateSampleRequestBodySchema }),
  updateSampleByIdController,
);

/**
 * @swagger
 * /api/samples/{id}:
 *   delete:
 *     summary: Delete a sample by ID
 *     tags: [Samples]
 *     description: Deletes a sample by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       204:
 *         description: No content
 */
router.delete(
  '/:id',
  validate({ validationMap: 'params', schema: sampleIdParamsSchema }),
  deleteSampleByIdController,
);

export { router as sampleRoutes };
