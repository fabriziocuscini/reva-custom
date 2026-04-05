# AbsoluteCenter Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `AbsoluteCenter` layout utility component with a recipe in `@reva/panda-preset` and a styled wrapper in `@reva/ui`.

**Architecture:** `defineRecipe` in the preset (axis variant with RTL support), `styled(ark.div, recipe)` in the UI package. Follows the Park UI pattern, which is the north star for single-element Reva components.

**Tech Stack:** TypeScript, Panda CSS (`defineRecipe`, `styled`), Ark UI (`ark.div`), tsdown (build)

**Spec:** `docs/superpowers/specs/2026-04-05-absolute-center-component-design.md`

---

## File Structure

**Create (2 files):**


| File                                                   | Responsibility                     |
| ------------------------------------------------------ | ---------------------------------- |
| `packages/panda-preset/src/recipes/absolute-center.ts` | Recipe definition (`axis` variant) |
| `packages/ui/src/components/absolute-center/index.tsx` | Styled component wrapper           |


**Modify (3 files):**


| File                                         | Change                                       |
| -------------------------------------------- | -------------------------------------------- |
| `packages/panda-preset/src/recipes/index.ts` | Add `absoluteCenter` export                  |
| `packages/panda-preset/src/index.ts`         | Register `absoluteCenter` in `theme.recipes` |
| `packages/ui/src/index.ts`                   | Add barrel export                            |


---

### Task 1: Create the absoluteCenter recipe

**Files:**

- Create: `packages/panda-preset/src/recipes/absolute-center.ts`
- Modify: `packages/panda-preset/src/recipes/index.ts`
- Modify: `packages/panda-preset/src/index.ts`
- **Step 1: Create the recipe file**

```typescript
// packages/panda-preset/src/recipes/absolute-center.ts
import { defineRecipe } from '@pandacss/dev'

export const absoluteCenter = defineRecipe({
  className: 'absolute-center',
  base: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  variants: {
    axis: {
      horizontal: {
        insetStart: '50%',
        translate: '-50%',
        _rtl: { translate: '50%' },
      },
      vertical: {
        top: '50%',
        translate: '0 -50%',
      },
      both: {
        insetStart: '50%',
        top: '50%',
        translate: '-50% -50%',
        _rtl: { translate: '50% -50%' },
      },
    },
  },
  defaultVariants: {
    axis: 'both',
  },
})
```

- **Step 2: Export the recipe from the recipes barrel**

Update `packages/panda-preset/src/recipes/index.ts` to:

```typescript
export { absoluteCenter } from './absolute-center'
export { button } from './button'
```

- **Step 3: Register the recipe in the preset**

Update `packages/panda-preset/src/index.ts`. Change the import line:

```typescript
import { button } from './recipes'
```

to:

```typescript
import { absoluteCenter, button } from './recipes'
```

And change the `recipes` object:

```typescript
    recipes: {
      button,
    },
```

to:

```typescript
    recipes: {
      absoluteCenter,
      button,
    },
```

- **Step 4: Build the preset**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/panda-preset && bunx tsdown`

Expected: Clean build, no errors.

---

### Task 2: Create the AbsoluteCenter styled component

**Files:**

- Create: `packages/ui/src/components/absolute-center/index.tsx`
- Modify: `packages/ui/src/index.ts`
- **Step 1: Run Panda codegen to pick up the new recipe**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bun run codegen`

Expected: Clean codegen. `styled-system/recipes/absolute-center.js` and `styled-system/recipes/absolute-center.d.ts` are generated.

- **Step 2: Create the component file**

```typescript
// packages/ui/src/components/absolute-center/index.tsx
import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { styled } from 'styled-system/jsx'
import { absoluteCenter } from 'styled-system/recipes'

export type AbsoluteCenterProps = ComponentProps<typeof AbsoluteCenter>
export const AbsoluteCenter = styled(ark.div, absoluteCenter)
AbsoluteCenter.displayName = 'AbsoluteCenter'
```

- **Step 3: Add barrel export**

Update `packages/ui/src/index.ts`. Add after the `Button` export line:

```typescript
export { AbsoluteCenter, type AbsoluteCenterProps } from './components/absolute-center'
```

The top of the file should read:

```typescript
// Interactive components
export { Button, type ButtonProps } from './components/button'

// Layout components
export { AbsoluteCenter, type AbsoluteCenterProps } from './components/absolute-center'
export { Box, type BoxProps } from './components/box'
```

- **Step 4: Verify typecheck**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bunx tsc --noEmit`

Expected: No type errors.

---

### Task 3: Full build verification

**Files:** None (verification only)

- **Step 1: Build the preset**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/panda-preset && bunx tsdown`

Expected: Clean build.

- **Step 2: Run Panda codegen in UI**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bun run codegen`

Expected: Clean codegen, `absoluteCenter` recipe present in `styled-system/recipes/`.

- **Step 3: Typecheck UI**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bunx tsc --noEmit`

Expected: No errors.

- **Step 4: Build UI**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bunx tsdown`

Expected: Clean build.

- **Step 5: Verify export**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && node -e "import('./dist/index.mjs').then(m => console.log(m.AbsoluteCenter ? 'AbsoluteCenter: OK' : 'AbsoluteCenter: MISSING'))"`

Expected: `AbsoluteCenter: OK`

---

### Task 4: Commit

- **Step 1: Stage all changed files**

```bash
cd /Users/fabriziocuscini/Development/reva
git add \
  packages/panda-preset/src/recipes/absolute-center.ts \
  packages/panda-preset/src/recipes/index.ts \
  packages/panda-preset/src/index.ts \
  packages/ui/src/components/absolute-center/index.tsx \
  packages/ui/src/index.ts
```

- **Step 2: Commit**

```bash
git commit -m "feat(ui): add AbsoluteCenter component with recipe

Single-element layout utility for centering content within a
positioned parent using absolute positioning + transforms. Supports
axis variant (horizontal/vertical/both) with RTL support."
```

- **Step 3: Verify clean state**

Run: `git status`

Expected: Clean working tree (only untracked spec/plan docs if not yet committed).