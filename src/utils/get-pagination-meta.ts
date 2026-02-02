import { TPaginationMeta } from '../types';

/**
 * Get the pagination meta data
 * @param page - The page number
 * @param limit - The limit of the page
 * @param totalCount - The total count of the items
 * @returns The pagination meta data
 */
export function getPaginationMeta({
  page,
  limit,
  totalCount,
}: {
  page: number;
  limit: number;
  totalCount: number;
}): TPaginationMeta {
  return {
    page,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}
