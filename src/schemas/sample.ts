import { z } from 'zod';

export const sampleIdParamsSchema = z.object({
  id: z.uuid('Invalid sample ID'),
});

export const createSampleRequestBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const updateSampleRequestBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export type TSampleIdParams = z.infer<typeof sampleIdParamsSchema>;
export type TCreateSampleRequestBody = z.infer<typeof createSampleRequestBodySchema>;
export type TUpdateSampleRequestBody = z.infer<typeof updateSampleRequestBodySchema>;
