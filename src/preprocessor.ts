import process from 'node:process';

import type { TransformedSource, TransformOptions } from '@jest/transform';

/**
 * Jest preprocessor for transforming TypeScript, JSX, and CSS files for Stencil components.
 * This uses Stencil's own transpiler to properly handle decorators and component transformations.
 */
export const JestStencilPreprocessor = {
  /**
   * Transform source code for Jest consumption.
   */
  process(sourceText: string, sourcePath: string, options: TransformOptions): TransformedSource {
    const ext = getFileExtension(sourcePath);

    if (ext === 'css') {
      // Transform CSS to a module that exports the CSS string
      return {
        code: transformCSS(sourceText),
      };
    }

    return {
      code: transpileWithStencil(sourceText, sourcePath, options),
    };
  },

  /**
   * Generate cache key for the transformed file.
   */
  getCacheKey(sourceText: string, sourcePath: string, options: TransformOptions): string {
    // Generate cache key for files
    const key = [process.version, sourceText, sourcePath, JSON.stringify(options), 'stencil-jest-preprocessor-v3'];

    return key.join(':');
  },
};

/**
 * Transpile TypeScript/JSX using Stencil's transpiler.
 */
function transpileWithStencil(sourceText: string, sourcePath: string, options: TransformOptions): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { transpileSync } = require('@stencil/core/compiler');

  const transpileOptions = {
    file: sourcePath,
    currentDirectory: options.config.rootDir || process.cwd(),
    componentExport: null,
    componentMetadata: 'compilerstatic',
    coreImportPath: '@stencil/core/internal/testing',
    module: 'cjs', // always use commonjs since we're in a node environment
    proxy: null,
    sourceMap: 'inline',
    style: null,
    styleImportData: 'queryparams',
    target: 'es2017', // target ES2017 for modern node
    transformAliasedImportPaths: false,
  };

  const results = transpileSync(sourceText, transpileOptions);

  // Check for errors
  const hasErrors = results.diagnostics && results.diagnostics.some((diagnostic: any) => diagnostic.level === 'error');

  if (hasErrors) {
    const msg = results.diagnostics
      .map((diagnostic: any) => {
        let m = '';
        if (diagnostic.relFilePath) {
          m += diagnostic.relFilePath;
          if (typeof diagnostic.lineNumber === 'number') {
            m += `:${diagnostic.lineNumber + 1}`;
            if (typeof diagnostic.columnNumber === 'number') {
              m += `:${diagnostic.columnNumber}`;
            }
          }
          m += '\n';
        }
        m += diagnostic.messageText;
        return m;
      })
      .join('\n\n');
    throw new Error(msg);
  }

  return results.code || sourceText;
}

/**
 * Get file extension from path.
 */
function getFileExtension(filePath: string): string {
  return (filePath.split('.').pop() ?? '').toLowerCase().split('?')[0];
}

/**
 * Transform CSS to a CommonJS module.
 */
function transformCSS(sourceText: string): string {
  return `module.exports = ${JSON.stringify(sourceText)};`;
}

// eslint-disable-next-line import/no-default-export
export default JestStencilPreprocessor;
