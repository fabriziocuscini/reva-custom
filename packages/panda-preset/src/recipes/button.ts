import { defineRecipe } from '@pandacss/dev'
import btn from '@reva/tokens/panda/components/button'

export const button = defineRecipe({
  className: 'button',
  description: 'A button component',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: btn.fontFamily,
    fontWeight: btn.fontWeight,
    borderWidth: btn.borderWidth,
    borderColor: 'transparent',
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color, color, opacity',
    transitionDuration: btn.transitionDuration,
    transitionTimingFunction: 'ease-in-out',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    _disabled: {
      opacity: btn.disabledOpacity,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    _focus: {
      outline: `${btn.focusRingWidth} solid`,
      outlineColor: 'colorPalette.focusRing',
      outlineOffset: btn.focusRingOffset,
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
          bg: 'colorPalette.bg.strong',
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
        _hover: {
          bg: 'colorPalette.bg.subtle',
        },
      },
    },
    size: {
      '2xs': {
        h: btn.size['2xs'].height,
        minW: btn.size['2xs'].minWidth,
        px: btn.size['2xs'].px,
        gap: btn.size['2xs'].gap,
        fontSize: btn.size['2xs'].fontSize,
        lineHeight: btn.size['2xs'].lineHeight,
        borderRadius: btn.size['2xs'].radius,
      },
      xs: {
        h: btn.size.xs.height,
        minW: btn.size.xs.minWidth,
        px: btn.size.xs.px,
        gap: btn.size.xs.gap,
        fontSize: btn.size.xs.fontSize,
        lineHeight: btn.size.xs.lineHeight,
        borderRadius: btn.size.xs.radius,
      },
      sm: {
        h: btn.size.sm.height,
        minW: btn.size.sm.minWidth,
        px: btn.size.sm.px,
        gap: btn.size.sm.gap,
        fontSize: btn.size.sm.fontSize,
        lineHeight: btn.size.sm.lineHeight,
        borderRadius: btn.size.sm.radius,
      },
      md: {
        h: btn.size.md.height,
        minW: btn.size.md.minWidth,
        px: btn.size.md.px,
        gap: btn.size.md.gap,
        fontSize: btn.size.md.fontSize,
        lineHeight: btn.size.md.lineHeight,
        borderRadius: btn.size.md.radius,
      },
      lg: {
        h: btn.size.lg.height,
        minW: btn.size.lg.minWidth,
        px: btn.size.lg.px,
        gap: btn.size.lg.gap,
        fontSize: btn.size.lg.fontSize,
        lineHeight: btn.size.lg.lineHeight,
        borderRadius: btn.size.lg.radius,
      },
      xl: {
        h: btn.size.xl.height,
        minW: btn.size.xl.minWidth,
        px: btn.size.xl.px,
        gap: btn.size.xl.gap,
        fontSize: btn.size.xl.fontSize,
        lineHeight: btn.size.xl.lineHeight,
        borderRadius: btn.size.xl.radius,
      },
    },
  },
  defaultVariants: {
    color: 'accent',
    variant: 'solid',
    size: 'md',
  },
})
