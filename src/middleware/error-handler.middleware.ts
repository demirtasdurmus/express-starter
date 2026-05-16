import { ParseKeys } from 'i18next';
import { ErrorRequestHandler } from 'express';
import { ProblemDetail, FieldError } from '../types';
import { logger } from '../lib/logger';
import { isUnprocessableEntityError, serializeError } from '../lib/error';
import { isProductionLike } from '../env';

export const errorHandler: ErrorRequestHandler<unknown, ProblemDetail> = (err, req, res, _next) => {
  const instance = req.originalUrl;
  const error = serializeError(err);

  const problemDetail = error.toProblemDetail(instance);

  // A non awaiting promise is rejected, but the response has already been sent
  if (res.headersSent) {
    logger.error({ ...problemDetail, requestId: req.headers['x-request-id'] }, error.message);

    return;
  }

  // Store error in teh locals object for detailed logging
  res.locals.error = { ...problemDetail };

  // Translate user-facing fields
  problemDetail.detail = req.t(error.message as unknown as ParseKeys);

  if (isUnprocessableEntityError(error)) {
    if (Array.isArray(problemDetail.errors)) {
      problemDetail.errors = (problemDetail.errors as FieldError[]).map((error) => ({
        ...error,
        message: req.t(error.message as unknown as ParseKeys),
      }));
    }
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
