import { Router } from 'express';

import { sampleRouter } from './sample.routes';

const router = Router();

router.use('/samples', sampleRouter);

export { router as v1Router };
