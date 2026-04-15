import { z } from 'zod';
import { TFunction } from 'i18next';
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

  constructor(statusCode: number, message: string, isOperational = true, data?: BaseErrorData) {
    super(message);

    this.name = new.target.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;

    /**
     * Maintains proper stacktrace for where our error was thrown (only available on V8)
     */
    Error.captureStackTrace?.(this, this.constructor);
    /**
     * Set the prototype explicitly to maintain instanceof checks
     */
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(400, message, isOperational, data);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(401, message, isOperational, data);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(403, message, isOperational, data);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(404, message, isOperational, data);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(409, message, isOperational, data);
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(422, message, isOperational, data);
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(429, message, isOperational, data);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(500, message, isOperational, data);
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(message: string, data?: BaseErrorData, isOperational?: boolean) {
    super(503, message, isOperational, data);
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
