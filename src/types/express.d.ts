import { TFunction } from 'i18next';

/**
 * This declaration extends the Express Request interface to include additional properties
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * Translation function provided by i18next-http-middleware
       * Use this to translate messages in controllers and middleware
       * @example req.t('errors.notFound')
       * @example req.t('validation.required', { field: 'email' })
       */
      t: TFunction;

      /**
       * Current detected language (e.g., 'en', 'tr')
       */
      language: string;

      /**
       * All languages detected from the request
       * Ordered by priority (query > cookie > header)
       */
      languages: string[];

      /**
       * i18next instance attached to the request
       */
      i18n: import('i18next').i18n;
    }
  }
}

export {};
