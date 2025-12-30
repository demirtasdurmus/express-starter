import { RequestHandler } from 'express';
import { THealthResponse } from '../types/health';
import { ServerResponse } from '../types';
import { apiConfig } from '../config';

export const getHealthController: RequestHandler<
  unknown,
  ServerResponse<THealthResponse>,
  unknown,
  unknown
> = (_req, res) => {
  res.status(200).json({
    success: true,
    payload: {
      timestamp: new Date().toISOString(),
      version: apiConfig.version,
    },
  });
};
