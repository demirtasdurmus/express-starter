import swaggerUi from 'swagger-ui-express';
import express, { Application } from 'express';
import compression from 'compression';
import { swaggerSpec } from './utils/swagger';
import { sampleRoutes } from './routes/sample.route';
import { healthRoutes } from './routes/health.route';
import { apiRateLimiter } from './middleware/rate-limit.middleware';
import { notFoundHandler } from './middleware/not-found-handler.middleware';
import { httpLogger } from './middleware/http-logger.middleware';
import { helmetMiddleware } from './middleware/helmet.middleware';
import { errorHandler } from './middleware/error-handler.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { apiConfig } from './config';

const app: Application = express();

app.disable('x-powered-by');
app.use(helmetMiddleware);
app.use(corsMiddleware);

app.use(httpLogger);

app.use(express.json({ limit: apiConfig.requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: apiConfig.requestBodyLimit }));

app.use(compression());

app.use('/health', healthRoutes);

app.use('/api', apiRateLimiter);

app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/samples', sampleRoutes);

app.all(/.*/, notFoundHandler);
app.use(errorHandler);

export { app };
