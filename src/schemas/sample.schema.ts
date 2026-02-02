import { z } from 'zod';

/**
 * Note: Custom error messages use i18n translation keys.
 * These keys are translated in the validate middleware using req.t().
 * Keys must exist in locales/{lang}/translation.json
 */
export const sampleIdParamsSchema = z.object({
  id: z.uuid('validation.sample.invalidId'),
});

export const getSamplesQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const createSampleRequestBodySchema = z.object({
  name: z.string().min(1, 'validation.sample.nameRequired'),
});

export const updateSampleRequestBodySchema = z.object({
  name: z.string().min(1, 'validation.sample.nameRequired'),
});

export type TSampleIdParams = z.infer<typeof sampleIdParamsSchema>;
export type TGetSamplesQuery = z.infer<typeof getSamplesQuerySchema>;
export type TCreateSampleRequestBody = z.infer<typeof createSampleRequestBodySchema>;
export type TUpdateSampleRequestBody = z.infer<typeof updateSampleRequestBodySchema>;
