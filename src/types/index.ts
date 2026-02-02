export type TValidationMap = 'params' | 'query' | 'body';

export type TLanguage = 'en' | 'tr';

export type TPaginationMeta = {
  page: number;
  totalPages: number;
  totalCount: number;
};

export type BaseErrorIssue = {
  field?: string;
  detail?: string;
};

export type BaseErrorData = {
  issues?: BaseErrorIssue[];
  stack?: string;
  originalError?: unknown;
};

export type ErrorResponse = {
  name: string;
  message: string;
  issues?: BaseErrorData['issues'];
  stack?: BaseErrorData['stack'];
  originalError?: BaseErrorData['originalError'];
};
