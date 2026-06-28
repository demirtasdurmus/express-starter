import type { ParseKeys } from 'i18next';
import { z } from 'zod';

/**
 * Validation error messages are i18n keys (`ParseKeys`), translated in the error handler.
 * @see docs/adr/0001-validation-i18n-keys.md
 */
export const sampleIdParamsSchema = z.object({
  id: z.uuid('validation.sample.invalidId' satisfies ParseKeys),
});

export const getSamplesQuerySchema = z.object({
  page: z.coerce
    .number('validation.common.pageInvalid' satisfies ParseKeys)
    .min(1, 'validation.common.pageMin' satisfies ParseKeys)
    .default(1)
    .optional(),
  limit: z.coerce
    .number('validation.common.limitInvalid' satisfies ParseKeys)
    .min(1, 'validation.common.limitMin' satisfies ParseKeys)
    .max(100, 'validation.common.limitMax' satisfies ParseKeys)
    .default(10)
    .optional(),
});

export const createSampleRequestBodySchema = z.object({
  name: z
    .string('validation.sample.invalidName' satisfies ParseKeys)
    .min(1, 'validation.sample.nameRequired' satisfies ParseKeys),
});

export const updateSampleRequestBodySchema = z.object({
  name: z
    .string('validation.sample.invalidName' satisfies ParseKeys)
    .min(1, 'validation.sample.nameRequired' satisfies ParseKeys),
});

export type TSampleIdParams = z.infer<typeof sampleIdParamsSchema>;
export type TGetSamplesQuery = z.infer<typeof getSamplesQuerySchema>;
export type TCreateSampleRequestBody = z.infer<typeof createSampleRequestBodySchema>;
export type TUpdateSampleRequestBody = z.infer<typeof updateSampleRequestBodySchema>;
