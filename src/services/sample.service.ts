import { randomUUID } from 'crypto';
import { businessMetrics } from '../utils/metrics';
import { TSample } from '../types/sample';

const samples = new Map<string, string>();

export function getSamples(): TSample[] {
  // Update the active samples gauge
  businessMetrics.activeSamples.set(samples.size);
  return Array.from(samples.entries()).map(([id, name]) => ({ id, name }));
}

export function createSample(name: string): TSample {
  const id = randomUUID();
  samples.set(id, name);

  // Increment business metrics
  businessMetrics.samplesCreated.inc();
  businessMetrics.activeSamples.set(samples.size);

  return { id, name };
}

export function getSampleById(id: string) {
  const name = samples.get(id);
  return name ? { id, name } : null;
}

export function updateSampleById(id: string, name: string) {
  if (!checkSampleExistsById(id)) return null;

  samples.set(id, name);
  return { id, name };
}

export function deleteSampleById(id: string) {
  if (!checkSampleExistsById(id)) return null;

  samples.delete(id);

  // Update active samples count
  businessMetrics.activeSamples.set(samples.size);

  return id;
}

export function checkSampleExistsById(id: string): boolean {
  return samples.has(id);
}
