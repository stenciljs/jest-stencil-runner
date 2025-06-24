import type { Config } from '@jest/types';
import { join } from 'path';

const moduleExtensions = ['ts', 'tsx', 'js', 'mjs', 'jsx'];
const moduleExtensionRegexp = '(' + moduleExtensions.join('|') + ')';

/**
 * Create a Jest preset configuration for Stencil components.
 */
export function createJestStencilPreset(options: {
  rootDir?: string;
  moduleNameMapper?: Record<string, string>;
} = {}): Config.InitialOptions {
  const rootDir = options.rootDir || process.cwd();

  const preset: Config.InitialOptions = {
    testEnvironment: 'node',
    moduleFileExtensions: [...moduleExtensions, 'json', 'd.ts'],
    moduleNameMapper: {
      '^@stencil/core/testing$': 'jest-stencil-runner',
      '^@stencil/core$': '@stencil/core',
      ...options.moduleNameMapper,
    },
    setupFilesAfterEnv: ['jest-stencil-runner/setup'],
    testPathIgnorePatterns: [
      '/.cache',
      '/.stencil', 
      '/.vscode',
      '/dist',
      '/node_modules',
      '/www'
    ],
    testRegex: '(/__tests__/.*|\\.?(test|spec))\\.' + moduleExtensionRegexp + '$',
    transform: {
      '^.+\\.(ts|tsx|jsx|js|mjs|css)$': 'jest-stencil-runner/preprocessor',
    },
    watchPathIgnorePatterns: ['^.+\\.d\\.ts$'],
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/**/*.spec.{ts,tsx}',
      '!src/**/*.e2e.{ts,tsx}',
    ],
    testTimeout: 30000,
  };

  return preset;
} 
