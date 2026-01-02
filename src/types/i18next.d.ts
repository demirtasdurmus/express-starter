import 'i18next';
import { apiConfig } from '../config';
import translation from '../../locales/en/translation.json';

/**
 * Type-safe i18next configuration
 * This extends i18next's CustomTypeOptions to provide autocomplete
 * and type checking for translation keys when using req.t()
 *
 * @see https://www.i18next.com/overview/typescript
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof apiConfig.i18n.ns;

    /**
     * Resources type definition - only need to define the default language
     * as all translations should have the same structure
     */
    resources: {
      [apiConfig.i18n.ns]: typeof translation;
    };
  }
}
