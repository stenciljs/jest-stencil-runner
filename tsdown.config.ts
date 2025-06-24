import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    platform: 'neutral',
    dts: true,
    format: ['esm', 'cjs'],
  },
  {
    entry: ['./src/preset-export.ts'],
    platform: 'neutral',
    dts: true,
    format: ['esm', 'cjs'],
  },
  {
    entry: ['./src/preprocessor-entry.ts'],
    platform: 'neutral',
    dts: true,
    format: ['esm', 'cjs'],
  },
  {
    entry: ['./src/setup-entry.ts'],
    platform: 'neutral',
    dts: true,
    format: ['esm', 'cjs'],
  },
])
