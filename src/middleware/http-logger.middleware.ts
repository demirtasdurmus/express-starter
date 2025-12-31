import { pinoHttp } from 'pino-http';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger';
import { apiConfig } from '../config';

/**
 * HTTP logger middleware with request ID generation
 * Uses pino-http for production, simple logger for development
 */
export function httpLogger({
  skipPaths,
}: {
  skipPaths?: string[];
} = {}): RequestHandler {
  return apiConfig.isProdLikeEnvironment
    ? pinoHttp({
        logger,
        genReqId: (_req: Request, res: Response) => {
          const id = randomUUID();
          res.setHeader('X-Request-ID', id);
          return id;
        },
        customLogLevel: (req, res, err) => {
          if (skipPaths?.some((path) => req.url?.includes(path))) return 'debug';
          if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
          if (res.statusCode >= 500 || err) return 'error';
          return 'info';
        },
        customProps: (_req: Request, res: Response) => {
          return {
            error: res.locals?.error,
          };
        },
      })
    : devHttpLogger;
}

/**
 * Simple development HTTP logger with request ID
 */
function devHttpLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const requestId = randomUUID();

  res.setHeader('X-Request-ID', requestId);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;

    const logData = {
      requestId,
      method,
      url,
      status,
      duration,
      error: res.locals?.error,
    };

    if (status >= 500) {
      logger.error(logData, `${method} ${url} - ${status} (${duration}ms)`);
    } else if (status >= 400) {
      logger.warn(logData, `${method} ${url} - ${status} (${duration}ms)`);
    } else {
      logger.info(logData, `${method} ${url} - ${status} (${duration}ms)`);
    }
  });

  next();
}
