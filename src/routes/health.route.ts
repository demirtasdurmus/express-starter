import { Router } from 'express';
import { getHealthController } from '../controllers/health.controller';

// Health check endpoint - infrastructure endpoint, not part of API docs
const router = Router().get('/', getHealthController);

export { router as healthRoutes };
