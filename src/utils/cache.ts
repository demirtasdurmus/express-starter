import { Response } from 'express';

const staticFileExtensions = [
  '.css',
  '.js',
  '.ico',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.html',
  '.json',
  '.xml',
  '.txt',
  '.map',
];

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
 * Check if a URL is a static file.
 * @param url - The URL to check.
 * @returns True if the URL is a static file, false otherwise.
 */
export function isStaticFile(url: string): boolean {
  return staticFileExtensions.some((e) => url.toLowerCase().endsWith(e));
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
