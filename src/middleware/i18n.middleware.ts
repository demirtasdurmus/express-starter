import i18nextHttpMiddleware from 'i18next-http-middleware';
import i18nextFsBackend from 'i18next-fs-backend';
import i18next from 'i18next';
import path from 'node:path';
import { apiConfig } from '../config';

/**
 * @see https://www.i18next.com/
 * @see https://www.npmjs.com/package/i18next-fs-backend
 * @see https://www.npmjs.com/package/i18next-http-middleware
 */

const { i18n: i18Config } = apiConfig;

/**
 * Initialize i18next with file system backend and HTTP middleware
 * This sets up language detection from query params, cookies, and Accept-Language header
 */
i18next
  .use(i18nextFsBackend)
  .use(i18nextHttpMiddleware.LanguageDetector)
  .init({
    supportedLngs: i18Config.supportedLanguages,
    fallbackLng: i18Config.defaultLanguage,
    preload: i18Config.supportedLanguages,
    backend: {
      loadPath: `${path.resolve(process.cwd(), 'locales')}/{{lng}}/{{ns}}.json`,
    },
    ns: [i18Config.ns],
    defaultNS: i18Config.ns,
    detection: {
      order: ['querystring', 'cookie', 'header'],
      lookupQuerystring: i18Config.queryParameter,
      lookupCookie: i18Config.cookieName,
      lookupHeader: 'accept-language',
      caches: ['cookie'],
      cookieOptions: {
        path: '/',
        httpOnly: false,
        maxAge: i18Config.cookieMaxAge,
        sameSite: 'lax' as const,
      },
    },
    interpolation: {
      escapeValue: false, // Not needed for API responses
    },
    saveMissing: false,
    initAsync: false,
  });

/**
 * i18n middleware that attaches translation function to request
 * This middleware must be placed after cookie-parser and before routes
 */
export const i18nMiddleware = i18nextHttpMiddleware.handle(i18next, {
  ignoreRoutes: ['/health', '/api-docs'],
  removeLngFromUrl: false,
});

export { i18next };
