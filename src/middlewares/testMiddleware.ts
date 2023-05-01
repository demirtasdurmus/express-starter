import { RequestHandler } from 'express';

export const testMiddleware: RequestHandler = (req, res, next) => {
    console.log('I am a middleware!');
    next();
};
