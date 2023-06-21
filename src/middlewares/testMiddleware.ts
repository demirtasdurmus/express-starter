import { RequestHandler } from 'express';

export const testMiddleware: RequestHandler = (req, res, next) => {
    // eslint-disable-next-line no-console
    console.log('I am a middleware!');
    next();
};
