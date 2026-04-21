import { createRequire } from 'node:module';
import path from 'node:path';
import url from 'node:url';

import type { Config } from '@jest/types';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const requireFromHere = createRequire(import.meta.url);
const stencilRootDir = path.resolve(path.dirname(requireFromHere.resolve('@stencil/core/mock-doc')), '..');
const stencilInternalDir = path.join(stencilRootDir, 'internal');

const moduleExtensions = ['ts', 'tsx', 'js', 'mjs', 'jsx'];
const moduleExtensionRegexp = `(${moduleExtensions.join('|')})`;

/**
 * Create a Jest preset configuration for Stencil components.
 */
export function createJestStencilPreset(options: Config.InitialOptions = {}): Config.InitialOptions {
  const preset: Config.InitialOptions = {
    testEnvironment: 'node',
    moduleFileExtensions: [...moduleExtensions, 'json', 'd.ts'],
    testPathIgnorePatterns: ['/.cache', '/.stencil', '/.vscode', '/dist', '/node_modules', '/www'],
    transform: {
      '^.+\\.(ts|tsx|jsx|js|mjs|css)(\\?.*)?$': path.resolve(__dirname, 'preprocessor.js'),
    },
    watchPathIgnorePatterns: [String.raw`^.+\.d\.ts$`],
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.spec.{ts,tsx}', '!src/**/*.e2e.{ts,tsx}'],
    testTimeout: 30000,
    snapshotSerializers: [path.resolve(__dirname, 'snapshot.js')],
    ...options,
    setupFilesAfterEnv: ['jest-stencil-runner/setup', ...(options.setupFilesAfterEnv ?? [] )],
    moduleNameMapper: {
      '^@stencil/core/cli$': path.join(stencilRootDir, 'cli', 'index.js'),
      '^@stencil/core/compiler$': path.join(stencilRootDir, 'compiler', 'stencil.js'),
      '^@stencil/core/internal$': path.join(stencilInternalDir, 'testing', 'index.js'),
      '^@stencil/core/internal/app-data$': path.join(stencilInternalDir, 'app-data', 'index.cjs'),
      '^@stencil/core/internal/app-globals$': path.join(stencilInternalDir, 'app-globals', 'index.js'),
      '^@stencil/core/internal/testing$': path.join(stencilInternalDir, 'testing', 'index.js'),
      '^@stencil/core/mock-doc$': path.join(stencilRootDir, 'mock-doc', 'index.cjs'),
      '^@stencil/core/sys$': path.join(stencilRootDir, 'sys', 'node', 'index.js'),
      '^@stencil/core/testing$': 'jest-stencil-runner',
      '^@stencil/core$': path.join(stencilInternalDir, 'testing', 'index.js'),
      ...options.moduleNameMapper,
    },
  };

  if (!options.testMatch && !options.testRegex) {
    preset.testRegex = `${String.raw`(/__tests__/.*|\.?(test|spec))\.` + moduleExtensionRegexp}$`;
  }

  return preset;
}
