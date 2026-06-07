import type { RequestHandler } from 'express';

import { apiConfig } from '@/config';
import type { THealthResponse } from '@/types/health';

export const getHealthController: RequestHandler<unknown, THealthResponse> = (_req, res) => {
  res.status(200).json({
    timestamp: new Date().toISOString(),
    version: apiConfig.version,
  });
};
