import path from 'node:path';
import url from 'node:url';

import type { Config } from '@jest/types';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const moduleExtensions = ['ts', 'tsx', 'js', 'mjs', 'jsx'];
const moduleExtensionRegexp = `(${moduleExtensions.join('|')})`;

/**
 * Create a Jest preset configuration for Stencil components.
 */
export function createJestStencilPreset(options: Config.InitialOptions = {}): Config.InitialOptions {
  const preset: Config.InitialOptions = {
    testEnvironment: 'node',
    moduleFileExtensions: [...moduleExtensions, 'json', 'd.ts'],
    setupFilesAfterEnv: ['jest-stencil-runner/setup'],
    testPathIgnorePatterns: ['/.cache', '/.stencil', '/.vscode', '/dist', '/node_modules', '/www'],
    transform: {
      '^.+\\.(ts|tsx|jsx|js|mjs|css)(\\?.*)?$': path.resolve(__dirname, 'preprocessor.js'),
    },
    watchPathIgnorePatterns: [String.raw`^.+\.d\.ts$`],
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.spec.{ts,tsx}', '!src/**/*.e2e.{ts,tsx}'],
    testTimeout: 30000,
    snapshotSerializers: [path.resolve(__dirname, 'snapshot.js')],
    ...options,
    moduleNameMapper: {
      '^@stencil/core/testing$': 'jest-stencil-runner',
      '^@stencil/core$': '@stencil/core',
      ...options.moduleNameMapper,
    },
  };

  if (!options.testMatch && !options.testRegex) {
    preset.testRegex = `${String.raw`(/__tests__/.*|\.?(test|spec))\.` + moduleExtensionRegexp}$`;
  }

  return preset;
}
