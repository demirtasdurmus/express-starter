import { z } from 'zod';

/**
 * Pagination query schema
 * @param page - The page number (default: 1)
 * @param limit - The limit of the page (default: 10)
 * @returns The pagination query schema
 */
export const paginationValuesSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});
