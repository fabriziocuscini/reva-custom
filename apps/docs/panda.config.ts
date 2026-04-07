import { defineConfig } from '@pandacss/dev'
import { revaPreset } from '@reva/ui/preset'

export default defineConfig({
  presets: [revaPreset],
  preflight: false,
  include: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './examples/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  outExtension: 'js',
  jsxFramework: 'react',
  staticCss: {
    recipes: '*',
  },
  layers: {
    base: 'panda_base',
    tokens: 'panda_tokens',
    recipes: 'panda_recipes',
    utilities: 'panda_utilities',
  },
})
