import { defineRecipe } from '@pandacss/dev'

export const button = defineRecipe({
  className: 'button',
  description: 'A button component',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'text',
    fontWeight: 'medium',
    borderWidth: '1px',
    borderColor: 'transparent',
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color, color, opacity',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    _disabled: {
      opacity: 0.3,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    _focus: {
      outline: '2px solid',
      outlineColor: 'colorPalette.border.focusRing',
      outlineOffset: '2px',
    },
  },
  variants: {
    color: {
      accent: { colorPalette: 'accent' },
      neutral: { colorPalette: 'neutral' },
      error: { colorPalette: 'error' },
      success: { colorPalette: 'success' },
      warning: { colorPalette: 'warning' },
      info: { colorPalette: 'info' },
    },
    variant: {
      solid: {
        bg: 'colorPalette.bg.solid',
        color: 'colorPalette.fg.onSolid',
        _hover: {
          bg: 'colorPalette.bg.emphasized',
        },
      },
      subtle: {
        bg: 'colorPalette.bg.subtle',
        color: 'colorPalette.fg.default',
        _hover: {
          bg: 'colorPalette.bg.muted',
        },
      },
      outline: {
        bg: 'colorPalette.alpha.transparent',
        borderColor: 'colorPalette.border.default',
        color: 'colorPalette.fg.default',
        _hover: {
          bg: 'colorPalette.bg.subtle',
          borderColor: 'colorPalette.fg.default',
        },
      },
      ghost: {
        bg: 'colorPalette.alpha.transparent',
        color: 'colorPalette.fg.default',
        _hover: {
          bg: 'colorPalette.bg.subtle',
        },
      },
    },
    size: {
      xs: {
        h: '7',
        px: '2',
        gap: '1',
        fontSize: '2xs',
        borderRadius: 'sm',
      },
      sm: {
        h: '8',
        px: '3',
        gap: '1.5',
        fontSize: 'xs',
        borderRadius: 'sm',
      },
      md: {
        h: '10',
        px: '4',
        gap: '2',
        fontSize: 'sm',
        borderRadius: 'md',
      },
      lg: {
        h: '12',
        px: '5',
        gap: '2.5',
        fontSize: 'md',
        borderRadius: 'md',
      },
    },
  },
  defaultVariants: {
    color: 'accent',
    variant: 'solid',
    size: 'md',
  },
})
