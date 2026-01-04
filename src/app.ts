import swaggerUi from 'swagger-ui-express';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { swaggerSpec } from './utils/swagger';
import { sampleRoutes } from './routes/sample.route';
import { metricsRouter } from './routes/metrics.route';
import { healthRoutes } from './routes/health.route';
import { apiRateLimiter } from './middleware/rate-limit.middleware';
import { metricsMiddleware } from './middleware/metrics.middleware';
import { i18nMiddleware } from './middleware/i18n.middleware';
import { httpLogger } from './middleware/http-logger.middleware';
import { helmetMiddleware } from './middleware/helmet.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { apiConfig } from './config';

const app: Application = express();

/**
 * Middleware execution order should be respected
 */
app.disable('x-powered-by');
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Metrics middleware should be early to track all requests
if (apiConfig.metrics.enabled) {
  app.use(metricsMiddleware);
}

app.use(httpLogger({ skipPaths: ['/health', '/api-docs'] }));

app.use(express.json({ limit: apiConfig.requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: apiConfig.requestBodyLimit }));

app.use(cookieParser());

app.use(i18nMiddleware);

app.use(compression());

app.use(express.static('public'));

app.use('/health', healthRoutes);

if (apiConfig.metrics.enabled) {
  app.use(apiConfig.metrics.path, metricsRouter);
}

app.use('/api', apiRateLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/samples', sampleRoutes);

app.use(errorMiddleware);

app.all(/.*/, (_req, res) => {
  res.status(404).end();
});

export { app };
