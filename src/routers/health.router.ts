import { Router } from 'express';
import { getHealthController } from '../controllers/health.controller';

const router = Router().get('/', getHealthController);

export { router as healthRoutes };
