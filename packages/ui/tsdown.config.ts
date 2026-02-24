import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['@ark-ui/react', 'react', 'react-dom', 'react/jsx-runtime'],
})
