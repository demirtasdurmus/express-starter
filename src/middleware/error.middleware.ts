import { ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger';
import { serializeError } from '../utils/error';
import { ErrorResponseDetails, ServerResponse } from '../types';
import { env } from '../env';

export const errorMiddleware: ErrorRequestHandler<
  unknown,
  ServerResponse<ErrorResponseDetails>,
  unknown,
  unknown
> = (err, req, res, _next) => {
  const error = serializeError(err);

  const response: ServerResponse<ErrorResponseDetails> = {
    success: false,
    error: {
      name: error.name,
      statusCode: error.statusCode,
      message: error.message,
      ...(error.data ? { ...error.data } : {}),
    },
  };

  if (res.headersSent) {
    const message = `${req.method} ${req.url}`;

    const logData = {
      requestId: req.headers['x-request-id'],
      error: response.error,
    };
    logger.error(logData, message);
    return;
  }

  res.locals.error = { ...response.error };

  if (env.NODE_ENV === 'production' && error.statusCode >= 500) {
    delete response.error.stack;
    delete response.error.originalError;
    response.error.message = req.t('common.somethingWentWrong');
  }

  res.setHeader('Cache-Control', 'no-store');

  res.status(error.statusCode).send(response);
};
