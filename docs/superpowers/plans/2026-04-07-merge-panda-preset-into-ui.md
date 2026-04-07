# Merge `@reva/panda-preset` into `@reva/ui` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the `@reva/panda-preset` package by moving all its contents into `@reva/ui`, co-locating recipes with components and exposing a `/preset` entrypoint for app config files.

**Architecture:** `@reva/ui` gains a `src/theme/` directory with all preset infrastructure (tokens, conditions, breakpoints, text styles, keyframes, global CSS). Recipes move from the preset's `src/recipes/` to sit alongside their component in `src/components/<name>/recipe.ts`. A new `src/preset.ts` entrypoint exports `revaPreset` and `revaGlobalCss` for consumer apps. The `@reva/panda-preset` package is deleted.

**Tech Stack:** Panda CSS, tsdown, Turborepo, Bun

**Spec:** `docs/superpowers/specs/2026-04-07-merge-panda-preset-into-ui-design.md`

---

### Task 1: Create theme directory and move theme files

**Files:**

- Create: `packages/ui/src/theme/tokens.ts`
- Create: `packages/ui/src/theme/semantic-tokens.ts`
- Create: `packages/ui/src/theme/conditions.ts`
- Create: `packages/ui/src/theme/breakpoints.ts`
- Create: `packages/ui/src/theme/container-sizes.ts`
- Create: `packages/ui/src/theme/text-styles.ts`
- Create: `packages/ui/src/theme/keyframes.ts`
- Create: `packages/ui/src/theme/global-css.ts`
- **Step 1: Create `packages/ui/src/theme/tokens.ts`**

```ts
import { defineTokens } from '@pandacss/dev'
import pandaTokens from '@reva/tokens/panda/tokens'

export const tokens = defineTokens(pandaTokens)
```

- **Step 2: Create `packages/ui/src/theme/semantic-tokens.ts`**

```ts
import { defineSemanticTokens } from '@pandacss/dev'
import pandaSemanticTokens from '@reva/tokens/panda/semantic-tokens'

export const semanticTokens = defineSemanticTokens(pandaSemanticTokens)
```

- **Step 3: Create `packages/ui/src/theme/conditions.ts`**

```ts
export const conditions = {
  light: ':root:not(.dark) &, [data-color-mode=light] &',
  dark: ':root.dark &, [data-color-mode=dark] &',
}
```

- **Step 4: Create `packages/ui/src/theme/breakpoints.ts`**

```ts
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1536px',
  '2xl': '1920px',
}
```

- **Step 5: Create `packages/ui/src/theme/container-sizes.ts`**

```ts
export const containerSizes = {
  xs: '320px',
  sm: '384px',
  md: '448px',
  lg: '512px',
  xl: '576px',
  '2xl': '672px',
  '3xl': '768px',
  '4xl': '896px',
  '5xl': '1024px',
  '6xl': '1152px',
  '7xl': '1280px',
  '8xl': '1440px',
}
```

- **Step 6: Create `packages/ui/src/theme/text-styles.ts`**

Copy the full contents of `packages/panda-preset/src/text-styles.ts` (271 lines) verbatim.

- **Step 7: Create `packages/ui/src/theme/keyframes.ts`**

```ts
import { defineKeyframes } from '@pandacss/dev'

export const keyframes = defineKeyframes({
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideDown: {
    from: { height: 0, opacity: 0 },
    to: { height: 'var(--height)', opacity: 1 },
  },
  slideUp: {
    from: { height: 'var(--height)', opacity: 1 },
    to: { height: 0, opacity: 0 },
  },
})
```

- **Step 8: Create `packages/ui/src/theme/global-css.ts`**

```ts
import { defineGlobalStyles } from '@pandacss/dev'

export const globalCss = defineGlobalStyles({
  'html, body': {
    color: 'fg.default',
    backgroundColor: 'bg.surface',
    fontFamily: 'text',
    fontSize: 'md',
    lineHeight: 'normal',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
})
```

- **Step 9: Commit**

```bash
git add packages/ui/src/theme/
git commit -m "refactor(ui): add theme directory with files from panda-preset"
```

---

### Task 2: Move recipes to co-locate with components

**Files:**

- Create: `packages/ui/src/components/button/recipe.ts`
- Create: `packages/ui/src/components/absolute-center/recipe.ts`
- Create: `packages/ui/src/components/decorative-box/recipe.ts`
- **Step 1: Create `packages/ui/src/components/button/recipe.ts`**

Copy the full contents of `packages/panda-preset/src/recipes/button.ts` (80 lines) verbatim. The file starts with `import { defineRecipe } from '@pandacss/dev'` — no import path changes needed.

- **Step 2: Create `packages/ui/src/components/absolute-center/recipe.ts`**

Copy the full contents of `packages/panda-preset/src/recipes/absolute-center.ts` (33 lines) verbatim.

- **Step 3: Create `packages/ui/src/components/decorative-box/recipe.ts`**

Copy the full contents of `packages/panda-preset/src/recipes/decorative-box.ts` (18 lines) verbatim.

- **Step 4: Commit**

```bash
git add packages/ui/src/components/*/recipe.ts
git commit -m "refactor(ui): co-locate recipes with component definitions"
```

---

### Task 3: Create preset entrypoint and theme assembler

**Files:**

- Create: `packages/ui/src/theme/index.ts`
- Create: `packages/ui/src/preset.ts`
- **Step 1: Create `packages/ui/src/theme/index.ts`**

This assembles the full Panda preset, importing theme infrastructure from sibling files and recipes from component directories:

```ts
import { definePreset } from '@pandacss/dev'

import { breakpoints } from './breakpoints'
import { conditions } from './conditions'
import { containerSizes } from './container-sizes'
import { keyframes } from './keyframes'
import { semanticTokens } from './semantic-tokens'
import { textStyles } from './text-styles'
import { tokens } from './tokens'
import { absoluteCenter } from '../components/absolute-center/recipe'
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
      button,
      decorativeBox,
    },
    keyframes,
    textStyles,
  },
})
```

- **Step 2: Create `packages/ui/src/preset.ts`**

This is the public entrypoint for `@reva/ui/preset`:

```ts
export { revaPreset } from './theme'
export { globalCss as revaGlobalCss } from './theme/global-css'
```

- **Step 3: Commit**

```bash
git add packages/ui/src/theme/index.ts packages/ui/src/preset.ts
git commit -m "refactor(ui): create preset entrypoint and theme assembler"
```

---

### Task 4: Update `@reva/ui` package configuration

**Files:**

- Modify: `packages/ui/package.json`
- Modify: `packages/ui/tsdown.config.ts`
- Modify: `packages/ui/panda.config.ts`
- **Step 1: Update `packages/ui/package.json`**

Changes:

- Add `@reva/tokens` as a dependency
- Remove `@reva/panda-preset` from devDependencies
- Add `"./preset"` export entry

```json
{
  "name": "@reva/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.mjs",
  "types": "dist/index.d.mts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./preset": {
      "import": {
        "types": "./dist/preset.d.mts",
        "default": "./dist/preset.mjs"
      },
      "require": {
        "types": "./dist/preset.d.cts",
        "default": "./dist/preset.cjs"
      }
    }
  },
  "scripts": {
    "build": "panda codegen --clean && tsdown",
    "codegen": "panda codegen --clean"
  },
  "dependencies": {
    "@ark-ui/react": "^5",
    "@reva/tokens": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18 || ^19",
    "react-dom": "^18 || ^19"
  },
  "devDependencies": {
    "@pandacss/dev": "^1",
    "@pandacss/types": "^1",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tsdown": "^0.20.3",
    "typescript": "^5"
  }
}
```

- **Step 2: Update `packages/ui/tsdown.config.ts`**

Add `src/preset.ts` as a second entrypoint and externalise Panda packages:

```ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/preset.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  inlineOnly: false,
  external: [
    '@ark-ui/react',
    '@pandacss/dev',
    '@pandacss/types',
    'react',
    'react-dom',
    'react/jsx-runtime',
  ],
})
```

- **Step 3: Update `packages/ui/panda.config.ts`**

Change the preset import from `@reva/panda-preset` to the local theme:

```ts
import { defineConfig } from '@pandacss/dev'
import { revaPreset } from './src/theme'

export default defineConfig({
  presets: [revaPreset],
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  outExtension: 'js',
  jsxFramework: 'react',
})
```

- **Step 4: Commit**

```bash
git add packages/ui/package.json packages/ui/tsdown.config.ts packages/ui/panda.config.ts
git commit -m "refactor(ui): update package config for merged preset"
```

---

### Task 5: Update consumer app configurations

**Files:**

- Modify: `apps/docs/panda.config.ts`
- Modify: `apps/docs/package.json`
- Modify: `apps/advisor-portal/panda.config.ts`
- Modify: `apps/advisor-portal/package.json`
- Modify: `apps/client-portal/panda.config.ts`
- Modify: `apps/client-portal/package.json`
- **Step 1: Update `apps/docs/panda.config.ts`**

```ts
import { defineConfig } from '@pandacss/dev'
import { revaPreset } from '@reva/ui/preset'

export default defineConfig({
  presets: [revaPreset],
  preflight: false,
  include: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './examples/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  outExtension: 'js',
  jsxFramework: 'react',
  staticCss: {
    recipes: '*',
  },
  layers: {
    base: 'panda_base',
    tokens: 'panda_tokens',
    recipes: 'panda_recipes',
    utilities: 'panda_utilities',
  },
})
```

- **Step 2: Update `apps/docs/package.json` — remove `@reva/panda-preset`**

Remove `"@reva/panda-preset": "workspace:*"` from `devDependencies`. All other entries stay the same.

- **Step 3: Update `apps/advisor-portal/panda.config.ts`**

```ts
import { defineConfig } from '@pandacss/dev'
import { revaPreset, revaGlobalCss } from '@reva/ui/preset'

export default defineConfig({
  presets: [revaPreset],
  globalCss: revaGlobalCss,
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  outExtension: 'js',
  jsxFramework: 'react',
  staticCss: {
    recipes: '*',
  },
})
```

- **Step 4: Update `apps/advisor-portal/package.json` — remove `@reva/panda-preset`**

Remove `"@reva/panda-preset": "workspace:*"` from `devDependencies`. All other entries stay the same.

- **Step 5: Update `apps/client-portal/panda.config.ts`**

```ts
import { defineConfig } from '@pandacss/dev'
import { revaPreset, revaGlobalCss } from '@reva/ui/preset'

export default defineConfig({
  presets: [revaPreset],
  globalCss: revaGlobalCss,
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  outExtension: 'js',
  jsxFramework: 'react',
  staticCss: {
    recipes: '*',
  },
})
```

- **Step 6: Update `apps/client-portal/package.json` — remove `@reva/panda-preset`**

Remove `"@reva/panda-preset": "workspace:*"` from `devDependencies`. All other entries stay the same.

- **Step 7: Commit**

```bash
git add apps/docs/panda.config.ts apps/docs/package.json \
        apps/advisor-portal/panda.config.ts apps/advisor-portal/package.json \
        apps/client-portal/panda.config.ts apps/client-portal/package.json
git commit -m "refactor(apps): import preset from @reva/ui/preset"
```

---

### Task 6: Delete `@reva/panda-preset` package

**Files:**

- Delete: `packages/panda-preset/` (entire directory)
- **Step 1: Delete the package directory**

```bash
rm -rf packages/panda-preset
```

- **Step 2: Run `bun install` to regenerate the lockfile**

```bash
bun install
```

Expected: lockfile updates cleanly, no resolution errors for `@reva/panda-preset`.

- **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: remove @reva/panda-preset package"
```

---

### Task 7: Verify the build

- **Step 1: Build all packages**

```bash
bun run build
```

Expected: all packages build successfully. The build order should be:

1. `@reva/tokens` → `dist/`
2. `@reva/ui` → `styled-system/` (codegen) → `dist/` (tsdown)
3. Apps → `styled-system/` (codegen) → app builds

- **Step 2: Run lint**

```bash
bun run lint
```

Expected: no lint errors related to the migration. Pre-existing lint issues (if any) are unrelated.

- **Step 3: Run typecheck**

```bash
bun run typecheck
```

Expected: no type errors. The `styled-system/recipes` imports in component files should resolve correctly after codegen since the recipes are now part of the preset that feeds codegen.

- **Step 4: Commit any fixups if needed**

If build/lint/typecheck surfaced issues, fix them and commit:

```bash
git add -A
git commit -m "fix(ui): address build issues from preset merge"
```

---

### Task 8: Update documentation

**Files:**

- Modify: `CLAUDE.md`
- Modify: `README.md`
- Modify: `packages/design-tokens/README.md`
- **Step 1: Update `CLAUDE.md`**

Apply the following changes throughout the file:

1. **Repository Structure** — remove the `panda-preset` entry; update `ui` description to mention it includes the Panda preset:

```
├── packages/
│ ├── design-tokens/ # @reva/tokens — Platform-agnostic, multi-themeable design tokens
│ │ └── src/
│ │ ├── foundation/ # Foundation tokens (16 files: colours, spacing, sizes, radii, etc.)
│ │ └── colorMode/ # Semantic colour tokens (light.json, dark.json)
│ ├── ui/ # @reva/ui — React component library + Panda CSS preset (Ark UI + Panda CSS)
│ └── config/ # @reva/config — Shared ESLint, Prettier, TS configs
```

1. **Package Details** — remove the `@reva/panda-preset` bullet entirely. Update the `@reva/ui` bullet to explain it now includes the preset:

> **@reva/ui** (`packages/ui`): Anatomy-first, fully typed, accessible-by-default React components built on Ark UI and Panda CSS, plus the Reva Panda CSS preset. Exports two entrypoints: `@reva/ui` for React components and `@reva/ui/preset` for the Panda CSS preset (`revaPreset`, `revaGlobalCss`). The preset assembles design tokens from `@reva/tokens`, defines light/dark mode conditions, breakpoints, container sizes, text styles, and keyframes. Recipes are co-located with their component definitions. Uses Panda `styled()` for single-element components (`styled(ark.<element>, recipe)`) and `createStyleContext` for compound slot recipes.

1. **Build Chain** — update to three-step pipeline:

```
@reva/config → no build (exports raw config files)
@reva/tokens → lint → Style Dictionary + custom transforms → dist/ (CSS, TS, JSON, Panda tokens, Panda semantic-tokens, Figma manifest)
@reva/ui → panda codegen → styled-system/ → tsdown → dist/
@reva/docs → panda codegen + panda cssgen → styled-system/ → next build
portal apps → panda codegen → styled-system/ → tsc -b → vite build
```

1. **Key Architectural Decisions** — update the bullet about `@pandacss/preset-panda`:

> **No `@pandacss/preset-panda`** — we own all token definitions. Consuming apps use `presets: [revaPreset]` (imported from `@reva/ui/preset`) only.

1. **Token Rules** — update the token pipeline bullet:

> **Token pipeline**: `@reva/tokens` builds Panda-compatible JSON (`dist/panda/tokens.json`, `dist/panda/semantic-tokens.json`) that `@reva/ui` imports directly into its preset — no hardcoded values in the preset, plus a Figma variables manifest (`dist/figma/variables-manifest.json`) for one-way sync to Figma.

1. Remove any remaining references to `@reva/panda-preset` or `packages/panda-preset`.

- **Step 2: Update root `README.md`**

1. Remove the `packages/panda-preset` bullet from the Overview section.
2. Update the `packages/ui` bullet:

> `**packages/ui**` (`@reva/ui`): React component library built on Ark UI (headless) and Panda CSS (styling). Also includes the Reva Panda CSS preset (tokens, conditions, text styles, recipes). Anatomy-first, fully typed, accessible by default.

1. Update the Project Structure tree — remove `panda-preset`:

```
├── packages/
│   ├── design-tokens/         # Design token system
│   │   └── src/
│   │       ├── foundation/    # Foundation tokens (colours, spacing, radii, etc.)
│   │       └── colorMode/     # Semantic colour tokens (light.json, dark.json)
│   ├── ui/                    # React component library + Panda CSS preset
│   └── config/                # Shared lint, format, TS configs
```

1. Update the Current Status paragraph to remove the reference to "Panda CSS preset" as a separate thing.

- **Step 3: Update `packages/design-tokens/README.md`**

1. In the "How Panda CSS Consumes Tokens" section, update the reference from `@reva/panda-preset` to `@reva/ui`:

> `@reva/ui` imports `@reva/tokens/panda/tokens` and `@reva/tokens/panda/semantic-tokens` and passes them to `defineTokens` / `defineSemanticTokens` in its preset assembler.

1. In the Output Formats table, update the Panda CSS row description:

> `{ value }` format consumed by `@reva/ui`'s preset assembler

1. Remove any other references to `@reva/panda-preset`.

- **Step 4: Commit**

```bash
git add CLAUDE.md README.md packages/design-tokens/README.md
git commit -m "docs: update documentation for panda-preset merge into ui"
```

---

### Task 9: Final verification

- **Step 1: Full clean build from scratch**

```bash
rm -rf packages/ui/dist packages/ui/styled-system
rm -rf apps/docs/styled-system apps/advisor-portal/styled-system apps/client-portal/styled-system
bun run build
```

Expected: everything builds cleanly from scratch.

- **Step 2: Verify preset entrypoint resolves**

```bash
bun -e "const p = require.resolve('@reva/ui/preset', { paths: [process.cwd()] }); console.log('Preset entrypoint:', p)"
```

Expected: resolves to `packages/ui/dist/preset.mjs` or `packages/ui/dist/preset.cjs`.

- **Step 3: Verify no stale references remain**

```bash
rg "@reva/panda-preset" --type ts --type json --type md
```

Expected: zero matches.

- **Step 4: Run full lint and typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: all pass.

- **Step 5: Commit any final fixups**

```bash
git add -A
git commit -m "fix: final cleanup after panda-preset merge"
```

