import compression from 'compression';
import timeout from 'connect-timeout';
import cookieParser from 'cookie-parser';
import type { Application } from 'express';
import express, { type Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { apiConfig } from '@/config';
import { env, isProductionLike } from '@/env';
import { NotFoundError } from '@/lib/error';
import { metricsRegistry } from '@/lib/metrics';
import { swaggerSpec } from '@/lib/swagger';
import { cacheControl } from '@/middleware/cache-control.middleware';
import { cors } from '@/middleware/cors.middleware';
import { errorHandler } from '@/middleware/error-handler.middleware';
import { helmet } from '@/middleware/helmet.middleware';
import { httpLogger } from '@/middleware/http-logger.middleware';
import { i18n } from '@/middleware/i18n.middleware';
import { metrics } from '@/middleware/metrics.middleware';
import { apiRateLimit, globalRateLimit } from '@/middleware/rate-limit.middleware';
import { swaggerAuth } from '@/middleware/swagger-auth.middleware';
import { v1Router } from '@/routes/v1';
import type { THealthResponse } from '@/types/health';

const app: Application = express();

app.disable('x-powered-by');

/**
 * Trust proxy configuration for correctly identifying client IPs
 * - Number: Specifies exact number of proxy hops (e.g., 1 for nginx, 2 for ALB + CloudFront)
 * - true: Trust all proxies (use with caution, less secure)
 * Configure via TRUST_PROXY_HOPS environment variable
 * @see https://expressjs.com/en/guide/behind-proxies.html
 * @see https://express-rate-limit.mintlify.app/guides/troubleshooting-proxy-issues
 */
app.set('trust proxy', env.TRUST_PROXY_HOPS);

/**
 * Use Express built-in ETag for dynamic responses (res.json, res.send)
 * - weak: Weak ETags (W/"hash") - sufficient for API JSON, works with compression
 * - Applies to all dynamic responses; express.static has its own etag option for static files
 * @see https://expressjs.com/en/api.html#app.settings.table
 */
app.set('etag', 'weak');

app.use(helmet);
app.use(cors);

app.use(httpLogger());
app.use(metrics);

app.use(cookieParser());
app.use(i18n);

/**
 * @see https://expressjs.com/en/resources/middleware/timeout.html
 */
app.use(timeout(apiConfig.timeout.request, { respond: true }));

app.use(globalRateLimit);

app.use(express.json({ limit: apiConfig.requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: apiConfig.requestBodyLimit }));

app.use(compression());

// Must be after compression to set Vary: Accept-Encoding
app.use(cacheControl);

app.use(
  express.static('public', {
    maxAge: apiConfig.cache.staticMaxAge * 1000,
  }),
);

app.use('/api', apiRateLimit);

if (isProductionLike) {
  app.use('/api-docs', swaggerAuth);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res: Response<THealthResponse>) => {
  res.status(200).json({
    timestamp: new Date().toISOString(),
    version: apiConfig.version,
  });
});

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', metricsRegistry.contentType);
  res.end(await metricsRegistry.metrics());
});

app.use('/api/v1', v1Router);

app.all('/*splat', (req, _res, _next) => {
  throw new NotFoundError('common.notFound', {
    extensions: { method: req.method },
  });
});

app.use(errorHandler);

export { app };
