# Layout Component Documentation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Document all layout components from `@reva/ui` in the docs site under a "Layout" section, rename Divider → Separator, and restructure docs into nested category folders.

**Architecture:** Two workstreams executed sequentially — (1) rename `Divider` → `Separator` in `@reva/ui` with build verification, then (2) restructure the docs site into nested category folders and author 6 priority component pages with live `ComponentPreview` demos plus 11 placeholder pages. `DecorativeBox` (internal docs utility) is used inside layout examples as a visual placeholder — it stays in the library but its docs page is removed.

**Tech Stack:** TypeScript, React, Panda CSS, Fumadocs (MDX), `@reva/ui`, `bun`

**Design spec:** `docs/superpowers/specs/2026-04-07-layout-component-docs-design.md`

---

### Task 1: Rename Divider → Separator in @reva/ui

**Files:**

- Rename: `packages/ui/src/components/divider/index.tsx` → `packages/ui/src/components/separator/index.tsx`
- Modify: `packages/ui/src/components/stack/index.tsx`
- Modify: `packages/ui/src/index.ts`
- **Step 1: Rename the directory and update the component file**

Rename directory `packages/ui/src/components/divider/` → `packages/ui/src/components/separator/`.

Update `packages/ui/src/components/separator/index.tsx` to:

```tsx
import { Divider as BaseSeparator, type DividerProps as BaseSeparatorProps } from 'styled-system/jsx'

export interface SeparatorProps extends BaseSeparatorProps {}

export const Separator = BaseSeparator
Separator.displayName = 'Separator'
```

Note: Panda CSS generates the JSX component as `Divider` — we alias it to `Separator` on import. The underlying CSS pattern is unchanged.

- **Step 2: Update Stack to import Separator**

In `packages/ui/src/components/stack/index.tsx`, change line 5:

```tsx
// Before:
import { Divider } from '../divider'

// After:
import { Separator } from '../separator'
```

And update the usage on line 41:

```tsx
// Before:
<Divider orientation={orientation} />

// After:
<Separator orientation={orientation} />
```

- **Step 3: Update package exports**

In `packages/ui/src/index.ts`, change line 22:

```tsx
// Before:
export { Divider, type DividerProps } from './components/divider'

// After:
export { Separator, type SeparatorProps } from './components/separator'
```

- **Step 4: Build and verify**

```bash
cd packages/ui && bun run build
```

Expected: Build succeeds with no errors. `Separator` and `SeparatorProps` appear in the dist output.

- **Step 5: Commit**

```bash
git add -A
git commit -m "rename: Divider → Separator in @reva/ui

Aligns with Ark UI, Chakra v3, and WAI-ARIA conventions.
Panda's Divider JSX pattern is aliased to Separator on export."
```

---

### Task 2: Restructure docs into nested category folders

**Files:**

- Modify: `apps/docs/content/docs/components/meta.json`
- Create: `apps/docs/content/docs/components/buttons/meta.json`
- Move: `apps/docs/content/docs/components/button.mdx` → `apps/docs/content/docs/components/buttons/button.mdx`
- Delete: `apps/docs/content/docs/components/decorative-box.mdx`
- Create: `apps/docs/content/docs/components/layout/meta.json`
- **Step 1: Create the buttons folder and move button.mdx**

```bash
mkdir -p apps/docs/content/docs/components/buttons
mv apps/docs/content/docs/components/button.mdx apps/docs/content/docs/components/buttons/button.mdx
```

Create `apps/docs/content/docs/components/buttons/meta.json`:

```json
{
  "title": "Buttons",
  "pages": ["button"]
}
```

- **Step 2: Create the layout folder with meta.json**

```bash
mkdir -p apps/docs/content/docs/components/layout
```

Create `apps/docs/content/docs/components/layout/meta.json`:

```json
{
  "title": "Layout",
  "pages": [
    "box", "container", "flex", "grid", "spacer", "stack",
    "---",
    "absolute-center", "aspect-ratio", "bleed", "center",
    "circle", "float", "link-overlay", "separator", "square",
    "visually-hidden", "wrap"
  ]
}
```

- **Step 3: Update the root components meta.json**

Replace `apps/docs/content/docs/components/meta.json` with:

```json
{
  "title": "Reva UI",
  "description": "The component library",
  "icon": "LayoutGrid",
  "root": true,
  "pages": ["index", "buttons", "layout"]
}
```

- **Step 4: Remove decorative-box docs page and its example files**

```bash
rm apps/docs/content/docs/components/decorative-box.mdx
rm -rf apps/docs/examples/decorative-box
```

The layout component examples import `DecorativeBox` from `@reva/ui` directly — these example files were only used by the now-deleted docs page.

- **Step 5: Build and verify**

```bash
cd apps/docs && bun run build
```

Expected: Build succeeds. The sidebar shows "Buttons" and "Layout" as category groups under "Reva UI". Button page resolves at `/docs/components/buttons/button`.

- **Step 6: Commit**

```bash
git add -A
git commit -m "docs: restructure components into nested category folders

Move Button under Buttons group, create Layout folder structure,
remove DecorativeBox docs page (internal utility)."
```

---

### Task 3: Create placeholder pages for deferred layout components

**Files:**

- Create: 11 MDX files in `apps/docs/content/docs/components/layout/`
- **Step 1: Create all 11 placeholder MDX files**

Each file follows this template (customise `title` and `description` per component):

Create `apps/docs/content/docs/components/layout/absolute-center.mdx`:

```mdx
---
title: Absolute Center
description: Centers an element absolutely within its closest positioned parent.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { AbsoluteCenter } from '@reva/ui'
```

```

Create `apps/docs/content/docs/components/layout/aspect-ratio.mdx`:

```mdx
---
title: Aspect Ratio
description: Constrains a child element to a specific width-to-height ratio.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { AspectRatio } from '@reva/ui'
```

```

Create `apps/docs/content/docs/components/layout/bleed.mdx`:

```mdx
---
title: Bleed
description: Extends a child element beyond its parent's padding to the edge of the container.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { Bleed } from '@reva/ui'
```

```

Create `apps/docs/content/docs/components/layout/center.mdx`:

```mdx
---
title: Center
description: Centers its content both horizontally and vertically using flexbox.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { Center } from '@reva/ui'
```

```

Create `apps/docs/content/docs/components/layout/circle.mdx`:

```mdx
---
title: Circle
description: Renders a circular container with equal width and height, centred content.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { Circle } from '@reva/ui'
```

```

Create `apps/docs/content/docs/components/layout/float.mdx`:

```mdx
---
title: Float
description: Positions an element at a specific corner or edge of its parent container.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { Float } from '@reva/ui'
```

```

Create `apps/docs/content/docs/components/layout/link-overlay.mdx`:

```mdx
---
title: Link Overlay
description: Stretches a link over its parent container, making the entire area clickable.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { LinkOverlay } from '@reva/ui'
```

```

Create `apps/docs/content/docs/components/layout/separator.mdx`:

```mdx
---
title: Separator
description: A visual divider that separates content horizontally or vertically.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { Separator } from '@reva/ui'
```

```

Create `apps/docs/content/docs/components/layout/square.mdx`:

```mdx
---
title: Square
description: Renders a square container with equal width and height, centred content.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { Square } from '@reva/ui'
```

```

Create `apps/docs/content/docs/components/layout/visually-hidden.mdx`:

```mdx
---
title: Visually Hidden
description: Hides content visually while keeping it accessible to screen readers.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { VisuallyHidden } from '@reva/ui'
```

```

Create `apps/docs/content/docs/components/layout/wrap.mdx`:

```mdx
---
title: Wrap
description: Lays out children in a row that wraps to the next line when space runs out.
---

Documentation and examples are coming soon. For now, import and use the component directly:

```tsx
import { Wrap } from '@reva/ui'
```

```

- [ ] **Step 2: Build and verify**

```bash
cd apps/docs && bun run build
```

Expected: Build succeeds. All 11 placeholder pages appear in the sidebar under Layout, below the visual separator.

- **Step 3: Commit**

```bash
git add -A
git commit -m "docs: add placeholder pages for 11 deferred layout components"
```

---

### Task 4: Document Box component

**Files:**

- Create: `apps/docs/content/docs/components/layout/box.mdx`
- Create: `apps/docs/examples/box/default.tsx`
- Create: `apps/docs/examples/box/as-prop.tsx`
- Create: `apps/docs/examples/box/style-props.tsx`
- **Step 1: Create example files**

Create `apps/docs/examples/box/default.tsx`:

```tsx
'use client'

import { Box } from '@reva/ui'

export const code = `<Box p="4" bg="bg.muted" rounded="md">
  This is a Box
</Box>`

export default function BoxDefault() {
  return (
    <Box p="4" bg="bg.muted" rounded="md">
      This is a Box
    </Box>
  )
}
```

Create `apps/docs/examples/box/as-prop.tsx`:

```tsx
'use client'

import { Box } from '@reva/ui'

export const code = `<Box as="section" p="4" bg="bg.muted" rounded="md">
  Rendered as a <section> element
</Box>`

export default function BoxAsProp() {
  return (
    <Box as="section" p="4" bg="bg.muted" rounded="md">
      Rendered as a <section> element
    </Box>
  )
}
```

Create `apps/docs/examples/box/style-props.tsx`:

```tsx
'use client'

import { Box } from '@reva/ui'

export const code = `<Box
  mt="4"
  p="6"
  bg="bg.subtle"
  border="1px solid"
  borderColor="border.default"
  rounded="lg"
  color="fg.default"
  shadow="sm"
>
  Box with various style props
</Box>`

export default function BoxStyleProps() {
  return (
    <Box
      mt="4"
      p="6"
      bg="bg.subtle"
      border="1px solid"
      borderColor="border.default"
      rounded="lg"
      color="fg.default"
      shadow="sm"
    >
      Box with various style props
    </Box>
  )
}
```

- **Step 2: Create the MDX page**

Create `apps/docs/content/docs/components/layout/box.mdx`:

```mdx
---
title: Box
description: The most fundamental layout building block. Renders a div with Panda CSS style props.
---

import BoxDefault, { code as defaultCode } from '@/examples/box/default'
import BoxAsProp, { code as asPropCode } from '@/examples/box/as-prop'
import BoxStyleProps, { code as stylePropsCode } from '@/examples/box/style-props'

<ComponentPreview code={defaultCode}>
  <BoxDefault />
</ComponentPreview>

## Usage

```tsx
import { Box } from '@reva/ui'
```

## Examples

### As another element

Use the `as` prop to render a different HTML element while keeping all style props.

### Style props

Box accepts any Panda CSS style prop — spacing, colours, borders, shadows, and more.

## Props

Box accepts all Panda CSS style props. Any valid CSS property can be passed as a prop using Panda's utility naming conventions.


| Prop        | Type                | Default | Description            |
| ----------- | ------------------- | ------- | ---------------------- |
| `as`        | `React.ElementType` | `'div'` | HTML element to render |
| `className` | `string`            | —       | Additional CSS classes |


```

- [ ] **Step 3: Build and verify**

```bash
cd apps/docs && bun run build
```

Expected: Build succeeds. Box page renders at `/docs/components/layout/box` with working Preview/Code tabs.

- **Step 4: Commit**

```bash
git add -A
git commit -m "docs: add Box component documentation with examples"
```

---

### Task 5: Document Container component

**Files:**

- Create: `apps/docs/content/docs/components/layout/container.mdx`
- Create: `apps/docs/examples/container/default.tsx`
- Create: `apps/docs/examples/container/sizes.tsx`
- Create: `apps/docs/examples/container/center-content.tsx`
- **Step 1: Create example files**

Create `apps/docs/examples/container/default.tsx`:

```tsx
'use client'

import { Box, Container } from '@reva/ui'

export const code = `<Container>
  <Box p="4" bg="bg.muted" rounded="md">
    Content within a Container
  </Box>
</Container>`

export default function ContainerDefault() {
  return (
    <Container>
      <Box p="4" bg="bg.muted" rounded="md">
        Content within a Container
      </Box>
    </Container>
  )
}
```

Create `apps/docs/examples/container/sizes.tsx`:

```tsx
'use client'

import { Box, Container, VStack } from '@reva/ui'

export const code = `<VStack gap="4" w="full">
  <Container maxW="sm">
    <Box p="4" bg="bg.muted" rounded="md">sm — 640px</Box>
  </Container>
  <Container maxW="md">
    <Box p="4" bg="bg.muted" rounded="md">md — 768px</Box>
  </Container>
  <Container maxW="lg">
    <Box p="4" bg="bg.muted" rounded="md">lg — 1024px</Box>
  </Container>
  <Container maxW="xl">
    <Box p="4" bg="bg.muted" rounded="md">xl — 1280px</Box>
  </Container>
</VStack>`

export default function ContainerSizes() {
  return (
    <VStack gap="4" w="full">
      <Container maxW="sm">
        <Box p="4" bg="bg.muted" rounded="md">sm — 640px</Box>
      </Container>
      <Container maxW="md">
        <Box p="4" bg="bg.muted" rounded="md">md — 768px</Box>
      </Container>
      <Container maxW="lg">
        <Box p="4" bg="bg.muted" rounded="md">lg — 1024px</Box>
      </Container>
      <Container maxW="xl">
        <Box p="4" bg="bg.muted" rounded="md">xl — 1280px</Box>
      </Container>
    </VStack>
  )
}
```

Create `apps/docs/examples/container/center-content.tsx`:

```tsx
'use client'

import { Container } from '@reva/ui'

export const code = `<Container centerContent h="32" bg="bg.muted" rounded="md">
  Centred both horizontally and vertically
</Container>`

export default function ContainerCenterContent() {
  return (
    <Container centerContent h="32" bg="bg.muted" rounded="md">
      Centred both horizontally and vertically
    </Container>
  )
}
```

- **Step 2: Create the MDX page**

Create `apps/docs/content/docs/components/layout/container.mdx`:

```mdx
---
title: Container
description: Constrains content to a max-width and centres it horizontally.
---

import ContainerDefault, { code as defaultCode } from '@/examples/container/default'
import ContainerSizes, { code as sizesCode } from '@/examples/container/sizes'
import ContainerCenterContent, { code as centerContentCode } from '@/examples/container/center-content'

<ComponentPreview code={defaultCode}>
  <ContainerDefault />
</ComponentPreview>

## Usage

```tsx
import { Container } from '@reva/ui'
```

## Examples

### Max-width sizes

Use the `maxW` prop to constrain the container to a specific breakpoint width.

### Center content

Use the `centerContent` prop to centre content both horizontally and vertically within the container.

## Props


| Prop            | Type      | Default | Description                                |
| --------------- | --------- | ------- | ------------------------------------------ |
| `maxW`          | `'sm'     | 'md'    | 'lg'                                       |
| `centerContent` | `boolean` | `false` | Centre content horizontally and vertically |
| `className`     | `string`  | —       | Additional CSS classes                     |


```

- [ ] **Step 3: Build and verify**

```bash
cd apps/docs && bun run build
```

Expected: Build succeeds. Container page renders at `/docs/components/layout/container`.

- **Step 4: Commit**

```bash
git add -A
git commit -m "docs: add Container component documentation with examples"
```

---

### Task 6: Document Flex component

**Files:**

- Create: `apps/docs/content/docs/components/layout/flex.mdx`
- Create: `apps/docs/examples/flex/default.tsx`
- Create: `apps/docs/examples/flex/direction.tsx`
- Create: `apps/docs/examples/flex/align-justify.tsx`
- **Step 1: Create example files**

Create `apps/docs/examples/flex/default.tsx`:

```tsx
'use client'

import { DecorativeBox, Flex } from '@reva/ui'

export const code = `<Flex gap="4">
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
</Flex>`

export default function FlexDefault() {
  return (
    <Flex gap="4">
      <DecorativeBox h="16" w="24" />
      <DecorativeBox h="16" w="24" />
      <DecorativeBox h="16" w="24" />
    </Flex>
  )
}
```

Create `apps/docs/examples/flex/direction.tsx`:

```tsx
'use client'

import { DecorativeBox, Flex, VStack } from '@reva/ui'

export const code = `{/* Row (default) */}
<Flex direction="row" gap="4">
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
</Flex>

{/* Column */}
<Flex direction="column" gap="4">
  <DecorativeBox h="8" />
  <DecorativeBox h="8" />
  <DecorativeBox h="8" />
</Flex>`

export default function FlexDirection() {
  return (
    <VStack gap="6" w="full" alignItems="stretch">
      <Flex direction="row" gap="4">
        <DecorativeBox h="16" w="24" />
        <DecorativeBox h="16" w="24" />
        <DecorativeBox h="16" w="24" />
      </Flex>
      <Flex direction="column" gap="4">
        <DecorativeBox h="8" />
        <DecorativeBox h="8" />
        <DecorativeBox h="8" />
      </Flex>
    </VStack>
  )
}
```

Create `apps/docs/examples/flex/align-justify.tsx`:

```tsx
'use client'

import { DecorativeBox, Flex } from '@reva/ui'

export const code = `<Flex gap="4" align="center" justify="space-between" h="32" bg="bg.subtle" p="4" rounded="md">
  <DecorativeBox h="8" w="16" />
  <DecorativeBox h="12" w="16" />
  <DecorativeBox h="10" w="16" />
</Flex>`

export default function FlexAlignJustify() {
  return (
    <Flex gap="4" align="center" justify="space-between" h="32" bg="bg.subtle" p="4" rounded="md">
      <DecorativeBox h="8" w="16" />
      <DecorativeBox h="12" w="16" />
      <DecorativeBox h="10" w="16" />
    </Flex>
  )
}
```

- **Step 2: Create the MDX page**

Create `apps/docs/content/docs/components/layout/flex.mdx`:

```mdx
---
title: Flex
description: A Box with display flex, providing shorthand props for flexbox layouts.
---

import FlexDefault, { code as defaultCode } from '@/examples/flex/default'
import FlexDirection, { code as directionCode } from '@/examples/flex/direction'
import FlexAlignJustify, { code as alignJustifyCode } from '@/examples/flex/align-justify'

<ComponentPreview code={defaultCode}>
  <FlexDefault />
</ComponentPreview>

## Usage

```tsx
import { Flex } from '@reva/ui'
```

## Examples

### Direction

Use the `direction` prop to control the flex direction. Defaults to `row`.

### Align and justify

Use `align` and `justify` to control cross-axis and main-axis alignment.

## Props


| Prop        | Type                                  | Default  | Description            |
| ----------- | ------------------------------------- | -------- | ---------------------- |
| `direction` | `'row'                                | 'column' | 'row-reverse'          |
| `align`     | `CSSProperties['alignItems']`         | —        | Cross-axis alignment   |
| `justify`   | `CSSProperties['justifyContent']`     | —        | Main-axis alignment    |
| `wrap`      | `CSSProperties['flexWrap']`           | —        | Whether items wrap     |
| `gap`       | `ConditionalValue<Tokens['spacing']>` | —        | Gap between items      |
| `className` | `string`                              | —        | Additional CSS classes |


```

- [ ] **Step 3: Build and verify**

```bash
cd apps/docs && bun run build
```

Expected: Build succeeds. Flex page renders at `/docs/components/layout/flex`.

- **Step 4: Commit**

```bash
git add -A
git commit -m "docs: add Flex component documentation with examples"
```

---

### Task 7: Document Grid component

**Files:**

- Create: `apps/docs/content/docs/components/layout/grid.mdx`
- Create: `apps/docs/examples/grid/default.tsx`
- Create: `apps/docs/examples/grid/template-columns.tsx`
- Create: `apps/docs/examples/grid/spanning.tsx`
- **Step 1: Create example files**

Create `apps/docs/examples/grid/default.tsx`:

```tsx
'use client'

import { DecorativeBox, Grid } from '@reva/ui'

export const code = `<Grid columns={3} gap="4">
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
</Grid>`

export default function GridDefault() {
  return (
    <Grid columns={3} gap="4">
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
    </Grid>
  )
}
```

Create `apps/docs/examples/grid/template-columns.tsx`:

```tsx
'use client'

import { DecorativeBox, Grid } from '@reva/ui'

export const code = `<Grid gridTemplateColumns="200px 1fr 1fr" gap="4">
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
</Grid>`

export default function GridTemplateColumns() {
  return (
    <Grid gridTemplateColumns="200px 1fr 1fr" gap="4">
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
    </Grid>
  )
}
```

Create `apps/docs/examples/grid/spanning.tsx`:

```tsx
'use client'

import { DecorativeBox, Grid, GridItem } from '@reva/ui'

export const code = `<Grid columns={4} gap="4">
  <GridItem colSpan={2}>
    <DecorativeBox h="16" />
  </GridItem>
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <DecorativeBox h="16" />
  <GridItem colSpan={3}>
    <DecorativeBox h="16" />
  </GridItem>
</Grid>`

export default function GridSpanning() {
  return (
    <Grid columns={4} gap="4">
      <GridItem colSpan={2}>
        <DecorativeBox h="16" />
      </GridItem>
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <DecorativeBox h="16" />
      <GridItem colSpan={3}>
        <DecorativeBox h="16" />
      </GridItem>
    </Grid>
  )
}
```

- **Step 2: Create the MDX page**

Create `apps/docs/content/docs/components/layout/grid.mdx`:

```mdx
---
title: Grid
description: A Box with display grid, plus GridItem for spanning columns and rows.
---

import GridDefault, { code as defaultCode } from '@/examples/grid/default'
import GridTemplateColumns, { code as templateColumnsCode } from '@/examples/grid/template-columns'
import GridSpanning, { code as spanningCode } from '@/examples/grid/spanning'

<ComponentPreview code={defaultCode}>
  <GridDefault />
</ComponentPreview>

## Usage

```tsx
import { Grid, GridItem } from '@reva/ui'
```

## Examples

### Template columns

Use `gridTemplateColumns` for explicit column sizing instead of the `columns` shorthand.

### Spanning columns

Use `GridItem` with `colSpan` to make items span multiple columns.

## Props

### Grid


| Prop                  | Type                                   | Default | Description                       |
| --------------------- | -------------------------------------- | ------- | --------------------------------- |
| `columns`             | `number`                               | —       | Shorthand for equal-width columns |
| `gap`                 | `ConditionalValue<Tokens['spacing']>`  | —       | Gap between grid items            |
| `gridTemplateColumns` | `CSSProperties['gridTemplateColumns']` | —       | Explicit column track sizing      |
| `gridTemplateRows`    | `CSSProperties['gridTemplateRows']`    | —       | Explicit row track sizing         |
| `className`           | `string`                               | —       | Additional CSS classes            |


### GridItem


| Prop        | Type     | Default | Description               |
| ----------- | -------- | ------- | ------------------------- |
| `colSpan`   | `number` | —       | Number of columns to span |
| `rowSpan`   | `number` | —       | Number of rows to span    |
| `colStart`  | `number` | —       | Starting column line      |
| `colEnd`    | `number` | —       | Ending column line        |
| `className` | `string` | —       | Additional CSS classes    |


```

- [ ] **Step 3: Build and verify**

```bash
cd apps/docs && bun run build
```

Expected: Build succeeds. Grid page renders at `/docs/components/layout/grid`.

- **Step 4: Commit**

```bash
git add -A
git commit -m "docs: add Grid component documentation with examples"
```

---

### Task 8: Document Spacer component

**Files:**

- Create: `apps/docs/content/docs/components/layout/spacer.mdx`
- Create: `apps/docs/examples/spacer/default.tsx`
- Create: `apps/docs/examples/spacer/vertical.tsx`
- **Step 1: Create example files**

Create `apps/docs/examples/spacer/default.tsx`:

```tsx
'use client'

import { Box, Flex, Spacer } from '@reva/ui'

export const code = `<Flex w="full">
  <Box p="4" bg="bg.muted" rounded="md">Left</Box>
  <Spacer />
  <Box p="4" bg="bg.muted" rounded="md">Right</Box>
</Flex>`

export default function SpacerDefault() {
  return (
    <Flex w="full">
      <Box p="4" bg="bg.muted" rounded="md">Left</Box>
      <Spacer />
      <Box p="4" bg="bg.muted" rounded="md">Right</Box>
    </Flex>
  )
}
```

Create `apps/docs/examples/spacer/vertical.tsx`:

```tsx
'use client'

import { Box, Flex, Spacer } from '@reva/ui'

export const code = `<Flex direction="column" h="48">
  <Box p="4" bg="bg.muted" rounded="md">Top</Box>
  <Spacer />
  <Box p="4" bg="bg.muted" rounded="md">Bottom</Box>
</Flex>`

export default function SpacerVertical() {
  return (
    <Flex direction="column" h="48">
      <Box p="4" bg="bg.muted" rounded="md">Top</Box>
      <Spacer />
      <Box p="4" bg="bg.muted" rounded="md">Bottom</Box>
    </Flex>
  )
}
```

- **Step 2: Create the MDX page**

Create `apps/docs/content/docs/components/layout/spacer.mdx`:

```mdx
---
title: Spacer
description: Creates flexible space between flex items, expanding to fill available space.
---

import SpacerDefault, { code as defaultCode } from '@/examples/spacer/default'
import SpacerVertical, { code as verticalCode } from '@/examples/spacer/vertical'

<ComponentPreview code={defaultCode}>
  <SpacerDefault />
</ComponentPreview>

## Usage

```tsx
import { Spacer } from '@reva/ui'
```

## Examples

### Vertical spacing

Spacer works in both horizontal and vertical flex layouts.

## Props

Spacer accepts all standard Panda CSS style props. It has no component-specific props — it simply applies `flex: 1` to fill available space.

```

- [ ] **Step 3: Build and verify**

```bash
cd apps/docs && bun run build
```

Expected: Build succeeds. Spacer page renders at `/docs/components/layout/spacer`.

- **Step 4: Commit**

```bash
git add -A
git commit -m "docs: add Spacer component documentation with examples"
```

---

### Task 9: Document Stack component

**Files:**

- Create: `apps/docs/content/docs/components/layout/stack.mdx`
- Create: `apps/docs/examples/stack/default.tsx`
- Create: `apps/docs/examples/stack/horizontal-vertical.tsx`
- Create: `apps/docs/examples/stack/with-separator.tsx`
- **Step 1: Create example files**

Create `apps/docs/examples/stack/default.tsx`:

```tsx
'use client'

import { DecorativeBox, Stack } from '@reva/ui'

export const code = `<Stack gap="4">
  <DecorativeBox h="12" />
  <DecorativeBox h="12" />
  <DecorativeBox h="12" />
</Stack>`

export default function StackDefault() {
  return (
    <Stack gap="4">
      <DecorativeBox h="12" />
      <DecorativeBox h="12" />
      <DecorativeBox h="12" />
    </Stack>
  )
}
```

Create `apps/docs/examples/stack/horizontal-vertical.tsx`:

```tsx
'use client'

import { DecorativeBox, HStack, VStack } from '@reva/ui'

export const code = `{/* HStack — horizontal, items centred vertically */}
<HStack gap="4">
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
  <DecorativeBox h="16" w="24" />
</HStack>

{/* VStack — vertical, items centred horizontally */}
<VStack gap="4">
  <DecorativeBox h="8" w="full" />
  <DecorativeBox h="8" w="full" />
  <DecorativeBox h="8" w="full" />
</VStack>`

export default function StackHorizontalVertical() {
  return (
    <VStack gap="6" w="full" alignItems="stretch">
      <HStack gap="4">
        <DecorativeBox h="16" w="24" />
        <DecorativeBox h="16" w="24" />
        <DecorativeBox h="16" w="24" />
      </HStack>
      <VStack gap="4">
        <DecorativeBox h="8" w="full" />
        <DecorativeBox h="8" w="full" />
        <DecorativeBox h="8" w="full" />
      </VStack>
    </VStack>
  )
}
```

Create `apps/docs/examples/stack/with-separator.tsx`:

```tsx
'use client'

import { DecorativeBox, Stack } from '@reva/ui'

export const code = `<Stack gap="4" separator>
  <DecorativeBox h="12" />
  <DecorativeBox h="12" />
  <DecorativeBox h="12" />
</Stack>`

export default function StackWithSeparator() {
  return (
    <Stack gap="4" separator>
      <DecorativeBox h="12" />
      <DecorativeBox h="12" />
      <DecorativeBox h="12" />
    </Stack>
  )
}
```

- **Step 2: Create the MDX page**

Create `apps/docs/content/docs/components/layout/stack.mdx`:

```mdx
---
title: Stack
description: Arranges children in a vertical or horizontal stack with consistent spacing. Includes HStack and VStack shorthand variants.
---

import StackDefault, { code as defaultCode } from '@/examples/stack/default'
import StackHorizontalVertical, { code as horizontalVerticalCode } from '@/examples/stack/horizontal-vertical'
import StackWithSeparator, { code as withSeparatorCode } from '@/examples/stack/with-separator'

<ComponentPreview code={defaultCode}>
  <StackDefault />
</ComponentPreview>

## Usage

```tsx
import { Stack, HStack, VStack } from '@reva/ui'
```

## Examples

### HStack and VStack

`HStack` is shorthand for `Stack` with `direction="row"` and centred vertical alignment. `VStack` is shorthand for `direction="column"` with centred horizontal alignment.

### With separator

Pass `separator` to insert a `Separator` between each item. The separator orientation is inferred from the stack direction.

## Props


| Prop        | Type                                  | Default       | Description            |
| ----------- | ------------------------------------- | ------------- | ---------------------- |
| `direction` | `'row'                                | 'column'      | 'row-reverse'          |
| `gap`       | `ConditionalValue<Tokens['spacing']>` | —             | Gap between items      |
| `separator` | `boolean                              | ReactElement` | —                      |
| `align`     | `CSSProperties['alignItems']`         | —             | Cross-axis alignment   |
| `justify`   | `CSSProperties['justifyContent']`     | —             | Main-axis alignment    |
| `className` | `string`                              | —             | Additional CSS classes |


```

- [ ] **Step 3: Build and verify**

```bash
cd apps/docs && bun run build
```

Expected: Build succeeds. Stack page renders at `/docs/components/layout/stack`.

- **Step 4: Commit**

```bash
git add -A
git commit -m "docs: add Stack component documentation with examples"
```

---

### Task 10: Final verification

- **Step 1: Full build from root**

```bash
bun run build
```

Expected: All packages and apps build successfully.

- **Step 2: Dev server spot-check**

```bash
bun run dev:docs
```

Verify in the browser:

- Sidebar shows "Buttons" group with "Button" page
- Sidebar shows "Layout" group with 6 documented + 11 placeholder pages
- Visual separator between documented and placeholder pages in sidebar
- Each priority page loads with working Preview/Code tabs
- Placeholder pages show the "coming soon" message
- No broken links or 404s
- **Step 3: Commit any final fixes**

If any adjustments are needed, fix and commit:

```bash
git add -A
git commit -m "docs: fix layout docs issues from final verification"
```

