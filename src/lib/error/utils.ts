import { z } from 'zod';

import { FieldError } from '@/types';
import { BaseError, InternalServerError, UnprocessableEntityError } from '@/lib/error/baseError';

/**
 * Checks if an error is a BaseError.
 *
 * @param error - The error to check.
 * @returns True if the error is a BaseError, false otherwise.
 */
export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}

/**
 * Checks if an error is a BaseError.
 *
 * @param error - The error to check.
 * @returns True if the error is a BaseError, false otherwise.
 */
export function isUnprocessableEntityError(error: unknown): error is UnprocessableEntityError {
  return error instanceof UnprocessableEntityError;
}

/**
 * Serializes an error to a BaseError.
 *
 * @param err - The error to serialize.
 * @returns The BaseError.
 */
export function serializeError(err: unknown): BaseError {
  if (isBaseError(err)) {
    return err;
  } else if (err instanceof Error) {
    return new InternalServerError(err.message, { cause: err });
  } else {
    return new InternalServerError(String(err), { cause: err });
  }
}

/**
 * Transforms a Zod issue to a FieldError.
 *
 * @param issue - The Zod issue to transform.
 * @returns The FieldError.
 */
export function transformZodIssueToFieldError(issue: z.core.$ZodIssue): FieldError {
  return {
    field: issue.path.join('.'),
    message: issue.message,
  };
}
