import { createJestStencilPreset } from './preset';
import type { Config } from '@jest/types';

// Export the default preset configuration
const preset: Config.InitialOptions = createJestStencilPreset();
// eslint-disable-next-line import/no-default-export
export default preset;
