# Layout Pattern Facades for @reva/ui

**Date:** 2026-04-05
**Status:** Approved
**Scope:** Re-export all 20 Panda CSS layout patterns as facade components in `@reva/ui`

## Goal

Make `@reva/ui` the single golden source for layout primitives. Consumers import everything from `@reva/ui` and never interact with `styled-system/jsx` directly. The underlying implementation (Panda codegen today) is transparent — any component can be swapped to a custom implementation or another library without breaking consumers.

## Decisions


| Decision               | Choice                                                    | Rationale                                                                                                                                              |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Directory structure    | Flat under `src/components/`, one directory per component | Matches existing Button convention. Validated by both Chakra UI v3 and Park UI (both use flat structure).                                              |
| Implementation pattern | Approach 2: thin facade with owned props interface        | Provides a stable public type (`FlexProps`) and a clean swap point (`export const Flex = PandaFlex`) without the overhead of wrapping in `forwardRef`. |
| Package exports        | Single `"."` entrypoint, no subpath exports               | Matches current `package.json`. Consumers do `import { Box, Flex } from '@reva/ui'`.                                                                   |
| Naming                 | Kebab-case directories, PascalCase exports                | `link-overlay/index.tsx` exports `LinkOverlay`. Consistent with existing codebase conventions.                                                         |


## Components (20)

All are Panda CSS layout patterns re-exported from `styled-system/jsx`.


| Directory          | Component        | Props type            | Panda import                            |
| ------------------ | ---------------- | --------------------- | --------------------------------------- |
| `box/`             | `Box`            | `BoxProps`            | `Box`, `BoxProps`                       |
| `flex/`            | `Flex`           | `FlexProps`           | `Flex`, `FlexProps`                     |
| `stack/`           | `Stack`          | `StackProps`          | `Stack`, `StackProps`                   |
| `hstack/`          | `HStack`         | `HStackProps`         | `HStack`, `HStackProps`                 |
| `vstack/`          | `VStack`         | `VStackProps`         | `VStack`, `VStackProps`                 |
| `spacer/`          | `Spacer`         | `SpacerProps`         | `Spacer`, `SpacerProps`                 |
| `square/`          | `Square`         | `SquareProps`         | `Square`, `SquareProps`                 |
| `circle/`          | `Circle`         | `CircleProps`         | `Circle`, `CircleProps`                 |
| `center/`          | `Center`         | `CenterProps`         | `Center`, `CenterProps`                 |
| `link-overlay/`    | `LinkOverlay`    | `LinkOverlayProps`    | `LinkOverlay`, `LinkOverlayProps`       |
| `aspect-ratio/`    | `AspectRatio`    | `AspectRatioProps`    | `AspectRatio`, `AspectRatioProps`       |
| `grid/`            | `Grid`           | `GridProps`           | `Grid`, `GridProps`                     |
| `grid-item/`       | `GridItem`       | `GridItemProps`       | `GridItem`, `GridItemProps`             |
| `wrap/`            | `Wrap`           | `WrapProps`           | `Wrap`, `WrapProps`                     |
| `container/`       | `Container`      | `ContainerProps`      | `Container`, `ContainerProps`           |
| `divider/`         | `Divider`        | `DividerProps`        | `Divider`, `DividerProps`               |
| `float/`           | `Float`          | `FloatProps`          | `Float`, `FloatProps`                   |
| `bleed/`           | `Bleed`          | `BleedProps`          | `Bleed`, `BleedProps`                   |
| `visually-hidden/` | `VisuallyHidden` | `VisuallyHiddenProps` | `VisuallyHidden`, `VisuallyHiddenProps` |
| `cq/`              | `Cq`             | `CqProps`             | `Cq`, `CqProps`                         |


## File template

Every layout component file follows this pattern:

```typescript
// src/components/{dir}/index.tsx
import {
  ComponentName as PandaComponentName,
  type ComponentNameProps as PandaComponentNameProps,
} from 'styled-system/jsx'

export interface ComponentNameProps extends PandaComponentNameProps {}

export const ComponentName = PandaComponentName
ComponentName.displayName = 'ComponentName'
```

Each file exports exactly two things: the component and its props interface.

## Barrel export

`src/index.ts` is updated to export all 20 layout components alongside existing exports:

```typescript
// Interactive components
export { Button, type ButtonProps } from './components/button'

// Layout components
export { Box, type BoxProps } from './components/box'
export { Flex, type FlexProps } from './components/flex'
export { Stack, type StackProps } from './components/stack'
export { HStack, type HStackProps } from './components/hstack'
export { VStack, type VStackProps } from './components/vstack'
export { Spacer, type SpacerProps } from './components/spacer'
export { Square, type SquareProps } from './components/square'
export { Circle, type CircleProps } from './components/circle'
export { Center, type CenterProps } from './components/center'
export { LinkOverlay, type LinkOverlayProps } from './components/link-overlay'
export { AspectRatio, type AspectRatioProps } from './components/aspect-ratio'
export { Grid, type GridProps } from './components/grid'
export { GridItem, type GridItemProps } from './components/grid-item'
export { Wrap, type WrapProps } from './components/wrap'
export { Container, type ContainerProps } from './components/container'
export { Divider, type DividerProps } from './components/divider'
export { Float, type FloatProps } from './components/float'
export { Bleed, type BleedProps } from './components/bleed'
export { VisuallyHidden, type VisuallyHiddenProps } from './components/visually-hidden'
export { Cq, type CqProps } from './components/cq'

// Utilities
export { createStyleContext } from './utils/create-style-context'
```

## Out of scope

- No new recipes in `@reva/panda-preset` (layout patterns are not recipe-based)
- No custom logic in any component (pure facades)
- No `AbsoluteCenter`, `Group`, `Sticky`, or other non-Panda layout utilities (follow-up work)
- No subpath exports (e.g., `@reva/ui/layout`)
- No changes to `panda.config.ts` (codegen already produces all 20 patterns)
- No new dependencies

## Changeset

- **20 new files**: `src/components/{name}/index.tsx` (~5 lines each)
- **1 modified file**: `src/index.ts` (add 20 export lines)
- **0 config changes**

## Future upgrades

When a layout component needs custom behaviour (e.g., Stack with separator support, Container with responsive recipe), upgrade that single file from Approach 2 (thin facade) to Approach 3 (forwardRef wrapper) or a full custom implementation. The public API (`ComponentName`, `ComponentNameProps`) stays identical — consumers never notice.