import { readFileSync } from 'node:fs';

import { env, isProductionLike } from '@/env';
import type { TLanguage } from '@/types';

export const apiConfig = {
  title: 'Express Starter API',
  version: JSON.parse(readFileSync('package.json', 'utf8'))?.version || '1.0.0',
  requestBodyLimit: '10mb',
  trustedCloudflareProxy: true, // Set it to false if your server is not behind Cloudflare Proxy
  rateLimit: {
    global: {
      windowMs: 15 * 60 * 1000,
      max: isProductionLike ? 300 : 3000,
    },
    api: {
      windowMs: 15 * 60 * 1000,
      max: isProductionLike ? 100 : 1000,
    },
  },
  cors: {
    allowedOrigins: env.CORS_ORIGIN
      ? env.CORS_ORIGIN?.split(',').map((o) => o.trim())
      : isProductionLike
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
    /**
     * Add Vary: Cookie header for responses that differ by language cookie
     * Note: This fragments cache. For better cache performance, consider URL-based i18n
     * (e.g., /en/products, /tr/products) which provides:
     * - Deterministic URLs for CDN caching
     * - Better SEO with hreflang tags
     * - No Vary: Cookie header fragmentation
     */
    addVaryHeader: false,
  },
  cache: {
    staticMaxAge: 86400, // 1 day
    apiDefault: 'private, no-cache',
    health: 'no-cache',
    swagger: 'public, max-age=3600',
  },
  timeout: {
    request: 30000,
  },
  internalSkipPaths: ['/health', '/__webpack_hmr'] as string[],
  apiDocs: {
    v1: {
      devURL: `http://localhost:${env.PORT}/api/v1`,
      prodURL: 'https://express-starter.durmusdemirtas.com/api/v1',
    },
  },
} as const;
