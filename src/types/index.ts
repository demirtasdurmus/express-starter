export type TValidationMap = 'params' | 'query' | 'body';

export type TLanguage = 'en' | 'tr';

export type ServerResponse<T extends Record<string, unknown> = Record<string, unknown>> =
  | {
      success: true;
      payload: T | undefined;
    }
  | {
      success: false;
      error: T;
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

export type ErrorResponseDetails = {
  name: string;
  statusCode: number;
  message: string;
  issues?: BaseErrorData['issues'];
  stack?: BaseErrorData['stack'];
  originalError?: BaseErrorData['originalError'];
};
