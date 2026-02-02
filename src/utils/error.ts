import { z } from 'zod';
import { TFunction } from 'i18next';
import httpStatus from 'http-status';
import { BaseErrorData, BaseErrorIssue } from '../types';

/**
 * Base error class that extends the native Error class
 * Provides a foundation for all custom error types in the application
 */
export class BaseError extends Error {
  public override readonly name: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly data?: BaseErrorData;

  constructor(
    name: string,
    statusCode: number,
    message: string,
    isOperational = true,
    data?: BaseErrorData,
  ) {
    super(message);

    /**
     * Maintains proper stacktrace for where our error was thrown (only available on V8)
     */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;

    /**
     * Set the prototype explicitly to maintain instanceof checks
     */
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export class BadRequestError extends BaseError {
  private static readonly statusCode = httpStatus.BAD_REQUEST;

  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(
      httpStatus[`${BadRequestError.statusCode}_NAME`],
      BadRequestError.statusCode,
      message,
      isOperational,
      data,
    );

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends BaseError {
  private static readonly statusCode = httpStatus.UNAUTHORIZED;

  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(
      httpStatus[`${UnauthorizedError.statusCode}_NAME`],
      UnauthorizedError.statusCode,
      message,
      isOperational,
      data,
    );

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends BaseError {
  private static readonly statusCode = httpStatus.FORBIDDEN;

  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(
      httpStatus[`${ForbiddenError.statusCode}_NAME`],
      ForbiddenError.statusCode,
      message,
      isOperational,
      data,
    );

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends BaseError {
  private static readonly statusCode = httpStatus.NOT_FOUND;

  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(
      httpStatus[`${NotFoundError.statusCode}_NAME`],
      NotFoundError.statusCode,
      message,
      isOperational,
      data,
    );

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends BaseError {
  private static readonly statusCode = httpStatus.CONFLICT;

  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(
      httpStatus[`${ConflictError.statusCode}_NAME`],
      ConflictError.statusCode,
      message,
      isOperational,
      data,
    );

    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class UnprocessableEntityError extends BaseError {
  private static readonly statusCode = httpStatus.UNPROCESSABLE_ENTITY;

  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(
      httpStatus[`${UnprocessableEntityError.statusCode}_NAME`],
      UnprocessableEntityError.statusCode,
      message,
      isOperational,
      data,
    );

    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}

export class TooManyRequestsError extends BaseError {
  private static readonly statusCode = httpStatus.TOO_MANY_REQUESTS;

  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(
      httpStatus[`${TooManyRequestsError.statusCode}_NAME`],
      TooManyRequestsError.statusCode,
      message,
      isOperational,
      data,
    );
    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }
}

export class InternalServerError extends BaseError {
  private static readonly statusCode = httpStatus.INTERNAL_SERVER_ERROR;

  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(
      httpStatus[`${InternalServerError.statusCode}_NAME`],
      InternalServerError.statusCode,
      message,
      isOperational,
      data,
    );
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class ServiceUnavailableError extends BaseError {
  private static readonly statusCode = httpStatus.SERVICE_UNAVAILABLE;

  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(
      httpStatus[`${ServiceUnavailableError.statusCode}_NAME`],
      ServiceUnavailableError.statusCode,
      message,
      isOperational,
      data,
    );
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

/**
 * Translates and transforms a Zod issue into a BaseErrorIssue.
 * @param issue - The Zod issue to translate and transform.
 * @param t - The translation function.
 * @returns The BaseErrorIssue.
 */
export function translateAndTransformZodIssue(
  issue: z.core.$ZodIssue,
  t: TFunction,
): BaseErrorIssue {
  let detail = issue.message;

  const isCustomMessage = isCustomZodErrorMessage(issue.message);

  if (isCustomMessage) {
    /**
     * Used type assertion here as t function is type safe
     * We will write detailed integration tests for each custom message passed to zod schemas
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const translated = t(issue.message as any);
    if (translated !== issue.message) {
      detail = translated;
    }
  }

  return {
    field: issue.path.join('.'),
    detail,
  };
}

/**
 * Checks if a message is a custom Zod error message key.
 * @param message - The message to check.
 * @returns True if the message is a custom Zod error message key, false otherwise.
 * @example
 * isCustomZodErrorMessage('validation.sample.nameRequired'); // true
 * isCustomZodErrorMessage('Name is required'); // false
 */
function isCustomZodErrorMessage(message: string): boolean {
  return /^[\w.]+$/.test(message) && message.includes('.');
}

/**
 * Serializes an error to a BaseError.
 * @param err - The error to serialize.
 * @returns The BaseError.
 */
export function serializeError(err: unknown): BaseError {
  let error: BaseError;

  if (isBaseError(err)) {
    error = err;
    /**
     * Add more cases here as needed
     */
  } else if (isTimeoutError(err)) {
    error = new ServiceUnavailableError('Request timed out', { originalError: err }, false);
  } else if (err instanceof Error) {
    error = new InternalServerError(err.message, { stack: err.stack }, false);
  } else {
    error = new InternalServerError('An unexpected error occurred', { originalError: err }, false);
  }

  return error;
}

/**
 * Checks if an error is a timeout error.
 * @param err - The error to check.
 * @returns True if the error is a timeout error, false otherwise.
 */
export function isTimeoutError(err: unknown): boolean {
  return err instanceof Error && 'code' in err && err.code === 'ETIMEDOUT';
}

/**
 * Checks if an error is a BaseError.
 * @param error - The error to check.
 * @returns True if the error is a BaseError, false otherwise.
 */
export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}
