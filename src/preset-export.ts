import type { Config } from '@jest/types';
import { createJestStencilPreset } from './preset';

// Export the default preset configuration
const preset: Config.InitialOptions = createJestStencilPreset();
export default preset; 
