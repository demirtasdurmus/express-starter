import { Router } from 'express';
import {
  createSampleRequestBodySchema,
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
 *     summary: Get a greeting message
 *     tags: [Samples]
 *     description: Returns a simple greeting message
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - payload
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payload:
 *                   type: object
 *                   required:
 *                     - samples
 *                   properties:
 *                     samples:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                           name:
 *                             type: string
 *                             example: "Sample 1"
 */

router.get('/', getSamplesController);

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
 *                 - success
 *                 - payload
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payload:
 *                   type: object
 *                   required:
 *                     - sample
 *                   properties:
 *                     sample:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *                         name:
 *                           type: string
 *                           example: "Sample 1"
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
 *                 - success
 *                 - payload
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payload:
 *                   type: object
 *                   required:
 *                     - sample
 *                   properties:
 *                     sample:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *                         name:
 *                           type: string
 *                           example: "Sample 1"
 *       404:
 *         description: Sample not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - error
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   required:
 *                     - name
 *                     - statusCode
 *                     - message
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "NotFoundError"
 *                     statusCode:
 *                       type: number
 *                       example: 404
 *                     message:
 *                       type: string
 *                       example: "Sample not found"
 * */
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
 *                 - success
 *                 - payload
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payload:
 *                   type: object
 *                   required:
 *                     - sample
 *                   properties:
 *                     sample:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *                         name:
 *                           type: string
 *                           example: "Sample 1"
 *       404:
 *         description: Sample not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - error
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   required:
 *                     - name
 *                     - statusCode
 *                     - message
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "NotFoundError"
 *                     statusCode:
 *                       type: number
 *                       example: 404
 *                     message:
 *                       type: string
 *                       example: "Sample not found"
 * */
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
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Sample not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - error
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   required:
 *                     - name
 *                     - statusCode
 *                     - message
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "NotFoundError"
 *                     statusCode:
 *                       type: number
 *                       example: 404
 *                     message:
 *                       type: string
 *                       example: "Sample not found"
 * */
router.delete(
  '/:id',
  validate({ validationMap: 'params', schema: sampleIdParamsSchema }),
  deleteSampleByIdController,
);

export { router as sampleRoutes };
