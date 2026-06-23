import { ConflictError, NotFoundError } from '@/lib/error';
import {
  createSample,
  deleteSampleById,
  getSampleById,
  getSampleByName,
  getSamples,
  updateSampleById,
} from '@/repositories/sample.repository';
import type { TGetSamplesQuery } from '@/schemas/sample.schema';
import type { TGetSamplesResponse, TSample } from '@/types/sample';
import { getPaginationMeta } from '@/utils/get-pagination-meta';

export function getSamplesService(query: TGetSamplesQuery): TGetSamplesResponse {
  const { page = 1, limit = 10 } = query;

  const allSamples = getSamples();
  const paginatedSamples = allSamples.slice((page - 1) * limit, page * limit);

  return {
    ...getPaginationMeta({ page, limit, totalCount: allSamples.length }),
    samples: paginatedSamples,
  };
}

export function createSampleService(name: string): TSample {
  const existingSample = getSampleByName(name);

  if (existingSample) {
    throw new ConflictError('samples.alreadyExists');
  }

  return createSample(name);
}

export function getSampleByIdService(id: string): TSample {
  const sample = getSampleById(id);

  if (!sample) {
    throw new NotFoundError('samples.notFound');
  }

  return sample;
}

export function updateSampleByIdService(id: string, name: string): TSample {
  const existingSample = getSampleByName(name);

  if (existingSample && existingSample.id !== id) {
    throw new ConflictError('samples.alreadyExists');
  }

  const sample = updateSampleById(id, name);

  if (!sample) {
    throw new NotFoundError('samples.notFound');
  }

  return sample;
}

export function deleteSampleByIdService(id: string): string {
  const deletedId = deleteSampleById(id);

  if (!deletedId) {
    throw new NotFoundError('samples.notFound');
  }

  return deletedId;
}
