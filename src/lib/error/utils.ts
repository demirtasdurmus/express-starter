import type { ParseKeys } from 'i18next';
import type { z } from 'zod';

import {
  BadRequestError,
  BaseError,
  InternalServerError,
  UnprocessableEntityError,
} from '@/lib/error/baseError';
import type { FieldError } from '@/types';

type BodyParserError = Error & {
  type: string;
  status: number;
  statusCode: number;
};

function isBodyParserError(error: unknown): error is BodyParserError {
  return (
    error instanceof Error &&
    'type' in error &&
    typeof error.type === 'string' &&
    error.type.startsWith('entity.parse.')
  );
}

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
  }

  if (isBodyParserError(err)) {
    return new BadRequestError('common.invalidJson' satisfies ParseKeys, { cause: err });
  }

  if (err instanceof Error) {
    return new InternalServerError(err.message, { cause: err });
  }

  return new InternalServerError(String(err), { cause: err });
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
