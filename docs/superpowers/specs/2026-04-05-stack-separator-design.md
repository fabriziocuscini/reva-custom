# Stack Separator Support

**Date:** 2026-04-05
**Status:** Approved
**Scope:** Upgrade Stack, HStack, VStack from pattern re-exports to real components with `separator` prop support

## Goal

Add a `separator` prop to Stack that automatically injects a Divider (or custom element) between each child. HStack and VStack become thin wrappers around Stack, inheriting separator support. This is the first exercise of the facade swap-ability designed into the layout pattern architecture.

## Research

Chakra UI v3's Stack accepts a `separator` prop (React element), iterates children, and clones the separator between each with computed orientation. Reva's approach extends this with a boolean shorthand that defaults to `<Divider />`.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| `separator` prop type | `boolean \| ReactElement` | Boolean shorthand covers the 80% case; ReactElement allows full customisation |
| Default separator | `<Divider />` (when `separator={true}`) | Divider already exists in the library with orientation/thickness/color support |
| Orientation derivation | JS-level: `direction` includes `"row"` → vertical, else horizontal | Same trade-off as Chakra. Responsive direction + separator is a known limitation. |
| HStack/VStack | Wrap Stack with preset direction | Gets separator for free. Same pattern as Chakra. |
| No-separator path | Pass through to PandaStack unchanged | Zero overhead when separator is not used |

## API

```tsx
// Boolean shorthand — Divider with auto orientation
<Stack separator>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Stack>

// Custom separator element — orientation auto-set
<Stack separator={<Divider color="border.subtle" thickness="2px" />}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Stack>

// Works on HStack/VStack too
<HStack separator>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</HStack>
```

## Component implementations

### Stack

Upgraded from Approach 2 (re-export) to Approach 3 (forwardRef wrapper):

```typescript
import { Stack as BaseStack, type StackProps as BaseStackProps } from 'styled-system/jsx'
import { Divider } from '../divider'
import {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
} from 'react'

export interface StackProps extends BaseStackProps {
  separator?: boolean | ReactElement
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ separator, children, direction, ...rest }, ref) => {
    if (!separator) {
      return (
        <BaseStack ref={ref} direction={direction} {...rest}>
          {children}
        </BaseStack>
      )
    }

    const resolvedDirection =
      typeof direction === 'string' ? direction : 'column'
    const orientation =
      resolvedDirection === 'row' || resolvedDirection === 'row-reverse'
        ? 'vertical'
        : 'horizontal'
    const separatorElement =
      separator === true ? (
        <Divider orientation={orientation} />
      ) : (
        cloneElement(separator, { orientation })
      )

    const items = Children.toArray(children).filter(isValidElement)

    return (
      <BaseStack ref={ref} direction={direction} {...rest}>
        {items.map((child, i) => (
          <Fragment key={i}>
            {child}
            {i < items.length - 1 && separatorElement}
          </Fragment>
        ))}
      </BaseStack>
    )
  },
)
Stack.displayName = 'Stack'
```

### HStack

Upgraded to wrap Stack:

```typescript
import { forwardRef } from 'react'
import { Stack, type StackProps } from '../stack'

export interface HStackProps extends StackProps {}

export const HStack = forwardRef<HTMLDivElement, HStackProps>((props, ref) => (
  <Stack align="center" {...props} direction="row" ref={ref} />
))
HStack.displayName = 'HStack'
```

### VStack

Upgraded to wrap Stack:

```typescript
import { forwardRef } from 'react'
import { Stack, type StackProps } from '../stack'

export interface VStackProps extends StackProps {}

export const VStack = forwardRef<HTMLDivElement, VStackProps>((props, ref) => (
  <Stack align="center" {...props} direction="column" ref={ref} />
))
VStack.displayName = 'VStack'
```

## Changeset

| File | Action |
|------|--------|
| `packages/ui/src/components/stack/index.tsx` | Rewrite |
| `packages/ui/src/components/hstack/index.tsx` | Rewrite |
| `packages/ui/src/components/vstack/index.tsx` | Rewrite |

**3 modified files, 0 new files, 0 config changes.** Barrel exports unchanged.

## Known limitation

When `direction` is a responsive object (e.g., `{ base: 'column', md: 'row' }`), separator orientation is derived from the `base` value or defaults to `'horizontal'`. The separator does not flip at breakpoints. Workaround: use two Stacks with `hideFrom`/`hideBelow`, or manually place `<Divider orientation={{ base: 'horizontal', md: 'vertical' }} />` between children.

## Out of scope

- No new recipes
- No changes to `@reva/panda-preset`
- No changes to Divider component
- No StackSeparator component (Divider fills that role)
