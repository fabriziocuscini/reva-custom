import { defineRecipe } from '@pandacss/dev'

export const badge = defineRecipe({
  className: 'badge',
  description: 'A small label for status, category, or metadata',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'text',
    fontWeight: 'medium',
    letterSpacing: 'loose',
    lineHeight: '1',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    px: '2',
    gap: '1',
    borderRadius: 'xs',
  },
  variants: {
    color: {
      neutral: { colorPalette: 'neutral' },
      brand: { colorPalette: 'brand' },
      accent: { colorPalette: 'accent' },
      error: { colorPalette: 'error' },
      warning: { colorPalette: 'warning' },
      success: { colorPalette: 'success' },
      info: { colorPalette: 'info' },
    },
    variant: {
      solid: {
        bg: 'colorPalette.bg.solid',
        color: 'colorPalette.fg.onSolid',
      },
      subtle: {
        bg: 'colorPalette.bg.subtle',
        color: 'colorPalette.fg.default',
      },
      outline: {
        borderWidth: 'default',
        borderColor: 'colorPalette.border.default',
        color: 'colorPalette.fg.default',
        bg: 'transparent',
      },
    },
    size: {
      md: {
        h: '5',
        minW: '6',
        fontSize: '3xs',
        _icon: { boxSize: '3_half' },
      },
      lg: {
        h: '6',
        minW: '8',
        fontSize: '2xs',
        _icon: { boxSize: '4' },
      },
    },
  },
  defaultVariants: {
    color: 'neutral',
    variant: 'subtle',
    size: 'md',
  },
})
