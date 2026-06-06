import { BaseErrorOptions, ProblemDetail, FieldError } from '@/types';

/**
 * RFC9457 compliant error class
 * @see https://datatracker.ietf.org/doc/html/rfc9457
 */
export class BaseError extends Error {
  readonly status: number;
  readonly title: string;
  readonly extensions?: Record<string, unknown>;

  constructor(status: number, message: string, title: string, options?: BaseErrorOptions) {
    super(message, { cause: options?.cause });
    this.name = new.target.name;
    this.status = status;
    this.title = title;
    this.extensions = options?.extensions;

    Error.captureStackTrace?.(this, this.constructor);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toProblemDetail(instance?: string): ProblemDetail {
    return {
      type: 'about:blank',
      status: this.status,
      title: this.title,
      detail: this.message,
      ...(instance && { instance }),
      ...this.extensions,
    };
  }
}

/**
 * Generate Subclasses of ApiError for common error scenarios
 */
export class BadRequestError extends BaseError {
  constructor(message: string, options?: Omit<BaseErrorOptions, 'title'>) {
    super(400, message, 'BAD_REQUEST', options);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string, options?: Omit<BaseErrorOptions, 'title'>) {
    super(401, message, 'UNAUTHORIZED', options);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string, options?: Omit<BaseErrorOptions, 'title'>) {
    super(403, message, 'FORBIDDEN', options);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string, options?: Omit<BaseErrorOptions, 'title'>) {
    super(404, message, 'NOT_FOUND', options);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string, options?: Omit<BaseErrorOptions, 'title'>) {
    super(409, message, 'CONFLICT', options);
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(message: string, errors: FieldError[]) {
    super(422, message, 'VALIDATION_ERROR', { extensions: { errors } });
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(message: string, options?: Omit<BaseErrorOptions, 'title'>) {
    super(429, message, 'TOO_MANY_REQUESTS', options);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string, options?: Omit<BaseErrorOptions, 'title'>) {
    super(500, message, 'INTERNAL_SERVER_ERROR', options);
  }
}
