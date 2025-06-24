import process from 'node:process';

import type { SyncTransformer, TransformedSource, TransformOptions } from '@jest/transform';
import { transpileSync } from '@stencil/core/compiler';

/**
 * Jest preprocessor for transforming TypeScript, JSX, and CSS files for Stencil components.
 * This uses Stencil's own transpiler to properly handle decorators and component transformations.
 *
 * @see https://jestjs.io/docs/code-transformation#writing-custom-transformers
 */
export const JestStencilPreprocessor: SyncTransformer = {
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

    if (isTypeScriptFile(ext) || ext === 'jsx') {
      // Use Stencil's transpiler for TypeScript and JSX files
      return {
        code: transpileWithStencil(sourceText, sourcePath, options),
      };
    }

    return {
      code: sourceText,
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
 *
 * @param sourceText - The source text to transpile.
 * @param sourcePath - The path to the source file.
 * @param options - The options for the transform.
 * @returns The transpiled code.
 */
function transpileWithStencil(sourceText: string, sourcePath: string, options: TransformOptions): string {
  try {
    const transpileOptions = {
      file: sourcePath,
      currentDirectory: options.config.rootDir || process.cwd(),
      componentMetadata: 'compilerstatic',
      coreImportPath: '@stencil/core/internal/testing',
      module: 'cjs', // always use commonjs since we're in a node environment
      sourceMap: 'inline' as const,
      styleImportData: 'queryparams',
      target: 'es2017', // target ES2017 for modern node
      transformAliasedImportPaths: false,
    };

    const results = transpileSync(sourceText, transpileOptions);

    // Check for errors
    const hasErrors =
      results.diagnostics && results.diagnostics.some((diagnostic: any) => diagnostic.level === 'error');

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

    let code = results.code || sourceText;

    // Ensure ES module imports are converted to CommonJS requires
    // This fixes issues where Stencil's transpiler sometimes outputs ES modules despite cjs setting
    code = convertESModulesToCommonJS(code);

    return code;
  } catch (error) {
    // Fallback: if Stencil transpiler fails completely, try to convert ES modules to CommonJS manually
    console.warn(`Stencil transpiler failed for ${sourcePath}, using fallback transformation:`, error);
    return convertESModulesToCommonJS(sourceText);
  }
}

/**
 * Get file extension from path.
 *
 * @param filePath - The path to the file.
 * @returns The file extension.
 */
function getFileExtension(filePath: string): string {
  return (filePath.split('.').pop() ?? '').toLowerCase().split('?')[0];
}

/**
 * Check if file is a TypeScript file.
 *
 * @param ext - The file extension.
 * @returns True if the file is a TypeScript file, false otherwise.
 */
function isTypeScriptFile(ext: string): boolean {
  return ext === 'ts' || ext === 'tsx';
}

/**
 * Transform CSS to a CommonJS module.
 *
 * @param sourceText - The source text to transform.
 * @returns The transformed code.
 */
function transformCSS(sourceText: string): string {
  return `module.exports = ${JSON.stringify(sourceText)};`;
}

/**
 * Convert ES module imports to CommonJS requires.
 * This ensures compatibility with Jest when Stencil's transpiler outputs ES modules.
 *
 * @param code - The code to transform.
 * @returns The transformed code with CommonJS requires.
 */
function convertESModulesToCommonJS(code: string): string {
  // Convert import statements to require statements
  // Handle: import Name from "./file.css?tag=name&encapsulation=shadow";
  code = code.replace(/import\s+(\w+)\s+from\s+["']([^"']+\.css\?[^"']+)["'];?/g, 'const $1 = require("$2");');

  // Handle: import { name } from "./file";
  code = code.replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+["']([^"']+)["'];?/g, 'const { $1 } = require("$2");');

  // Handle: import * as name from "./file";
  code = code.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+["']([^"']+)["'];?/g, 'const $1 = require("$2");');

  // Handle: import name from "./file";
  code = code.replace(/import\s+(\w+)\s+from\s+["']([^"']+)["'];?/g, 'const $1 = require("$2");');

  // Convert export statements to module.exports
  // Handle: export { name };
  code = code.replace(/export\s+\{\s*([^}]+)\s*\};?/g, 'module.exports = { $1 };');

  // Handle: export default name;
  code = code.replace(/export\s+default\s+([^;]+);?/g, 'module.exports = $1;');

  return code;
}

// eslint-disable-next-line import/no-default-export
export default JestStencilPreprocessor;
