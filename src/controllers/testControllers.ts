import { RequestHandler } from 'express';

export const testController: RequestHandler = (req, res) => {
    res.status(200).send('Hello, World!');
};
