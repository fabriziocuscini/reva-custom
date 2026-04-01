# Remove Component Token Layer

**Date:** 2026-04-01
**Status:** Approved
**Scope:** `@reva/tokens`, `@reva/panda-preset`, documentation

## Problem

The design token system has three layers: foundation, semantic, and component. The component layer — currently just `button.json` — adds build pipeline complexity, an extra Figma variable collection (`Components`), and a level of indirection between recipes and the foundation tokens they ultimately reference. The Figma `Components` collection pollutes the variable panel, and some references (like `lineHeight`) silently drop out because their foundation groups are excluded from the Figma export.

The formal contract between token specs and recipes is overkill for the current workflow: components are implemented with AI assistance by referencing Figma designs directly. The component layer has already been added, removed, and re-added — a sign it doesn't carry its weight.

## Decision

Remove the component token layer entirely. The token system becomes two layers:

| Layer | Source | Purpose |
|---|---|---|
| **Foundation** | `src/foundation/*.json` | Raw scales: colours, spacing, sizes, radii, typography, etc. |
| **Semantic** | `src/colorMode/light.json`, `dark.json` | Colour roles with light/dark mode switching |

Recipes reference foundation tokens directly as inline string keys (`h: '10'`, `px: '4'`, `fontSize: 'sm'`). This is already how non-colour foundation tokens are used everywhere else in the system — the component layer was an anomaly.

## Changes

### 1. Delete source files

Remove `packages/design-tokens/src/components/` directory (`button.json`).

### 2. Remove build pipeline code (`packages/design-tokens/config/build.ts`)

- Delete `getComponentFiles()` function.
- Delete the "Component build" Style Dictionary block (the `if (componentFiles.length > 0)` section that creates `sdComponents`).
- Delete the `buildComponentSpecs()` call.
- Delete the components aggregate block in the Figma manifest section (the `if (componentFiles.length > 0)` block that builds `componentsAggregate`).
- Remove the `componentFiles` variable and its usage from the `build()` function.
- Remove the `buildComponentSpecs` import from `panda-format.ts`.

### 3. Remove Panda format helpers (`packages/design-tokens/config/panda-format.ts`)

Delete these functions (only used by component specs):
- `resolveRefToKey()`
- `stripDtcgToSpec()`
- `buildComponentSpecs()`

### 4. Remove Figma collection config (`packages/design-tokens/config/figma-collections.ts`)

Delete the `Components` entry from the `figmaCollections` array.

### 5. Remove package export (`packages/design-tokens/package.json`)

Delete the `"./panda/components/*"` export.

### 6. Rewrite Button recipe (`packages/panda-preset/src/recipes/button.ts`)

Remove `import btn from '@reva/tokens/panda/components/button'` and inline all foundation token references. The recipe becomes self-contained:

```typescript
import { defineRecipe } from '@pandacss/dev'

export const button = defineRecipe({
  className: 'button',
  description: 'A button component',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'text',
    fontWeight: 'medium',
    borderWidth: 'default',
    borderColor: 'transparent',
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color, color, opacity',
    transitionDuration: 'fast',
    transitionTimingFunction: 'ease-in-out',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    _disabled: {
      opacity: 'disabled',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    _focus: {
      outline: 'thick solid',
      outlineColor: 'colorPalette.focusRing',
      outlineOffset: 'thick',
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
        _hover: { bg: 'colorPalette.bg.strong' },
      },
      subtle: {
        bg: 'colorPalette.bg.subtle',
        color: 'colorPalette.fg.default',
        _hover: { bg: 'colorPalette.bg.muted' },
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
        _hover: { bg: 'colorPalette.bg.subtle' },
      },
    },
    size: {
      '2xs': { h: '6', minW: '6', px: '2', gap: '1', fontSize: '2xs', lineHeight: 'normal', borderRadius: 'xs' },
      xs:    { h: '7', minW: '7', px: '2', gap: '1', fontSize: 'xs', lineHeight: 'normal', borderRadius: 'sm' },
      sm:    { h: '8', minW: '8', px: '3', gap: '1', fontSize: 'xs', lineHeight: 'normal', borderRadius: 'sm' },
      md:    { h: '10', minW: '10', px: '4', gap: '2', fontSize: 'sm', lineHeight: 'normal', borderRadius: 'md' },
      lg:    { h: '12', minW: '12', px: '5', gap: '2', fontSize: 'md', lineHeight: 'normal', borderRadius: 'md' },
      xl:    { h: '14', minW: '14', px: '6', gap: '3', fontSize: 'lg', lineHeight: 'normal', borderRadius: 'lg' },
    },
  },
  defaultVariants: {
    color: 'accent',
    variant: 'solid',
    size: 'md',
  },
})
```

Values mapped from the original `button.json` component token spec:

| Size | height | minWidth | px | gap | fontSize | lineHeight | radius | iconSize | spinnerSize |
|------|--------|----------|----|-----|----------|------------|--------|----------|-------------|
| 2xs  | 6      | 6        | 2  | 1   | 2xs      | normal     | xs     | 3        | 3           |
| xs   | 7      | 7        | 2  | 1   | xs       | normal     | sm     | 3_half   | 3_half      |
| sm   | 8      | 8        | 3  | 1   | xs       | normal     | sm     | 4        | 4           |
| md   | 10     | 10       | 4  | 2   | sm       | normal     | md     | 4        | 4           |
| lg   | 12     | 12       | 5  | 2   | md       | normal     | md     | 5        | 5           |
| xl   | 14     | 14       | 6  | 3   | lg       | normal     | lg     | 6        | 6           |

`iconSize` and `spinnerSize` are not used in the recipe — they were aspirational spec values. If needed in the future, they belong in the component implementation, not in a token layer.

Shared base values mapped:

| Property | Token key | Resolved value |
|---|---|---|
| fontFamily | `text` | Inter Tight |
| fontWeight | `medium` | 500 |
| borderWidth | `default` | 1px |
| focusRingWidth | `thick` | 2px |
| focusRingOffset | `thick` | 2px |
| transitionDuration | `fast` | 150ms |
| disabledOpacity | `disabled` | 0.3 |

### 7. Update documentation

**`CLAUDE.md`:**
- Change "Three layers" to "Two layers" throughout
- Remove all references to component tokens, `src/components/`, `dist/panda/components/`, `buildComponentSpecs`, and the `./panda/components/*` export
- Simplify the token pipeline description
- Update the build chain section

**`.claude/skills/ui-component-patterns/SKILL.md`:**
- Verify no stale references to component token imports exist (already describes a two-layer system)

**`.claude/skills/dtcg-token-authoring/SKILL.md`:**
- Remove any component token authoring patterns if present

## What Doesn't Change

- Foundation tokens and their entire build pipeline (CSS, TS, JSON, JSON-mobile, Panda tokens)
- Semantic tokens and their build pipeline (Panda semantic-tokens)
- Figma manifest structure (minus the `Components` collection)
- Watch script (`config/watch.ts`) — watches `src/` recursively, still works
- Lint script (`config/lint.ts`) — lints `src/**/*.json`, still works
- `@reva/ui` component code — consumes the recipe, which exports the same API
- `@reva/panda-preset` public API — same recipe name, same variants, same defaults

## Build Outputs After

```
dist/
  css/
    tokens-foundation.css
    tokens-light.css
    tokens-dark.css
  ts/
    tokens-foundation.ts
    tokens-light.ts
    tokens-dark.ts
  json/
    tokens-foundation.json
    tokens-light.json
    tokens-dark.json
  json-mobile/
    tokens-foundation.json
    tokens-light.json
    tokens-dark.json
  panda/
    tokens.json
    semantic-tokens.json
  figma/
    variables-manifest.json    ← no more Components collection
```

## Verification

After implementation, run:
1. `bun run tokens:build` — builds without errors, no component outputs
2. `bun run build` — full monorepo build succeeds
3. `bun run typecheck` — no type errors from removed import
4. `bun run lint` — passes
5. Manual check: `dist/figma/variables-manifest.json` has no `Components` collection
6. Manual check: `dist/panda/components/` directory does not exist
