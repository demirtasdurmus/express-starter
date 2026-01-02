import { z } from 'zod';
import { RequestHandler } from 'express';
import { parseWithZod } from '../utils/parse-with-zod';
import { translateAndTransformZodIssue, UnprocessableEntityError } from '../utils/error';
import { TValidationMap } from '../types';

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
        throw new UnprocessableEntityError(req.t('common.validationFailed'), {
          issues: error.issues.map((issue) => translateAndTransformZodIssue(issue, req.t)),
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
