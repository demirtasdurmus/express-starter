import { readFileSync } from 'node:fs';
import { TLanguage } from '../types';
import { env } from '../env';

export const apiConfig = {
  title: 'Express Starter API',
  version: JSON.parse(readFileSync('package.json', 'utf8'))?.version || '1.0.0',
  requestBodyLimit: '10mb',
  isProdLikeEnvironment: env.NODE_ENV === 'production',
  apiRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: env.NODE_ENV === 'production' ? 100 : 1000,
  },
  cors: {
    allowedOrigins: env.CORS_ORIGIN
      ? env.CORS_ORIGIN?.split(',').map((o) => o.trim())
      : env.NODE_ENV === 'production'
        ? []
        : [`http://${env.HOST}:${env.PORT}`],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  i18n: {
    ns: 'translation',
    defaultLanguage: 'en' satisfies TLanguage,
    supportedLanguages: ['en', 'tr'] satisfies TLanguage[],
    cookieName: 'lang',
    queryParameter: 'lang',
    cookieMaxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
  },
} as const;
