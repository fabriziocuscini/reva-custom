import { defineConfig } from '@pandacss/dev'
import { revaPreset, revaGlobalCss } from '@reva/ui/preset'

export default defineConfig({
  presets: [revaPreset],
  globalCss: revaGlobalCss,
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  outExtension: 'js',
  jsxFramework: 'react',
  staticCss: {
    recipes: '*',
  },
})
