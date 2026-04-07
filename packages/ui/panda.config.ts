import { defineConfig } from '@pandacss/dev'
import { revaPreset } from './src/theme'

export default defineConfig({
  presets: [revaPreset],
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  outExtension: 'js',
  jsxFramework: 'react',
})
