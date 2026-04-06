import { defineRecipe } from '@pandacss/dev'

export const decorativeBox = defineRecipe({
  className: 'decorative-box',
  base: {
    h: 'full',
    rounded: 'xs',
    bg: 'neutral.alpha.a200',
    backgroundClip: 'padding-box',
    borderWidth: 'default',
    borderStyle: 'solid',
    borderColor: 'neutral.alpha.a300',
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")',
  },
})
