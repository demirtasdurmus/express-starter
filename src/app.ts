import compression from 'compression';
import timeout from 'connect-timeout';
import cookieParser from 'cookie-parser';
import type { Application } from 'express';
import express from 'express';
import type { ParseKeys } from 'i18next';
import swaggerUi from 'swagger-ui-express';

import { apiConfig } from '@/config';
import { NotFoundError } from '@/lib/error';
import { swaggerSpec } from '@/lib/swagger';
import { cacheControl } from '@/middleware/cache-control.middleware';
import { cors } from '@/middleware/cors.middleware';
import { errorHandler } from '@/middleware/error-handler.middleware';
import { helmet } from '@/middleware/helmet.middleware';
import { httpLogger } from '@/middleware/http-logger.middleware';
import { i18n } from '@/middleware/i18n.middleware';
import { apiRateLimit, globalRateLimit } from '@/middleware/rate-limit.middleware';
import { healthRouter } from '@/routers/health.router';
import { sampleRouter } from '@/routers/sample.router';

const app: Application = express();

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

app.use(helmet);
app.use(cors);

app.use(httpLogger());

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

app.use('/health', healthRouter);

app.use('/api', apiRateLimit);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/samples', sampleRouter);

app.all('/*splat', (req, _res, _next) => {
  throw new NotFoundError('common.notFound' satisfies ParseKeys, {
    extensions: { method: req.method },
  });
});

app.use(errorHandler);

export { app };
