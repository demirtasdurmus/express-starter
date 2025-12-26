import { ErrorRequestHandler } from 'express';
import { serializeError } from '../utils/error';
import { ErrorResponseDetails, ServerResponse } from '../types';
import { env } from '../env';

export const errorHandler: ErrorRequestHandler<
  unknown,
  ServerResponse<ErrorResponseDetails>,
  unknown,
  unknown
> = (err, _req, res, _next) => {
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

  res.locals.error = error;

  if (env.NODE_ENV === 'production' && error.statusCode >= 500) {
    delete response.error.stack;
    delete response.error.originalError;
    response.error.message = 'Something went wrong';
  }

  res.status(error.statusCode).send(response);
};
