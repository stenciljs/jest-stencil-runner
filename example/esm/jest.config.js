import path from 'node:path';
import url from 'node:url';

import { createJestStencilPreset } from 'jest-stencil-runner/preset';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default createJestStencilPreset({
  rootDir: __dirname,
});
