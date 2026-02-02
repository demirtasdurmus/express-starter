import { RequestHandler } from 'express';
import { THealthResponse } from '../types/health';
import { apiConfig } from '../config';

export const getHealthController: RequestHandler<unknown, THealthResponse> = (_req, res) => {
  res.status(200).json({
    timestamp: new Date().toISOString(),
    version: apiConfig.version,
  });
};
