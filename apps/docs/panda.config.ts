import { defineConfig } from '@pandacss/dev'
import { revaPreset } from '@reva/panda-preset'

export default defineConfig({
  presets: [revaPreset],
  include: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  outExtension: 'js',
  jsxFramework: 'react',
  layers: {
    base: 'panda_base',
    tokens: 'panda_tokens',
    recipes: 'panda_recipes',
    utilities: 'panda_utilities',
  },
})
