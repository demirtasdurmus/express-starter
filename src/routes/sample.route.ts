import { Router } from 'express';
import { sample } from '../middleware/sample.middleware';
import { sampleController } from '../controllers/sample.controller';

const router = Router();

router.get('/', sample, sampleController);

export { router as sampleRoutes };
