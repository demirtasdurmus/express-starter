import type { ErrorRequestHandler } from 'express';
import type { ParseKeys } from 'i18next';

import { isProductionLike } from '@/env';
import { isUnprocessableEntityError, serializeError } from '@/lib/error';
import { logger } from '@/lib/logger';
import type { FieldError, ProblemDetail } from '@/types';

export const errorHandler: ErrorRequestHandler<unknown, ProblemDetail> = (err, req, res, _next) => {
  const instance = req.originalUrl;
  const error = serializeError(err);

  const problemDetail = error.toProblemDetail(instance);

  const loggableObject = {
    ...problemDetail,
    stack: error.stack,
    cause: error.cause,
  };

  // A non awaiting promise is rejected, but the response has already been sent
  if (res.headersSent) {
    logger.error(
      {
        ...loggableObject,
        requestId: req.headers['x-request-id'],
      },
      error.message,
    );

    return;
  }

  // Store error in teh locals object for detailed logging
  res.locals.error = loggableObject;

  // Translate user-facing fields (validation messages are i18n keys until this point)
  problemDetail.detail = req.t(error.message as ParseKeys);

  if (isUnprocessableEntityError(error) && Array.isArray(problemDetail.errors)) {
    problemDetail.errors = (problemDetail.errors as FieldError[]).map((fieldError) => ({
      ...fieldError,
      message: req.t(fieldError.message as ParseKeys),
    }));
  }

  // Mask internal server errors in production
  if (isProductionLike && error.status >= 500) {
    problemDetail.detail = req.t('common.somethingWentWrong');
  }

  // Set cache control header and send response
  res.setHeader('Cache-Control', 'no-store');
  return res
    .status(error.status)
    .set('Content-Type', 'application/problem+json')
    .json(problemDetail);
};
