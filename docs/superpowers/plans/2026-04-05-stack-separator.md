# Stack Separator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Stack, HStack, VStack from pattern re-exports to real components with a `separator` prop that injects a Divider between each child.

**Architecture:** Stack becomes a `forwardRef` wrapper around BaseStack (the Panda-generated pattern). When `separator` is truthy, it iterates children and injects a Divider (or custom element) between each. HStack/VStack become thin wrappers around Stack with preset direction. When `separator` is not used, Stack passes through to PandaStack with zero overhead.

**Tech Stack:** TypeScript, React (`forwardRef`, `Children`, `cloneElement`), Panda CSS patterns

**Spec:** `docs/superpowers/specs/2026-04-05-stack-separator-design.md`

---

## File Structure

**Modify (3 files):**


| File                                          | Change                                                                        |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| `packages/ui/src/components/stack/index.tsx`  | Rewrite: re-export → forwardRef wrapper around BaseStack with separator logic |
| `packages/ui/src/components/hstack/index.tsx` | Rewrite: re-export → Stack wrapper with `direction="row"`                     |
| `packages/ui/src/components/vstack/index.tsx` | Rewrite: re-export → Stack wrapper with `direction="column"`                  |


---

### Task 1: Upgrade Stack with separator support

**Files:**

- Modify: `packages/ui/src/components/stack/index.tsx`
- **Step 1: Rewrite `stack/index.tsx`**

Replace the entire file with:

```typescript
// packages/ui/src/components/stack/index.tsx
import {
  Stack as BaseStack,
  type StackProps as BaseStackProps,
} from 'styled-system/jsx'
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

- **Step 2: Verify typecheck**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bunx tsc --noEmit`

Expected: No type errors.

---

### Task 2: Upgrade HStack to wrap Stack

**Files:**

- Modify: `packages/ui/src/components/hstack/index.tsx`
- **Step 1: Rewrite `hstack/index.tsx`**

Replace the entire file with:

```typescript
// packages/ui/src/components/hstack/index.tsx
import { forwardRef } from 'react'
import { Stack, type StackProps } from '../stack'

export interface HStackProps extends StackProps {}

export const HStack = forwardRef<HTMLDivElement, HStackProps>((props, ref) => (
  <Stack align="center" {...props} direction="row" ref={ref} />
))
HStack.displayName = 'HStack'
```

- **Step 2: Verify typecheck**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bunx tsc --noEmit`

Expected: No type errors.

---

### Task 3: Upgrade VStack to wrap Stack

**Files:**

- Modify: `packages/ui/src/components/vstack/index.tsx`
- **Step 1: Rewrite `vstack/index.tsx`**

Replace the entire file with:

```typescript
// packages/ui/src/components/vstack/index.tsx
import { forwardRef } from 'react'
import { Stack, type StackProps } from '../stack'

export interface VStackProps extends StackProps {}

export const VStack = forwardRef<HTMLDivElement, VStackProps>((props, ref) => (
  <Stack align="center" {...props} direction="column" ref={ref} />
))
VStack.displayName = 'VStack'
```

- **Step 2: Verify typecheck**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bunx tsc --noEmit`

Expected: No type errors.

---

### Task 4: Full build verification

**Files:** None (verification only)

- **Step 1: Run Panda codegen**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bun run codegen`

Expected: Clean codegen.

- **Step 2: Typecheck**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bunx tsc --noEmit`

Expected: No errors.

- **Step 3: Build**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && bunx tsdown`

Expected: Clean build.

- **Step 4: Verify exports**

Run: `cd /Users/fabriziocuscini/Development/reva/packages/ui && node -e "import('./dist/index.mjs').then(m => { const names = ['Stack','HStack','VStack']; names.forEach(n => console.log(n + ': ' + (m[n] ? 'OK' : 'MISSING'))) })"`

Expected:

```
Stack: OK
HStack: OK
VStack: OK
```

---

### Task 5: Commit

- **Step 1: Stage modified files**

```bash
cd /Users/fabriziocuscini/Development/reva
git add \
  packages/ui/src/components/stack/index.tsx \
  packages/ui/src/components/hstack/index.tsx \
  packages/ui/src/components/vstack/index.tsx \
  docs/superpowers/specs/2026-04-05-stack-separator-design.md \
  docs/superpowers/plans/2026-04-05-stack-separator.md
```

- **Step 2: Commit**

```bash
git commit -m "feat(ui): add separator support to Stack, HStack, VStack

Upgrade Stack from pattern re-export to forwardRef wrapper with a
separator prop (boolean | ReactElement). When true, injects <Divider>
between children with auto-derived orientation. HStack/VStack become
thin Stack wrappers, inheriting separator support."
```

- **Step 3: Verify clean state**

Run: `git status`

Expected: Clean working tree (only untracked AGENTS.md changes remain).