import swaggerUi from 'swagger-ui-express';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { swaggerSpec } from './utils/swagger';
import { sampleRoutes } from './routes/sample.route';
import { healthRoutes } from './routes/health.route';
import { apiRateLimiter } from './middleware/rate-limit.middleware';
import { i18nMiddleware } from './middleware/i18n.middleware';
import { httpLogger } from './middleware/http-logger.middleware';
import { helmetMiddleware } from './middleware/helmet.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { cacheControlMiddleware } from './middleware/cache-control.middleware';
import { apiConfig } from './config';

const app: Application = express();

/**
 * Middleware execution order should be respected
 */
app.disable('x-powered-by');

/**
 * Enable trust proxy to work correctly behind reverse proxies (nginx, load balancers, etc.)
 * This allows express-rate-limit to correctly identify client IPs from X-Forwarded-For headers
 * Configure the number of proxy hops via TRUST_PROXY_HOPS environment variable
 * Examples: 1 for single nginx, 2 for ALB + CloudFront, true for unknown/variable
 * @see https://expressjs.com/en/guide/behind-proxies.html
 * @see https://express-rate-limit.mintlify.app/guides/troubleshooting-proxy-issues
 */
app.set('trust proxy', apiConfig.trustProxy);

/**
 * Use Express built-in ETag for dynamic responses (res.json, res.send)
 * - weak: Weak ETags (W/"hash") - sufficient for API JSON, works with compression
 * - Applies to all dynamic responses; express.static has its own etag option for static files
 * @see https://expressjs.com/en/api.html#app.settings.table
 */
app.set('etag', 'weak');

app.use(helmetMiddleware);
app.use(corsMiddleware);

app.use(httpLogger({ skipPaths: ['/health', '/api-docs'] }));

app.use(express.json({ limit: apiConfig.requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: apiConfig.requestBodyLimit }));

app.use(cookieParser());

app.use(i18nMiddleware);

app.use(compression());

/**
 * Must be after compression to set Vary: Accept-Encoding
 */
app.use(cacheControlMiddleware);

app.use(
  express.static('public', {
    maxAge: apiConfig.cache.staticMaxAge * 1000,
  }),
);

app.use('/health', healthRoutes);

app.use('/api', apiRateLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/samples', sampleRoutes);

app.use(errorMiddleware);

app.all(/.*/, (_req, res) => {
  res.status(404).end();
});

export { app };
