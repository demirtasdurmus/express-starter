import { Router } from 'express';
import { testController } from '../controllers/testControllers';
import { testMiddleware } from '../middlewares/testMiddleware';
const router = Router();

router.get('/', testMiddleware, testController);

export { router as testRoutes };
