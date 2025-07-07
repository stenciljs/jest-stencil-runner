const fs = require('node:fs');
const path = require('node:path');
const { createJestStencilPreset } = require('jest-stencil-runner');

// Resolve symlinks to their actual paths
const srcPath = path.resolve(__dirname, 'src');
const realSrcPath = fs.existsSync(srcPath) ? fs.realpathSync(srcPath) : srcPath;

module.exports = {
  ...createJestStencilPreset({
    rootDir: __dirname,
  }),
  // Add the real path to the roots so Jest can find files through symlinks
  roots: [__dirname, realSrcPath],
  // Disable watchman as it doesn't handle symlinks well
  watchman: false,
};
