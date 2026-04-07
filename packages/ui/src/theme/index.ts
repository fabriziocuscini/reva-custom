import { definePreset } from '@pandacss/dev'

import { breakpoints } from './breakpoints'
import { conditions } from './conditions'
import { containerSizes } from './container-sizes'
import { keyframes } from './keyframes'
import { semanticTokens } from './semantic-tokens'
import { textStyles } from './text-styles'
import { tokens } from './tokens'
import { absoluteCenter } from '../components/absolute-center/recipe'
import { button } from '../components/button/recipe'
import { decorativeBox } from '../components/decorative-box/recipe'

export const revaPreset = definePreset({
  name: '@reva/ui',
  conditions,
  theme: {
    breakpoints,
    containerSizes,
    tokens,
    semanticTokens,
    recipes: {
      absoluteCenter,
      button,
      decorativeBox,
    },
    keyframes,
    textStyles,
  },
})
