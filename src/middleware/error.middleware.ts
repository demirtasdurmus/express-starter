import { ErrorRequestHandler } from 'express';
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

  res.locals.error = { ...response.error };

  if (env.NODE_ENV === 'production' && error.statusCode >= 500) {
    delete response.error.stack;
    delete response.error.originalError;
    response.error.message = req.t('common.somethingWentWrong');
  }

  res.setHeader('Cache-Control', 'no-store');

  res.status(error.statusCode).send(response);
};
