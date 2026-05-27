import { ParseKeys } from 'i18next';
import expressRateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { TooManyRequestsError } from '../lib/error';
import { apiConfig } from '../config';

export const rateLimit = expressRateLimit({
  ...apiConfig.apiRateLimit,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
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

    return 'unknown'; // Fallback key if no IP can be determined
  },
  handler: (_req, _res, _next) => {
    throw new TooManyRequestsError('samples.toManyRequests' satisfies ParseKeys);
  },
});
