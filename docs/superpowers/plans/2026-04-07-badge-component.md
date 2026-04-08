# Badge Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Badge component end-to-end — recipe, React component, documentation, and Figma master component.

**Architecture:** Single `defineRecipe` + `styled(ark.span, badge)` pattern. Non-interactive `<span>` with optional `iconStart`/`iconEnd` props. Icons auto-sized via Panda's `_icon` condition. 42-variant Figma component set with full variable bindings.

**Tech Stack:** Panda CSS (recipe), Ark UI (factory), React (component), Fumadocs (docs), Figma Plugin API (master component)

**Spec:** `docs/superpowers/specs/2026-04-07-badge-component-design.md`

---

## File Structure

### Create


| File                                          | Responsibility              |
| --------------------------------------------- | --------------------------- |
| `packages/ui/src/components/badge/recipe.ts`  | Panda CSS recipe definition |
| `packages/ui/src/components/badge/index.tsx`  | React component             |
| `apps/docs/examples/badge/default.tsx`        | Default example             |
| `apps/docs/examples/badge/variants.tsx`       | Variants example            |
| `apps/docs/examples/badge/sizes.tsx`          | Sizes example               |
| `apps/docs/examples/badge/colors.tsx`         | Colors example              |
| `apps/docs/examples/badge/with-icons.tsx`     | Icons example               |
| `apps/docs/content/docs/components/badge.mdx` | Documentation page          |


### Modify


| File                                          | Change                                      |
| --------------------------------------------- | ------------------------------------------- |
| `packages/ui/src/theme/index.ts`              | Import badge recipe, add to `theme.recipes` |
| `packages/ui/src/index.ts`                    | Export `Badge` and `BadgeProps`             |
| `apps/docs/content/docs/components/meta.json` | Add Data Display section + badge slug       |


### Figma (via `use_figma` tool)


| Target                                 | Action                                   |
| -------------------------------------- | ---------------------------------------- |
| UI Kit file (`KziMxmqVYKmMnMpAOhBLql`) | Create Badge component set (42 variants) |


---

## Task 1: Badge Recipe

**Files:**

- Create: `packages/ui/src/components/badge/recipe.ts`
- **Step 1: Create the recipe file**

```ts
// packages/ui/src/components/badge/recipe.ts
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

- **Step 2: Commit**

```bash
git add packages/ui/src/components/badge/recipe.ts
git commit -m "feat(ui): add Badge recipe"
```

---

## Task 2: Preset Wiring

**Files:**

- Modify: `packages/ui/src/theme/index.ts`
- **Step 1: Import badge recipe and add to theme.recipes**

Add the import after the existing recipe imports, and add `badge` to the `recipes` object:

```ts
// packages/ui/src/theme/index.ts
import { definePreset } from '@pandacss/dev'

import { breakpoints } from './breakpoints'
import { conditions } from './conditions'
import { containerSizes } from './container-sizes'
import { keyframes } from './keyframes'
import { semanticTokens } from './semantic-tokens'
import { textStyles } from './text-styles'
import { tokens } from './tokens'
import { absoluteCenter } from '../components/absolute-center/recipe'
import { badge } from '../components/badge/recipe'
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
      badge,
      button,
      decorativeBox,
    },
    keyframes,
    textStyles,
  },
})
```

- **Step 2: Commit**

```bash
git add packages/ui/src/theme/index.ts
git commit -m "feat(ui): wire Badge recipe into preset"
```

---

## Task 3: React Component + Barrel Export

**Files:**

- Create: `packages/ui/src/components/badge/index.tsx`
- Modify: `packages/ui/src/index.ts`
- **Step 1: Create the component file**

```tsx
// packages/ui/src/components/badge/index.tsx
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

- **Step 2: Add Badge export to barrel**

In `packages/ui/src/index.ts`, add the Badge export after the Button line and before the Layout section:

```ts
// Interactive components
export { Button, type ButtonProps } from './components/button'

// Data display components
export { Badge, type BadgeProps } from './components/badge'

// Layout components
export { AbsoluteCenter, type AbsoluteCenterProps } from './components/absolute-center'
// ... rest unchanged
```

- **Step 3: Commit**

```bash
git add packages/ui/src/components/badge/index.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add Badge React component"
```

---

## Task 4: Codegen + Build Verification

- **Step 1: Run Panda codegen for the UI package**

```bash
cd packages/ui && bun run codegen
```

Expected: Codegen succeeds. The `styled-system/recipes` directory now contains the generated `badge` recipe artifacts.

- **Step 2: Run the full monorepo build**

```bash
cd /Users/fabriziocuscini/Development/reva && bun run build
```

Expected: All packages build successfully with zero errors. `@reva/ui` dist output includes Badge.

- **Step 3: Verify typecheck**

```bash
bun run typecheck
```

Expected: No type errors.

- **Step 4: Commit any codegen artifacts if needed**

If `styled-system/` changes are tracked (check `.gitignore`), commit them. If gitignored, skip.

---

## Task 5: Docs — Sidebar Update

**Files:**

- Modify: `apps/docs/content/docs/components/meta.json`
- **Step 1: Add Data Display section and badge slug**

```json
{
  "title": "Reva UI",
  "description": "The component library",
  "icon": "PanelsTopLeft",
  "root": true,
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

- **Step 2: Commit**

```bash
git add apps/docs/content/docs/components/meta.json
git commit -m "docs: add Data Display section with Badge to sidebar"
```

---

## Task 6: Docs — Example Files

**Files:**

- Create: `apps/docs/examples/badge/default.tsx`
- Create: `apps/docs/examples/badge/variants.tsx`
- Create: `apps/docs/examples/badge/sizes.tsx`
- Create: `apps/docs/examples/badge/colors.tsx`
- Create: `apps/docs/examples/badge/with-icons.tsx`

Each file follows the pattern: `'use client'`, import from `@reva/ui`, export `code` string + default component.

- **Step 1: Create default example**

```tsx
// apps/docs/examples/badge/default.tsx
'use client'

import { Badge } from '@reva/ui'

export const code = `<Badge>New</Badge>`

export default function BadgeDefault() {
  return <Badge>New</Badge>
}
```

- **Step 2: Create variants example**

```tsx
// apps/docs/examples/badge/variants.tsx
'use client'

import { Badge } from '@reva/ui'

export const code = `<Badge variant="solid">Solid</Badge>
<Badge variant="subtle">Subtle</Badge>
<Badge variant="outline">Outline</Badge>`

export default function BadgeVariants() {
  return (
    <>
      <Badge variant="solid">Solid</Badge>
      <Badge variant="subtle">Subtle</Badge>
      <Badge variant="outline">Outline</Badge>
    </>
  )
}
```

- **Step 3: Create sizes example**

```tsx
// apps/docs/examples/badge/sizes.tsx
'use client'

import { Badge } from '@reva/ui'

export const code = `<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`

export default function BadgeSizes() {
  return (
    <>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </>
  )
}
```

- **Step 4: Create colors example**

```tsx
// apps/docs/examples/badge/colors.tsx
'use client'

import { Badge } from '@reva/ui'

export const code = `<Badge color="neutral">Neutral</Badge>
<Badge color="brand">Brand</Badge>
<Badge color="accent">Accent</Badge>
<Badge color="error">Error</Badge>
<Badge color="warning">Warning</Badge>
<Badge color="success">Success</Badge>
<Badge color="info">Info</Badge>`

export default function BadgeColors() {
  return (
    <>
      <Badge color="neutral">Neutral</Badge>
      <Badge color="brand">Brand</Badge>
      <Badge color="accent">Accent</Badge>
      <Badge color="error">Error</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="info">Info</Badge>
    </>
  )
}
```

- **Step 5: Create with-icons example**

This example needs SVG icons. Use inline SVGs matching the `_icon` auto-sizing (no explicit size needed — the recipe handles it).

```tsx
// apps/docs/examples/badge/with-icons.tsx
'use client'

import { Badge } from '@reva/ui'

const CircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const code = `<Badge iconStart={<CircleIcon />}>With start icon</Badge>
<Badge iconEnd={<CircleIcon />}>With end icon</Badge>
<Badge iconStart={<CheckIcon />} iconEnd={<CircleIcon />}>Both icons</Badge>`

export default function BadgeWithIcons() {
  return (
    <>
      <Badge iconStart={<CircleIcon />}>With start icon</Badge>
      <Badge iconEnd={<CircleIcon />}>With end icon</Badge>
      <Badge iconStart={<CheckIcon />} iconEnd={<CircleIcon />}>Both icons</Badge>
    </>
  )
}
```

- **Step 6: Commit**

```bash
git add apps/docs/examples/badge/
git commit -m "docs: add Badge example files"
```

---

## Task 7: Docs — Badge Page

**Files:**

- Create: `apps/docs/content/docs/components/badge.mdx`
- **Step 1: Create the MDX page**

```mdx
---
title: Badge
description: A small label for status, category, or metadata.
---

import BadgeDefault, { code as defaultCode } from '@/examples/badge/default'
import BadgeVariants, { code as variantsCode } from '@/examples/badge/variants'
import BadgeSizes, { code as sizesCode } from '@/examples/badge/sizes'
import BadgeColors, { code as colorsCode } from '@/examples/badge/colors'
import BadgeWithIcons, { code as withIconsCode } from '@/examples/badge/with-icons'

<ComponentPreview code={defaultCode}>
  <BadgeDefault />
</ComponentPreview>

## Usage

```tsx
import { Badge } from '@reva/ui'
```

## Examples

### Variants

Three visual styles: `subtle` (default), `solid`, and `outline`.

### Colors

Seven semantic color palettes. Default is `neutral`.

### Sizes

Two sizes: `md` (default, 20px) and `lg` (24px).

### With Icons

Use `iconStart` and `iconEnd` props to render icons. Icons are automatically sized by the recipe.

## Props


| Prop        | Type        | Default  | Description             |
| ----------- | ----------- | -------- | ----------------------- |
| `variant`   | `'solid'    | 'subtle' | 'outline'`              |
| `color`     | `'neutral'  | 'brand'  | 'accent'                |
| `size`      | `'md'       | 'lg'`    | `'md'`                  |
| `iconStart` | `ReactNode` | —        | Icon before the label   |
| `iconEnd`   | `ReactNode` | —        | Icon after the label    |
| `asChild`   | `boolean`   | —        | Render as child element |


```

- [ ] **Step 2: Commit**

```bash
git add apps/docs/content/docs/components/badge.mdx
git commit -m "docs: add Badge documentation page"
```

---

## Task 8: Docs Dev Verification

- **Step 1: Run docs dev server**

```bash
cd /Users/fabriziocuscini/Development/reva && bun run dev:docs
```

- **Step 2: Verify Badge page renders**

Open the docs site and navigate to Reva UI → Data Display → Badge. Verify:

- Page loads without errors
- Default example renders a badge
- All 5 example sections display correctly
- Props table is formatted properly
- **Step 3: Stop dev server when verified**

---

## Task 9: Figma Master Component

> **Prerequisites:** Load `figma-use` skill before every `use_figma` call. Load `figma-generate-library` skill for component creation patterns. The Badge component goes in the UI Kit file (key: `KziMxmqVYKmMnMpAOhBLql`).

> **Icon source:** Circle icon from Icon Library (file key: `5384g17KMjLF7osdyA1UZT`), Outline format, Bold weight.

This task creates a 42-variant component set (2 sizes × 3 variants × 7 colors) with boolean toggles for icons, instance swap slots, text property, and full variable bindings.

### Sub-task 9a: Discover Variables and Icon Component

- **Step 1: Search for design token variables in the UI Kit**

Use `use_figma` to list variable collections and find the token variables that were synced from `@reva/tokens`. We need variable IDs for:

- `spacing/1`, `spacing/2`
- `radii/xs`
- `sizes/5`, `sizes/6`, `sizes/8`, `sizes/3_half`, `sizes/4`
- `fontSizes/3xs`, `fontSizes/2xs`
- `fonts/text`
- `fontWeights/medium`
- Per-palette semantic colors: `{palette}.bg.solid`, `{palette}.bg.subtle`, `{palette}.border.default`, `{palette}.fg.onSolid`, `{palette}.fg.default` for all 7 palettes

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync()
for (const col of collections) {
  console.log(col.name, col.id, col.variableIds.length)
}
```

Then retrieve individual variables by iterating collection variable IDs and matching by name.

- **Step 2: Find the Circle icon in the Icon Library**

Use `figma_search_components` or `use_figma` to search for the Circle component in the Icon Library file. Get the component key for instantiation via `importComponentByKeyAsync`.

### Sub-task 9b: Create Badge Variant Frames

- **Step 3: Create a Section for the Badge component**

```js
const section = figma.createSection()
section.name = 'Badge'
section.x = 0
section.y = 0
```

- **Step 4: Build the 42 variant frames**

For each combination of `size` (md, lg) × `variant` (solid, subtle, outline) × `color` (neutral, brand, accent, error, warning, success, info):

1. Create a component frame
2. Set auto-layout: horizontal, center-aligned vertically and horizontally
3. Set padding (0 vertical, 8px horizontal), gap (4px), corner radius (4px)
4. Set fixed height (20px for md, 24px for lg), min width (24px for md, 32px for lg)
5. Set fill based on variant (solid/subtle get a fill; outline gets no fill + stroke)
6. Add IconStart instance (Circle, Outline, Bold) — set to hidden by default
7. Add Label text node ("Badge") — set font, size, weight, letter spacing 4%, line height 100%
8. Add IconEnd instance (Circle, Outline, Bold) — set to hidden by default
9. Set icon instances to fixed dimensions (14×14 for md, 16×16 for lg)
10. Bind all dimensional properties to Figma variables
11. Bind fill/stroke/text-color to semantic color variables for the specific palette
12. Set variant property name: `size=md, variant=subtle, color=neutral` (Figma variant naming)

```js
const sizes = ['md', 'lg']
const variants = ['solid', 'subtle', 'outline']
const colors = ['neutral', 'brand', 'accent', 'error', 'warning', 'success', 'info']

const components = []

for (const size of sizes) {
  for (const variant of variants) {
    for (const color of colors) {
      const frame = figma.createComponent()
      frame.name = `size=${size}, variant=${variant}, color=${color}`

      // Auto-layout
      frame.layoutMode = 'HORIZONTAL'
      frame.primaryAxisAlignItems = 'CENTER'
      frame.counterAxisAlignItems = 'CENTER'
      frame.paddingLeft = 8
      frame.paddingRight = 8
      frame.paddingTop = 0
      frame.paddingBottom = 0
      frame.itemSpacing = 4
      frame.cornerRadius = 4

      // Size
      frame.layoutSizingHorizontal = 'HUG'
      frame.layoutSizingVertical = 'FIXED'
      frame.resize(frame.width, size === 'md' ? 20 : 24)
      frame.minWidth = size === 'md' ? 24 : 32

      // Fill / stroke based on variant
      // (bind to variables — see step 5 for variable binding)

      // Add children: iconStart, label, iconEnd
      // ... (detailed in step 5)

      components.push(frame)
    }
  }
}
```

### Sub-task 9c: Combine and Configure Component Set

- **Step 5: Combine into component set**

```js
const componentSet = figma.combineAsVariants(components, section)
componentSet.name = 'Badge'
```

- **Step 6: Add boolean properties for icon visibility**

After combining, configure component properties on the set:

- `showIconStart` (boolean, default: false) — controls IconStart visibility
- `showIconEnd` (boolean, default: false) — controls IconEnd visibility
- **Step 7: Add text property for label**

Expose the label text node as a text component property named `label`.

- **Step 8: Add instance swap properties for icons**

Expose IconStart and IconEnd as instance swap properties, with Circle (Outline, Bold) as the default.

### Sub-task 9d: Variable Bindings

- **Step 9: Bind dimensional variables**

For each variant frame, bind:

- `paddingLeft` / `paddingRight` → `spacing/2`
- `itemSpacing` → `spacing/1`
- `cornerRadius` → `radii/xs`
- Frame height → `sizes/5` (md) or `sizes/6` (lg)
- Frame minWidth → `sizes/6` (md) or `sizes/8` (lg)
- Label fontSize → `fontSizes/3xs` (md) or `fontSizes/2xs` (lg)
- Label fontFamily → `fonts/text`
- Label fontWeight → `fontWeights/medium`
- Icon width/height → `sizes/3_half` (md) or `sizes/4` (lg)

```js
await frame.setBoundVariable('paddingLeft', spacingVar2)
await frame.setBoundVariable('paddingRight', spacingVar2)
await frame.setBoundVariable('itemSpacing', spacingVar1)
await frame.setBoundVariable('cornerRadius', radiiXsVar)
// ... etc for each property
```

- **Step 10: Bind color variables**

For each frame, based on its `variant` and `color`:

**solid:** bind fill to `{color}.bg.solid`, text color to `{color}.fg.onSolid`, icon color to `{color}.fg.onSolid`
**subtle:** bind fill to `{color}.bg.subtle`, text color to `{color}.fg.default`, icon color to `{color}.fg.default`
**outline:** remove fill, bind stroke to `{color}.border.default` (1px inside), text color to `{color}.fg.default`, icon color to `{color}.fg.default`

- **Step 11: Set hardcoded typography values**

For all label text nodes:

- Letter spacing: `{ value: 4, unit: 'PERCENT' }`
- Line height: `{ value: 100, unit: 'PERCENT' }`

These are NOT bound to variables (per spec).

- **Step 12: Visual verification**

Take a screenshot of the completed component set to verify:

- All 42 variants render correctly
- Colors are visually distinct
- Icons are properly sized and centered
- Typography looks correct
- **Step 13: Commit (docs only — Figma is external)**

No git commit needed for Figma work. Note completion in the task tracker.

---

## Verification Checklist

After all tasks are complete, verify:

- `bun run build` passes with zero errors
- `bun run typecheck` passes with zero errors
- `bun run lint` passes (or only pre-existing warnings)
- Docs site renders the Badge page with all examples
- Figma component set has 42 variants with correct variable bindings
- Badge is importable: `import { Badge } from '@reva/ui'`

