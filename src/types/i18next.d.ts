import 'i18next';
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
    // Default namespace used when not specified
    defaultNS: 'translation';

    /**
     * Resources type definition - only need to define the default language
     * as all translations should have the same structure
     */
    resources: {
      translation: typeof translation;
    };
  }
}
