import { RequestHandler } from 'express';
import { logger } from '../utils/logger';

export const httpLogger: RequestHandler = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;

    const message = `${ip} - ${method} ${url} - ${status} (${duration}ms)`;

    if (status >= 500) {
      logger.error({ error: res.locals?.error }, message);
    } else if (status >= 400) {
      logger.warn({ error: res.locals?.error }, message);
    } else {
      logger.info(message);
    }
  });

  next();
};
