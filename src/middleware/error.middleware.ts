import { ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger';
import { serializeError } from '../utils/error';
import { ErrorResponse } from '../types';
import { env } from '../env';

export const errorMiddleware: ErrorRequestHandler<unknown, ErrorResponse> = (
  err,
  req,
  res,
  _next,
) => {
  const error = serializeError(err);

  const errorResponse: ErrorResponse = {
    name: error.name,
    message: error.message,
    ...(error.data ? { ...error.data } : {}),
  };

  if (res.headersSent) {
    const message = `${req.method} ${req.url}`;

    const logData = {
      requestId: req.headers['x-request-id'],
      error: errorResponse,
    };
    logger.error(logData, message);
    return;
  }

  res.locals.error = { ...errorResponse };

  if (env.NODE_ENV === 'production' && error.statusCode >= 500) {
    delete errorResponse.stack;
    delete errorResponse.originalError;
    errorResponse.message = req.t('common.somethingWentWrong');
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(error.statusCode).send(errorResponse);
};
