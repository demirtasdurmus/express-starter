import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../utils/error';
import { apiConfig } from '../config';

export const apiRateLimiter = rateLimit({
  ...apiConfig.apiRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, _next) => {
    throw new TooManyRequestsError('Too many requests from this IP, please try again later.');
  },
});
