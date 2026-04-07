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
    borderWidth: 'default',
    borderColor: 'transparent',
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color, color, opacity',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    _disabled: {
      opacity: 'disabled',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    _focus: {
      outline: 'thick solid',
      outlineColor: 'colorPalette.focusRing',
      outlineOffset: 'thick',
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
        _hover: { bg: 'colorPalette.bg.strong' },
      },
      subtle: {
        bg: 'colorPalette.bg.subtle',
        color: 'colorPalette.fg.default',
        _hover: { bg: 'colorPalette.bg.muted' },
      },
      outline: {
        bg: 'transparent',
        borderColor: 'colorPalette.border.default',
        color: 'colorPalette.fg.default',
        _hover: {
          bg: 'colorPalette.bg.subtle',
          borderColor: 'colorPalette.border.strong',
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'colorPalette.fg.default',
        _hover: { bg: 'colorPalette.bg.subtle' },
      },
    },
    size: {
      '2xs': { h: '6', minW: '6', px: '2', gap: '1', fontSize: '2xs', lineHeight: 'normal', borderRadius: 'xs' },
      xs:    { h: '7', minW: '7', px: '2', gap: '1', fontSize: 'xs', lineHeight: 'normal', borderRadius: 'sm' },
      sm:    { h: '8', minW: '8', px: '3', gap: '1', fontSize: 'xs', lineHeight: 'normal', borderRadius: 'sm' },
      md:    { h: '10', minW: '10', px: '4', gap: '2', fontSize: 'sm', lineHeight: 'normal', borderRadius: 'md' },
      lg:    { h: '12', minW: '12', px: '5', gap: '2', fontSize: 'md', lineHeight: 'normal', borderRadius: 'md' },
      xl:    { h: '14', minW: '14', px: '6', gap: '3', fontSize: 'lg', lineHeight: 'normal', borderRadius: 'lg' },
    },
  },
  defaultVariants: {
    color: 'accent',
    variant: 'solid',
    size: 'md',
  },
})
