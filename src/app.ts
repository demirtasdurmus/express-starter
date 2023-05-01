import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.use(express.static('public'));

app.get('/api', (req: Request, res: Response) => {
    res.send('Hello World');
});

export { app };
