import type { ValueDeterminingMiddleware } from 'express-rate-limit';
import expressRateLimit, { ipKeyGenerator } from 'express-rate-limit';

import { apiConfig } from '@/config';
import { TooManyRequestsError } from '@/lib/error';
import { shouldSkipPath } from '@/utils/should-skip-path';

const keyGenerator: ValueDeterminingMiddleware<string> = (req) => {
  const cfConnectingIp = req.headers['cf-connecting-ip'];

  if (
    apiConfig.trustedCloudflareProxy &&
    typeof cfConnectingIp === 'string' &&
    cfConnectingIp.trim()
  ) {
    return ipKeyGenerator(cfConnectingIp);
  }

  const fallbackIp = req.ip || req.socket.remoteAddress;

  if (fallbackIp) {
    return ipKeyGenerator(fallbackIp);
  }

  return 'unknown';
};

export const globalRateLimit = expressRateLimit({
  ...apiConfig.globalRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  skip: (req) => shouldSkipPath(req.url),
  handler: (_req, _res, _next) => {
    throw new TooManyRequestsError('samples.toManyRequests');
  },
});

export const apiRateLimit = expressRateLimit({
  ...apiConfig.apiRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: (_req, _res, _next) => {
    throw new TooManyRequestsError('samples.toManyRequests');
  },
});
