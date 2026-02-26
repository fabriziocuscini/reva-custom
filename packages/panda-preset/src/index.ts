import { definePreset } from '@pandacss/dev'

import { conditions } from './conditions'
import { globalCss } from './global-css'
import { keyframes } from './keyframes'
import { button } from './recipes'
import { semanticTokens } from './semantic-tokens'
import { textStyles } from './text-styles'
import { breakpoints } from './breakpoints'
import { containerSizes } from './container-sizes'
import { tokens } from './tokens'

export const revaPreset = definePreset({
  name: '@reva/panda-preset',
  conditions,
  globalCss,
  theme: {
    breakpoints,
    containerSizes,
    tokens,
    semanticTokens,
    recipes: {
      button,
    },
    keyframes,
    textStyles,
  },
})