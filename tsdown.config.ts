import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    platform: 'node',
    dts: true,
    format: ['esm', 'cjs'],
  },
  {
    entry: ['./src/preset-export.ts'],
    platform: 'node',
    dts: true,
    format: ['esm', 'cjs']
  },
  {
    entry: ['./src/preprocessor.ts'],
    platform: 'node',
    dts: true,
    format: ['esm', 'cjs'],
  },
  {
    entry: ['./src/setup-entry.ts'],
    platform: 'node',
    dts: true,
    format: ['esm', 'cjs'],
    external: ['@jest/globals']
  },
  {
    entry: ['./src/snapshot.ts'],
    platform: 'node',
    dts: true,
    format: ['esm', 'cjs'],
  },
])
