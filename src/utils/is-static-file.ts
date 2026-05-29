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
 * Check if a URL is a static file.
 * @param url - The URL to check.
 * @returns True if the URL is a static file, false otherwise.
 */
export function isStaticFile(url: string): boolean {
  return staticFileExtensions.some((e) => url.toLowerCase().endsWith(e));
}
