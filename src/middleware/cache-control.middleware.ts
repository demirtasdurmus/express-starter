import { RequestHandler, Response } from 'express';
import { isStaticFile } from '../utils/isStaticFile';
import { env } from '../env';
import { apiConfig } from '../config';

export const cacheControl: RequestHandler = (req, res, next) => {
  if (env.NODE_ENV !== 'production') {
    return next();
  }

  /**
   * If the cache control is already set, apply it.
   */
  if (res.locals.cacheControl) {
    applyCacheHeaders(
      res,
      res.locals.cacheControl as string,
      res.locals.vary as string | undefined,
    );
    return next();
  }

  const url = req.url;
  const method = req.method.toUpperCase();

  /**
   * If the request is for the health check, apply the health cache control.
   */
  if (url === '/health' || url.startsWith('/health/')) {
    applyCacheHeaders(res, apiConfig.cache.health);
    return next();
  }

  /**
   * If the request is for the API docs, apply the API docs cache control.
   */
  if (url === '/api-docs' || url.startsWith('/api-docs/')) {
    applyCacheHeaders(res, apiConfig.cache.swagger);
    return next();
  }

  /**
   * If the request is for a static file, apply the static file cache control.
   */
  if (isStaticFile(url)) {
    const isHtml = url.toLowerCase().endsWith('.html');
    const value = isHtml ? 'no-cache' : `public, max-age=${apiConfig.cache.staticMaxAge}`;
    applyCacheHeaders(res, value, 'Accept-Encoding');
    return next();
  }

  /**
   * If the request is for an API endpoint, apply the API cache control.
   */
  if (url.startsWith('/api/')) {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      res.setHeader('Cache-Control', 'no-store');
      return next();
    }
    if (method === 'GET') {
      applyCacheHeaders(res, apiConfig.cache.apiDefault, 'Accept-Encoding');
      return next();
    }
  }

  /**
   * If the request is for anything else, apply the no cache control.
   */
  res.setHeader('Cache-Control', 'no-cache');
  next();
};

/**
 * Override default Cache-Control for this response (used by cache-control middleware).
 * Call before sending the response (e.g. in a controller).
 *
 * @param res - Express response object
 * @param directives - Cache-Control value (e.g. 'no-cache', 'public, max-age=3600')
 * @param vary - Optional Vary header (e.g. 'Accept-Encoding')
 */
export function setCacheControl(res: Response, directives: string, vary?: string): void {
  res.locals.cacheControl = directives;
  if (vary) res.locals.vary = vary;
}

/**
 * Apply Cache-Control headers to a response.
 * @param res - The response object.
 * @param cacheControl - The Cache-Control value.
 * @param vary - The Vary header value.
 */
export function applyCacheHeaders(res: Response, cacheControl: string, vary?: string): void {
  res.setHeader('Cache-Control', cacheControl);
  if (vary) res.setHeader('Vary', vary);
}
