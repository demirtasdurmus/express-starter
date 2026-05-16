import { ParseKeys } from 'i18next';
import expressRateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../lib/error';
import { apiConfig } from '../config';

export const rateLimit = expressRateLimit({
  ...apiConfig.apiRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, _next) => {
    throw new TooManyRequestsError('samples.toManyRequests' satisfies ParseKeys);
  },
});
