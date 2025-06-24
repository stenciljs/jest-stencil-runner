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
    if (shouldTransform(sourcePath, sourceText)) {
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
      
      if (ext === 'js' || ext === 'mjs') {
        // Handle JavaScript/ESM files
        return {
          code: transformJavaScript(sourceText),
        };
      }
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
    const key = [
      process.version,
      sourceText,
      sourcePath,
      JSON.stringify(options),
      'stencil-jest-preprocessor-v3',
    ];

    return key.join(':');
  },
};

/**
 * Transpile TypeScript/JSX using Stencil's transpiler.
 */
function transpileWithStencil(sourceText: string, sourcePath: string, options: TransformOptions): string {
  try {
    // Try to use Stencil's transpiler
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
      const msg = results.diagnostics.map((diagnostic: any) => {
        let m = '';
        if (diagnostic.relFilePath) {
          m += diagnostic.relFilePath;
          if (typeof diagnostic.lineNumber === 'number') {
            m += ':' + (diagnostic.lineNumber + 1);
            if (typeof diagnostic.columnNumber === 'number') {
              m += ':' + diagnostic.columnNumber;
            }
          }
          m += '\n';
        }
        m += diagnostic.messageText;
        return m;
      }).join('\n\n');
      throw new Error(msg);
    }
    
    return results.code || sourceText;
  } catch (error) {
    // Fallback to simple TypeScript transformation if Stencil transpiler fails
    console.warn(`Stencil transpiler failed for ${sourcePath}, falling back to simple transformation:`, error);
    return transformTypeScript(sourceText);
  }
}

/**
 * Simple fallback TypeScript transformation.
 */
function transformTypeScript(sourceText: string): string {
  // Basic transformation - remove decorators and convert to CommonJS
  let transformed = sourceText;
  
  // Remove Stencil decorators (basic approach)
  transformed = transformed.replace(/@\w+\([^)]*\)\s*/g, '');
  transformed = transformed.replace(/@\w+\s*/g, '');
  
  // Transform import statements to require
  transformed = transformed.replace(
    /import\s+(.+?)\s+from\s+['"](.+?)['"];?/g,
    'const $1 = require("$2");'
  );
  
  // Transform export default
  transformed = transformed.replace(
    /export\s+default\s+(.+);?/g,
    'module.exports = $1;'
  );
  
  // Transform named exports
  transformed = transformed.replace(
    /export\s+\{([^}]+)\}/g,
    (match, exports) => {
      const exportList = exports.split(',').map((exp: string) => exp.trim());
      return exportList.map((exp: string) => `module.exports.${exp} = ${exp};`).join('\n');
    }
  );
  
  return transformed;
}

/**
 * Determine if a file should be transformed.
 */
function shouldTransform(filePath: string, sourceText: string): boolean {
  const ext = getFileExtension(filePath);

  if (isTypeScriptFile(ext) || ext === 'jsx') {
    return true;
  }
  if (ext === 'mjs') {
    return true;
  }
  if (ext === 'js') {
    // Transform JS files that use ES modules
    if (sourceText.includes('import ') || 
        sourceText.includes('import.') || 
        sourceText.includes('import(') ||
        sourceText.includes('export ')) {
      return true;
    }
  }
  if (ext === 'css') {
    return true;
  }
  return false;
}

/**
 * Get file extension from path.
 */
function getFileExtension(filePath: string): string {
  return (filePath.split('.').pop() ?? '').toLowerCase().split('?')[0];
}

/**
 * Check if file is a TypeScript file.
 */
function isTypeScriptFile(ext: string): boolean {
  return ext === 'ts' || ext === 'tsx';
}

/**
 * Transform CSS to a CommonJS module.
 */
function transformCSS(sourceText: string): string {
  return `module.exports = ${JSON.stringify(sourceText)};`;
}

/**
 * Transform JavaScript/ESM files to CommonJS.
 */
function transformJavaScript(sourceText: string): string {
  // Simple ESM to CommonJS transformation
  // In a full implementation, this would use a proper transpiler
  let transformed = sourceText;
  
  // Transform import statements to require
  transformed = transformed.replace(
    /import\s+(.+?)\s+from\s+['"](.+?)['"];?/g,
    'const $1 = require("$2");'
  );
  
  // Transform export default
  transformed = transformed.replace(
    /export\s+default\s+(.+);?/g,
    'module.exports = $1;'
  );
  
  // Transform named exports
  transformed = transformed.replace(
    /export\s+\{([^}]+)\}/g,
    (match, exports) => {
      const exportList = exports.split(',').map((exp: string) => exp.trim());
      return exportList.map((exp: string) => `module.exports.${exp} = ${exp};`).join('\n');
    }
  );
  
  return transformed;
} 

export default JestStencilPreprocessor;