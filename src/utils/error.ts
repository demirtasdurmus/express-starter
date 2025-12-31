import { $ZodIssue } from 'zod/v4/core';
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

/**
 * Checks if an error is a BaseError.
 * @param error - The error to check.
 * @returns True if the error is a BaseError, false otherwise.
 */
export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}

/**
 * Converts a Zod issue to a BaseErrorIssue.
 * @param issue - The Zod issue to convert.
 * @returns The BaseErrorIssue.
 */
export function fromZodIssueToBaseErrorIssue(issue: $ZodIssue): BaseErrorIssue {
  return {
    field: issue.path.join('.'),
    detail: issue.message,
  };
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
  } else if (err instanceof Error) {
    error = new InternalServerError(err.message, { stack: err.stack }, false);
  } else {
    error = new InternalServerError('An unexpected error occurred', { originalError: err }, false);
  }

  return error;
}
