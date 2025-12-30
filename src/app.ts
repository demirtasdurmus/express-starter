import swaggerUi from 'swagger-ui-express';
import express, { Application } from 'express';
import { swaggerSpec } from './utils/swagger';
import { sampleRoutes } from './routes/sample.route';
import { notFoundHandler } from './middleware/not-found-handler.middleware';
import { httpLogger } from './middleware/http-logger.middleware';
import { errorHandler } from './middleware/error-handler.middleware';

const app: Application = express();

app.disable('x-powered-by');

app.use(httpLogger);
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/samples', sampleRoutes);

app.use(errorHandler);
app.all(/.*/, notFoundHandler);

export { app };
