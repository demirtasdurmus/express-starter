import helmet from 'helmet';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      // Allow scripts from CDN (Showdown and DOMPurify)
      scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
      // Allow fetching README from GitHub raw content and CDN source maps
      connectSrc: ["'self'", 'https://raw.githubusercontent.com', 'https://cdn.jsdelivr.net'],
    },
  },
  /**
   * Allow embedding for Swagger UI
   */
  crossOriginEmbedderPolicy: false,
});
