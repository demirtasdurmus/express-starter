import { RequestHandler } from 'express';
import { ParseKeys } from 'i18next';
import { z } from 'zod';

import { TValidationMap } from '@/types';
import { transformZodIssueToFieldError, UnprocessableEntityError } from '@/lib/error';
import { parseWithZod } from '@/utils/parse-with-zod';

type TValidateOptions<T> = {
  validationMap: TValidationMap;
  schema: z.ZodSchema<T>;
};

export function validate<T>({ validationMap, schema }: TValidateOptions<T>): RequestHandler {
  return (req, _res, next) => {
    // Set Zod's locale based on the detected request language
    setZodLocale(req.language);

    parseWithZod({
      object: req[validationMap],
      schema,
      onError: (error) => {
        throw new UnprocessableEntityError(
          'common.validationFailed' satisfies ParseKeys,
          error.issues.map((issue) => transformZodIssueToFieldError(issue)),
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

/**
 * Set Zod locale based on request language.
 * Uses Zod v4's built-in locale system.
 */
function setZodLocale(language: string): void {
  /**
   * Map i18next language codes to Zod locale functions
   */
  const localeMap: Record<string, () => ReturnType<typeof z.locales.en>> = {
    tr: z.locales.tr,
    en: z.locales.en,
  };

  const localeConfig = localeMap[language] ?? localeMap['en'];
  if (localeConfig) {
    z.config(localeConfig());
  }
}
