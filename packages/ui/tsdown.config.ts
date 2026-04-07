import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/preset.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  inlineOnly: false,
  external: [
    '@ark-ui/react',
    '@pandacss/dev',
    '@pandacss/types',
    'react',
    'react-dom',
    'react/jsx-runtime',
  ],
})
