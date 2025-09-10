import { RequestHandler } from 'express';

export const sample: RequestHandler = (_req, _res, next) => {
  next();
};
