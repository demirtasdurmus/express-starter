import { readFileSync } from 'node:fs';
import { TLanguage } from '../types';
import { env } from '../env';

export const apiConfig = {
  title: 'Express Starter API',
  version: JSON.parse(readFileSync('package.json', 'utf8'))?.version || '1.0.0',
  requestBodyLimit: '10mb',
  isProdLikeEnvironment: env.NODE_ENV === 'production',
  /**
   * Trust proxy configuration for correctly identifying client IPs
   * - Number: Specifies exact number of proxy hops (e.g., 1 for nginx, 2 for ALB + CloudFront)
   * - true: Trust all proxies (use with caution, less secure)
   * Configure via TRUST_PROXY_HOPS environment variable
   * @see https://expressjs.com/en/guide/behind-proxies.html
   */
  trustProxy: env.TRUST_PROXY_HOPS,
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
} as const;
