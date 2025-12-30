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
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts', '<rootDir>/__tests__/**/*.spec.ts'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.test.ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/**/*.d.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/__tests__/', '/coverage/'],
};

export default config;
