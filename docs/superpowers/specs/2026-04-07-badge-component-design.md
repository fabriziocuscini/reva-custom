# Badge Component Design

Static, non-interactive data display component for status labels, categories, and metadata. Renders as an inline `<span>` with optional leading/trailing icons.

## Architecture

Single `defineRecipe` + `styled(ark.span, badge)` (Approach A — Park UI pattern). No slots, no `createStyleContext`. Icons sized via Panda's `_icon` condition (`& svg`).

### Deliverables

1. Panda CSS recipe (`packages/ui/src/components/badge/recipe.ts`)
2. React component (`packages/ui/src/components/badge/index.tsx`)
3. Preset wiring (`packages/ui/src/theme/index.ts`) + barrel export (`packages/ui/src/index.ts`)
4. Documentation page + examples (`apps/docs/`)
5. Figma master component (42-variant component set)

## Recipe

File: `packages/ui/src/components/badge/recipe.ts`

```ts
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
      brand:   { colorPalette: 'brand' },
      accent:  { colorPalette: 'accent' },
      error:   { colorPalette: 'error' },
      warning: { colorPalette: 'warning' },
      success: { colorPalette: 'success' },
      info:    { colorPalette: 'info' },
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
```

### Token mapping

| Recipe property | Token path | Category | Resolved value |
|---|---|---|---|
| `px: '2'` | `spacing.2` | spacing | 8px |
| `gap: '1'` | `spacing.1` | spacing | 4px |
| `borderRadius: 'xs'` | `radii.xs` | radii | 4px |
| `fontFamily: 'text'` | `fonts.text` | fonts | Inter Tight |
| `fontWeight: 'medium'` | `fontWeights.medium` | fontWeights | 500 |
| `letterSpacing: 'loose'` | `letterSpacings.loose` | letterSpacings | 0.04em |
| `lineHeight: '1'` | — (raw CSS) | — | 1 |
| `borderWidth: 'default'` | `borderWidths.default` | borderWidths | 1px |
| `h: '5'` | `sizes.5` | sizes | 20px |
| `h: '6'` | `sizes.6` | sizes | 24px |
| `minW: '6'` | `sizes.6` | sizes | 24px |
| `minW: '8'` | `sizes.8` | sizes | 32px |
| `fontSize: '3xs'` | `fontSizes.3xs` | fontSizes | 11px |
| `fontSize: '2xs'` | `fontSizes.2xs` | fontSizes | 12px |
| `boxSize: '3_half'` | `sizes.3_half` | sizes | 14px |
| `boxSize: '4'` | `sizes.4` | sizes | 16px |

### Variant × color semantic token paths

| Variant | `bg` | `borderColor` | `color` |
|---|---|---|---|
| solid | `colorPalette.bg.solid` | — | `colorPalette.fg.onSolid` |
| subtle | `colorPalette.bg.subtle` | — | `colorPalette.fg.default` |
| outline | `transparent` | `colorPalette.border.default` | `colorPalette.fg.default` |

## React Component

File: `packages/ui/src/components/badge/index.tsx`

```tsx
import { ark } from '@ark-ui/react/factory'
import { forwardRef, type ReactNode } from 'react'
import { styled } from 'styled-system/jsx'
import { badge, type BadgeVariantProps } from 'styled-system/recipes'

const StyledBadge = styled(ark.span, badge)

export interface BadgeProps
  extends React.ComponentProps<typeof StyledBadge>,
    BadgeVariantProps {
  iconStart?: ReactNode
  iconEnd?: ReactNode
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, iconStart, iconEnd, ...props }, ref) => (
    <StyledBadge ref={ref} {...props}>
      {iconStart}
      {children}
      {iconEnd}
    </StyledBadge>
  ),
)

Badge.displayName = 'Badge'
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `'neutral' \| 'brand' \| 'accent' \| 'error' \| 'warning' \| 'success' \| 'info'` | `'neutral'` | Semantic color palette |
| `variant` | `'solid' \| 'subtle' \| 'outline'` | `'subtle'` | Visual style |
| `size` | `'md' \| 'lg'` | `'md'` | Badge size |
| `iconStart` | `ReactNode` | — | Icon before the label |
| `iconEnd` | `ReactNode` | — | Icon after the label |
| `children` | `ReactNode` | — | Label text |
| `asChild` | `boolean` | — | Render as child element (Ark UI) |

### Consumer API

```tsx
import { Badge } from '@reva/ui'

<Badge>Default</Badge>
<Badge color="success" variant="solid">Approved</Badge>
<Badge color="error" variant="outline" size="lg">Rejected</Badge>
<Badge iconStart={<CheckIcon />}>Compliant</Badge>
<Badge iconStart={<CircleIcon />} iconEnd={<ChevronIcon />}>Active</Badge>
```

### Wiring

- Import `badge` recipe in `packages/ui/src/theme/index.ts` and add to `theme.recipes`
- Re-export `Badge` and `BadgeProps` from `packages/ui/src/index.ts`

## Documentation

### Sidebar update

Add `---Data Display---` separator and `badge` slug to `apps/docs/content/docs/components/meta.json`:

```json
{
  "pages": [
    "index",
    "---Buttons---",
    "button",
    "---Data Display---",
    "badge",
    "---Layout---",
    "box", "container", "flex", "grid", "spacer", "stack",
    "wip"
  ]
}
```

### Page

File: `apps/docs/content/docs/components/badge.mdx`

Sections:
1. Frontmatter (`title: Badge`, `description: A small label for status, category, or metadata`)
2. Default example via `<ComponentPreview>`
3. Usage (import snippet)
4. Examples: Variants, Sizes, Colors, With Icons — each with `<ComponentPreview>`
5. Props table

### Example files

All under `apps/docs/examples/badge/`:

| File | Content |
|---|---|
| `default.tsx` | `<Badge>New</Badge>` |
| `variants.tsx` | solid, subtle, outline in an `HStack` |
| `sizes.tsx` | md and lg side by side |
| `colors.tsx` | All 7 palettes displayed |
| `with-icons.tsx` | `iconStart`, `iconEnd`, both combined |

Each file: `'use client'`, imports from `@reva/ui`, exports `code` string + default component.

## Figma Master Component

### Component set

42 variant frames: 2 sizes × 3 style variants × 7 colors, combined via `figma.combineAsVariants()`.

### Internal auto-layout (per frame)

```
[Badge] horizontal auto-layout, center-aligned
├── IconStart (Circle icon instance, toggled by boolean)
├── Label (text node: "Badge")
└── IconEnd (Circle icon instance, toggled by boolean)
```

### Component properties

| Property | Type | Values | Default |
|---|---|---|---|
| `size` | Variant | md, lg | md |
| `variant` | Variant | solid, subtle, outline | subtle |
| `color` | Variant | neutral, brand, accent, error, warning, success, info | neutral |
| `showIconStart` | Boolean | true / false | false |
| `showIconEnd` | Boolean | true / false | false |
| `iconStart` | Instance swap | Circle (Outline, Bold) | Circle |
| `iconEnd` | Instance swap | Circle (Outline, Bold) | Circle |
| `label` | Text | — | "Badge" |

### Default icon

Circle icon from the Icon Library (file key `5384g17KMjLF7osdyA1UZT`), set to Outline format, Bold weight.

### Variable bindings

**Shared base (all variants):**

| Figma property | Variable |
|---|---|
| Padding left / right | `spacing/2` (8px) |
| Item spacing (gap) | `spacing/1` (4px) |
| Corner radius | `radii/xs` (4px) |
| Font family | `fonts/text` (Inter Tight) |
| Font weight | `fontWeights/medium` (500) |

**Hardcoded (no variable):**

| Figma property | Value |
|---|---|
| Letter spacing | 4% |
| Line height | 100% |

**Per size:**

| Property | md | lg |
|---|---|---|
| Fixed height | `sizes/5` (20px) | `sizes/6` (24px) |
| Min width | `sizes/6` (24px) | `sizes/8` (32px) |
| Font size | `fontSizes/3xs` (11px) | `fontSizes/2xs` (12px) |
| Icon width × height | `sizes/3_half` (14×14) | `sizes/4` (16×16) |

**Per variant × color:**

| Variant | Fill variable | Stroke variable | Text color variable |
|---|---|---|---|
| solid | `{palette}.bg.solid` | — | `{palette}.fg.onSolid` |
| subtle | `{palette}.bg.subtle` | — | `{palette}.fg.default` |
| outline | none | `{palette}.border.default` (1px inside) | `{palette}.fg.default` |

Where `{palette}` is the active color (neutral, brand, accent, error, warning, success, info).

## Out of Scope

- Interactive badge variants (Tag, Pill) — future components
- Hover, focus, click states
- Dismissible / closable behaviour
- Animated transitions
- Badge groups / attached badges
