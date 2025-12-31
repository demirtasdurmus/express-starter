import pino from 'pino';
import { env } from '../env';
import { apiConfig } from '../config';

/**
 * Structured logger using Pino
 * @see https://github.com/pinojs/pino/blob/main/docs/api.md
 */
export const logger = pino({
  enabled: env.NODE_ENV !== 'test',
  level: apiConfig.isProdLikeEnvironment ? 'info' : 'debug',
  base: apiConfig.isProdLikeEnvironment
    ? {
        service: apiConfig.title,
        env: env.NODE_ENV,
        version: apiConfig.version,
      }
    : {},
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: apiConfig.isProdLikeEnvironment
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          colorize: true,
          singleLine: true,
        },
      },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.token',
      'user.email',
      'user.password',
      'res.headers["set-cookie"]',
    ],
    censor: '[REDACTED]',
  },
  formatters: {
    level(label: string) {
      return { level: label };
    },
  },
});
