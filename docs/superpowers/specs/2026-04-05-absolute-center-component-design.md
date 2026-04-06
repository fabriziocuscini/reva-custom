# AbsoluteCenter Component for @reva/ui

**Date:** 2026-04-05
**Status:** Approved
**Scope:** Add an `AbsoluteCenter` layout utility component with recipe in `@reva/panda-preset` and styled wrapper in `@reva/ui`

## Goal

Provide a layout utility that centres content within a positioned parent using `position: absolute` and CSS transforms. This complements the existing `Center` pattern (which uses flexbox flow centering) for overlay-style use cases: loading spinners on cards, badges on avatars, centred content within a `position: relative` container.

## Research

Both Chakra UI v3 and Park UI implement functionally identical `AbsoluteCenter` components with the same base styles, `axis` variant (`horizontal` | `vertical` | `both`), and RTL support via `insetStart` + `_rtl` condition overrides. The only difference is architecture:

- **Chakra v3:** Inline styles on `chakra("div", { ... })`, no separate recipe
- **Park UI:** `defineRecipe` in preset + `styled(ark.div, recipe)` in component

Park UI's architecture matches Reva's conventions exactly.

## Decisions


| Decision       | Choice                                                  | Rationale                                                                          |
| -------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Architecture   | Park UI pattern: recipe in preset, styled wrapper in UI | Matches Reva convention. Recipe is reusable across consuming apps.                 |
| Recipe type    | `defineRecipe` (single element)                         | Not a compound component — no slots needed.                                        |
| Variant        | `axis: "horizontal"                                     | "vertical"                                                                         |
| RTL support    | `insetStart` + `_rtl` condition                         | Logical property + explicit RTL override, matching both reference implementations. |
| Styled pattern | `styled(ark.div, absoluteCenter)`                       | North star pattern per component skill. No manual `forwardRef` needed.             |
| Props type     | `ComponentProps<typeof AbsoluteCenter>`                 | Park UI convention. Recipe variants become props automatically.                    |


## Recipe

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

## Component

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

## Preset registration

Recipe exported from `packages/panda-preset/src/recipes/index.ts` and registered in `theme.recipes` in `packages/panda-preset/src/index.ts`.

## Barrel export

Added to `packages/ui/src/index.ts`:

```typescript
export { AbsoluteCenter, type AbsoluteCenterProps } from './components/absolute-center'
```

## Changeset


| Package              | File                                       | Action                               |
| -------------------- | ------------------------------------------ | ------------------------------------ |
| `@reva/panda-preset` | `src/recipes/absolute-center.ts`           | Create                               |
| `@reva/panda-preset` | `src/recipes/index.ts`                     | Modify (add export)                  |
| `@reva/panda-preset` | `src/index.ts`                             | Modify (register in `theme.recipes`) |
| `@reva/ui`           | `src/components/absolute-center/index.tsx` | Create                               |
| `@reva/ui`           | `src/index.ts`                             | Modify (add barrel export)           |


**Total:** 2 new files, 3 modified files.

## Build order

1. Build `@reva/panda-preset` (`tsdown`) — recipe becomes part of published preset
2. Run `panda codegen` in `@reva/ui` — picks up new recipe from preset
3. Build `@reva/ui` (`tsdown`) — bundles the new component

## Out of scope

- No colour or size variants (pure layout utility)
- No `colorPalette` support
- No slot recipe (single element)
- No compound component parts

## Usage example

```tsx
import { AbsoluteCenter, Box } from '@reva/ui'

<Box position="relative" h="100px" bg="bg.muted">
  <AbsoluteCenter>Centred content</AbsoluteCenter>
</Box>

<Box position="relative" h="100px">
  <AbsoluteCenter axis="horizontal">Horizontally centred only</AbsoluteCenter>
</Box>
```

