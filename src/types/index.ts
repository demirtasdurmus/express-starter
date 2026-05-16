export type TValidationMap = 'params' | 'query' | 'body';

export type TLanguage = 'en' | 'tr';

export type TPaginationMeta = {
  page: number;
  totalPages: number;
  totalCount: number;
};

export interface ProblemDetail {
  type: string;
  status: number;
  title: string;
  detail: string;
  instance?: string;
  [key: string]: unknown;
}

export interface BaseErrorOptions {
  title?: string;
  extensions?: Record<string, unknown>;
  cause?: unknown;
}

export interface FieldError {
  field: string;
  message: string;
}
