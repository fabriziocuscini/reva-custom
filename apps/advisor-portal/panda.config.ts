import { defineConfig } from '@pandacss/dev'
import { revaPreset } from '@reva/panda-preset'

export default defineConfig({
  presets: [revaPreset],
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  outExtension: 'js',
  jsxFramework: 'react',
  staticCss: {
    recipes: '*',
  },
})
