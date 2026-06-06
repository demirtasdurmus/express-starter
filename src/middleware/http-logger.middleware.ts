import { pinoHttp } from 'pino-http';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { randomUUID } from 'crypto';
import { shouldSkipPath } from '@/utils/should-skip-path';
import { logger } from '@/lib/logger';
import { isProductionLike } from '@/env';

/**
 * HTTP logger middleware with request ID generation
 * - Development: Clean, readable logs for better DX
 * - Production: Structured JSON logs for monitoring
 */
export function httpLogger(): RequestHandler {
  return isProductionLike
    ? pinoHttp({
        logger,
        genReqId: (_req: Request, res: Response) => {
          return generateAndSetRequestId(res);
        },
        autoLogging: {
          ignore: (req: Request) => {
            return shouldSkipPath(req.url);
          },
        },
        customLogLevel: (_req, res, err) => {
          if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
          if (res.statusCode >= 500 || err) return 'error';
          return 'info';
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        customErrorObject: (_req: Request, res: Response, err: Error, loggableObject: any) => {
          return {
            ...loggableObject,
            err: res.locals?.error || err,
          };
        },
      })
    : devHttpLogger();
}

function devHttpLogger() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    const requestId = generateAndSetRequestId(res);

    if (shouldSkipPath(req.url)) {
      return next();
    }

    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const method = req.method;
      const url = req.originalUrl;

      const message = `${method} ${url} → ${status} (${duration}ms)`;

      const logData = {
        requestId,
        ...(res.locals?.error && { error: res.locals.error }),
      };

      if (status >= 500) {
        logger.error(logData, message);
      } else if (status >= 400) {
        logger.warn(logData, message);
      } else {
        logger.info(logData, message);
      }
    });

    next();
  };
}

function generateAndSetRequestId(res: Response) {
  const requestId = randomUUID();
  res.setHeader('X-Request-ID', requestId);
  return requestId;
}
