import { readFileSync } from 'node:fs';

export const apiConfig = {
  title: 'Express Starter API',
  version: JSON.parse(readFileSync('package.json', 'utf8'))?.version || '1.0.0',
} as const;
