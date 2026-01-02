import { z } from 'zod';
import { RequestHandler } from 'express';
import { parseWithZod } from '../utils/parse-with-zod';
import { fromZodIssueToBaseErrorIssue, UnprocessableEntityError } from '../utils/error';
import { TValidationMap } from '../types';

type TValidateOptions<T> = {
  validationMap: TValidationMap;
  schema: z.ZodSchema<T>;
};

export function validate<T>({ validationMap, schema }: TValidateOptions<T>): RequestHandler {
  return (req, _res, next) =>
    parseWithZod({
      object: req[validationMap],
      schema,
      onError: (error) => {
        throw new UnprocessableEntityError(req.t('common.validationFailed'), {
          issues: error.issues.map(fromZodIssueToBaseErrorIssue),
        });
      },
      onSuccess: (data) => {
        if (validationMap === 'query') {
          /**
           * Express 5: req.query is a getter; use this hack to modify it
           * @see https://stackoverflow.com/questions/79597051/express-v5-is-there-any-way-to-modify-req-query
           */
          Object.defineProperty(req, 'query', {
            ...Object.getOwnPropertyDescriptor(req, 'query'),
            value: req.query,
            writable: true,
          });
        }
        req[validationMap] = data;
        next();
      },
    });
}
