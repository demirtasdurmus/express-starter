import type { RequestHandler } from 'express';
import type { z } from 'zod';

import { transformZodIssueToFieldError, UnprocessableEntityError } from '@/lib/error';
import type { TValidationMap } from '@/types';
import { parseWithZod } from '@/utils/parse-with-zod';

type TValidateOptions<T> = {
  validationMap: TValidationMap;
  schema: z.ZodSchema<T>;
};

export function validate<T>({ validationMap, schema }: TValidateOptions<T>): RequestHandler {
  return (req, _res, next) => {
    parseWithZod({
      object: req[validationMap],
      schema,
      onError: (error) => {
        throw new UnprocessableEntityError(
          'common.validationFailed',
          error.issues.map(transformZodIssueToFieldError),
        );
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
  };
}
