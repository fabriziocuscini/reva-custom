# DecorativeBox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a token-driven `DecorativeBox` component to `@reva/ui` for docs placeholders, plus docs examples that demonstrate it in layout snippets.

**Architecture:** Define a single Panda recipe in `@reva/panda-preset`, consume it via a `styled(ark.div, decorativeBox)` wrapper in `@reva/ui`, and expose usage in docs through `ComponentPreview` examples. Keep the API minimal (no custom props) and rely on Box-compatible props for sizing/layout.

**Tech Stack:** TypeScript, Panda CSS (`defineRecipe`, `styled`, semantic tokens), Ark UI (`ark.div`), Fumadocs MDX, Bun

**Spec:** `docs/superpowers/specs/2026-04-06-decorative-box-design.md`

---

## File Structure

**Create (5 files):**

- `packages/panda-preset/src/recipes/decorative-box.ts` - Recipe definition
- `packages/ui/src/components/decorative-box/index.tsx` - UI wrapper component
- `apps/docs/examples/decorative-box/default.tsx` - Basic usage preview example
- `apps/docs/examples/decorative-box/grid.tsx` - Grid placeholder example
- `apps/docs/content/docs/components/decorative-box.mdx` - Component docs page

**Modify (3 files):**

- `packages/panda-preset/src/recipes/index.ts` - Export new recipe
- `packages/panda-preset/src/index.ts` - Register recipe in preset
- `packages/ui/src/index.ts` - Export `DecorativeBox`

---

### Task 1: Add `decorativeBox` recipe to `@reva/panda-preset`

**Files:**

- Create: `packages/panda-preset/src/recipes/decorative-box.ts`
- Modify: `packages/panda-preset/src/recipes/index.ts`
- Modify: `packages/panda-preset/src/index.ts`
- **Step 1: Create the recipe file**

```ts
// packages/panda-preset/src/recipes/decorative-box.ts
import { defineRecipe } from '@pandacss/dev'

export const decorativeBox = defineRecipe({
  className: 'decorative-box',
  base: {
    height: '100%',
    borderRadius: 'xs',
    backgroundColor: 'neutral.alpha.a200',
    backgroundClip: 'padding-box',
    borderWidth: 'default',
    borderStyle: 'solid',
    borderColor: 'neutral.alpha.a300',
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")',
  },
})
```

- **Step 2: Export the recipe from the recipes barrel**

Update `packages/panda-preset/src/recipes/index.ts` to:

```ts
export { absoluteCenter } from './absolute-center'
export { button } from './button'
export { decorativeBox } from './decorative-box'
```

- **Step 3: Register the recipe in preset theme**

Update import in `packages/panda-preset/src/index.ts`:

```ts
import { absoluteCenter, button, decorativeBox } from './recipes'
```

Update `theme.recipes` in the same file:

```ts
recipes: {
  absoluteCenter,
  button,
  decorativeBox,
},
```

- **Step 4: Build preset to verify recipe compiles**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/panda-preset && bunx tsdown`

Expected: build succeeds with no TypeScript or bundling errors.

- **Step 5: Commit Task 1**

```bash
cd /Users/fabriziocuscini/Development/reva
git add \
  packages/panda-preset/src/recipes/decorative-box.ts \
  packages/panda-preset/src/recipes/index.ts \
  packages/panda-preset/src/index.ts
git commit -m "feat(panda-preset): add decorativeBox recipe for docs placeholders"
```

---

### Task 2: Add `DecorativeBox` component to `@reva/ui`

**Files:**

- Create: `packages/ui/src/components/decorative-box/index.tsx`
- Modify: `packages/ui/src/index.ts`
- **Step 1: Run codegen so UI package has new recipe types**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bun run codegen`

Expected: `styled-system/recipes` includes `decorative-box` artifacts.

- **Step 2: Create component wrapper**

```tsx
// packages/ui/src/components/decorative-box/index.tsx
import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { styled } from 'styled-system/jsx'
import { decorativeBox } from 'styled-system/recipes'

export type DecorativeBoxProps = ComponentProps<typeof DecorativeBox>
export const DecorativeBox = styled(ark.div, decorativeBox)
DecorativeBox.displayName = 'DecorativeBox'
```

- **Step 3: Export from UI barrel**

Add to `packages/ui/src/index.ts` under layout components:

```ts
export { DecorativeBox, type DecorativeBoxProps } from './components/decorative-box'
```

- **Step 4: Validate typecheck and build**

Run:

1. `cd /Users/fabriziocuscini/Development/reva/packages/ui && bunx tsc --noEmit`
2. `cd /Users/fabriziocuscini/Development/reva/packages/ui && bunx tsdown`

Expected: both commands pass.

- **Step 5: Commit Task 2**

```bash
cd /Users/fabriziocuscini/Development/reva
git add \
  packages/ui/src/components/decorative-box/index.tsx \
  packages/ui/src/index.ts
git commit -m "feat(ui): add DecorativeBox component"
```

---

### Task 3: Add docs examples and docs page

**Files:**

- Create: `apps/docs/examples/decorative-box/default.tsx`
- Create: `apps/docs/examples/decorative-box/grid.tsx`
- Create: `apps/docs/content/docs/components/decorative-box.mdx`
- **Step 1: Create default example**

```tsx
// apps/docs/examples/decorative-box/default.tsx
'use client'

import { DecorativeBox } from '@reva/ui'

export const code = `<DecorativeBox h="16" w="48" />`

export default function DecorativeBoxDefault() {
  return <DecorativeBox h="16" w="48" />
}
```

- **Step 2: Create grid example**

```tsx
// apps/docs/examples/decorative-box/grid.tsx
'use client'

import { DecorativeBox, Grid } from '@reva/ui'

export const code = `<Grid columns="3" gap="3" rows="repeat(2, 64px)" width="auto">
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
</Grid>`

export default function DecorativeBoxGrid() {
  return (
    <Grid columns="3" gap="3" rows="repeat(2, 64px)" width="auto">
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Grid>
  )
}
```

- **Step 3: Create component docs page**

```mdx
---
title: DecorativeBox
description: A decorative placeholder block for documentation previews and layout examples.
---

import DecorativeBoxDefault, { code as defaultCode } from '@/examples/decorative-box/default'
import DecorativeBoxGrid, { code as gridCode } from '@/examples/decorative-box/grid'

<ComponentPreview code={defaultCode}>
  <DecorativeBoxDefault />
</ComponentPreview>

## Usage

```tsx
import { DecorativeBox } from '@reva/ui'
```

## Examples

### Grid placeholders

Use `DecorativeBox` when demonstrating layout structure without final content.

## Props

`DecorativeBox` supports the same props as `Box` and other layout primitives from `@reva/ui`.

```

- **Step 4: Run docs typecheck/build smoke**

Run:

1. `cd /Users/fabriziocuscini/Development/reva/apps/docs && bunx tsc --noEmit`
2. `cd /Users/fabriziocuscini/Development/reva/apps/docs && bun run build`

Expected: docs package builds successfully and new page is included.

- **Step 5: Commit Task 3**

```bash
cd /Users/fabriziocuscini/Development/reva
git add \
  apps/docs/examples/decorative-box/default.tsx \
  apps/docs/examples/decorative-box/grid.tsx \
  apps/docs/content/docs/components/decorative-box.mdx
git commit -m "docs: add DecorativeBox examples and component page"
```

---

### Task 4: End-to-end verification

**Files:** none (verification only)

- **Step 1: Run workspace lint**

Run: `cd /Users/fabriziocuscini/Development/reva && bun run lint`

Expected: lint passes for touched packages.

- **Step 2: Run workspace typecheck**

Run: `cd /Users/fabriziocuscini/Development/reva && bun run typecheck`

Expected: typecheck passes.

- **Step 3: Verify `DecorativeBox` export from built UI package**

Run:

`cd /Users/fabriziocuscini/Development/reva/packages/ui && node -e "import('./dist/index.mjs').then(m => console.log(m.DecorativeBox ? 'DecorativeBox: OK' : 'DecorativeBox: MISSING'))"`

Expected: `DecorativeBox: OK`

- **Step 4: Optional visual smoke in docs dev server**

Run: `cd /Users/fabriziocuscini/Development/reva && bun run dev`

Check manually:

- `/docs/components/decorative-box` page renders
- default example and grid example show diagonal striped placeholders
- style remains readable in light/dark mode
- **Step 5: Commit Task 4 (if verification edits were needed)**

```bash
cd /Users/fabriziocuscini/Development/reva
git add -A
git commit -m "chore: finalize DecorativeBox verification fixes"
```

