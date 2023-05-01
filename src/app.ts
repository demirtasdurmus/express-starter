import express, { Application } from 'express';
import { testRoutes } from './routes/testRoutes';

const app: Application = express();

app.use(express.static('public'));
app.use('/api/test', testRoutes);

export { app };
