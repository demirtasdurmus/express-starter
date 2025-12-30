import { Router } from 'express';
import { sampleController } from '../controllers/sample.controller';

const router = Router()
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
   *                     - message
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Hello, World!"
   */
  .get('/', sampleController);

export { router as sampleRoutes };
