import { createDefaultPreset } from 'ts-jest';
import type { Config } from 'jest';

/**
 * @see https://kulshekhar.github.io/ts-jest/docs/getting-started/options
 */
const tsJestTransformCfg = createDefaultPreset().transform;

/**
 * @see https://jestjs.io/docs/getting-started
 */
const config: Config = {
  transform: {
    ...tsJestTransformCfg,
  },
  testEnvironment: 'node',
  rootDir: './__tests__',
  setupFilesAfterEnv: ['../jest-int.setup.ts'],
  coverageDirectory: '../coverage-int',
};

export default config;
