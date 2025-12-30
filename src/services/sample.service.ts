import { randomUUID } from 'crypto';
import { NotFoundError } from '../utils/error';
import { TSample } from '../types/sample';

const samples = new Map<string, string>();

export function getSamples(): TSample[] {
  return Array.from(samples.entries()).map(([id, name]) => ({ id, name }));
}

export function createSample(name: string): TSample {
  const id = randomUUID();
  samples.set(id, name);
  return { id, name };
}

export function getSampleById(id: string): TSample {
  const name = samples.get(id);
  if (!name) {
    throw new NotFoundError('Sample not found');
  }
  return { id, name };
}

export function updateSampleById(id: string, name: string): TSample {
  if (!samples.has(id)) {
    throw new NotFoundError('Sample not found');
  }
  samples.set(id, name);
  return { id, name };
}

export function deleteSampleById(id: string): void {
  if (!samples.has(id)) {
    throw new NotFoundError('Sample not found');
  }
  samples.delete(id);
}
