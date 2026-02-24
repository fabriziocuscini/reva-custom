# Reva Design System — Bootstrap Plan

## Context

The Reva monorepo exists as a blank canvas: just `.gitignore`, `CLAUDE.md`, `README.md`, `bootstrap-prompt.md`, and two Claude Code skills. No packages, apps, configs, or dependencies exist yet. This plan scaffolds the entire design system from scratch in 8 sequential phases, each requiring explicit approval before proceeding to the next.

---

## Discrepancies & Gotchas (flagged upfront)

1. **`packages/ui` vs `packages/components`**: `CLAUDE.md` says `packages/components`, the bootstrap prompt says `packages/ui/`. The bootstrap prompt's directory structure (Section 2) shows `packages/ui/`. The skill file says `packages/components/`. **I will use `packages/ui/`** per the bootstrap prompt and ask you to confirm.

2. **`@pandacss/preset-base` confusion**: The prompt (line 139) says "disables `@pandacss/preset-base`". This is imprecise. `@pandacss/preset-base` contains utility mappings (`bg` → `background`, `p` → `padding`) and is auto-included. What we exclude is `@pandacss/preset-panda` (Panda's opinionated tokens). Setting `presets: [revaPreset]` achieves exactly this — we keep utility mappings, own all tokens. No `eject: true` needed.

3. **JSON cannot have comments**: The prompt says "mark values with `// PLACEHOLDER` comments" but JSON forbids comments. Will use `"$description": "PLACEHOLDER"` per the tokens-studio-authoring skill.

4. **Token file names**: The prompt shows `colors.json` (Section 3.1 directory structure) but the naming convention says singular. Will use `color.json`, `radius.json`, `shadow.json` etc. and ask you to confirm.

5. **Fumadocs `.source/` and `.fumadocs/` directories**: Need to be added to `.gitignore`.

---

## Phase 1: Repository Scaffolding

### Goal
Initialise the Turborepo monorepo with Bun, shared configs, and infrastructure tooling.

### Steps

1. **Create root `package.json`** with:
   - `"workspaces": ["apps/*", "packages/*"]`
   - Scripts: `build`, `dev`, `lint`, `test`, `typecheck`, `tokens:build`, `codegen`, `format`, `format:check`, `changeset`, `version-packages`, `release`
   - `"packageManager": "bun@1.3.8"`

2. **Install root devDependencies**: `turbo`, `typescript`, `@changesets/cli`, `tsdown`

3. **Create directory structure**:
   ```
   apps/
   packages/config/
   packages/design-tokens/
   packages/panda-preset/
   packages/ui/
   ```

4. **Create `turbo.json`** with tasks: `build`, `dev`, `lint`, `test`, `typecheck`, `tokens:build`, `codegen` (exact config from bootstrap prompt Section 4)

5. **Create `tsconfig.base.json`** at root:
   - `strict: true`, `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`
   - `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`
   - `jsx: react-jsx`, `resolveJsonModule`, `isolatedModules`, `skipLibCheck`

6. **Scaffold `@reva/config`** (`packages/config/`):
   - `eslint.config.mjs` — ESLint 9 flat config with: `typescript-eslint` (strict), `@pandacss/eslint-plugin`, `eslint-plugin-react` + `react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-simple-import-sort`
   - `prettier.config.mjs` — exact config from prompt (semi:false, singleQuote:true, etc.)
   - `tsconfig.base.json` + `tsconfig.react.json` extending root
   - `package.json` with all linting/formatting devDependencies

7. **Create root config wrappers**: `.prettierrc.mjs` and `eslint.config.mjs` re-exporting from `@reva/config`

8. **Initialise Changesets**: `bunx changeset init` → creates `.changeset/config.json`

9. **Run `bun install`** to resolve all workspace dependencies

### Verification
```bash
bun install
bunx turbo run build --dry    # verify turbo sees workspaces
bunx prettier --check .        # verify prettier config
ls .changeset/config.json     # verify changesets init
```

### Key files
- `/package.json` (root workspace)
- `/turbo.json`
- `/tsconfig.base.json`
- `/packages/config/package.json`
- `/packages/config/eslint.config.mjs`
- `/packages/config/prettier.config.mjs`
- `/.prettierrc.mjs`
- `/eslint.config.mjs`
- `/.changeset/config.json` (auto-generated)

---

## Phase 2: Design Tokens (`@reva/tokens`)

### Goal
Create the token package with Tokens Studio JSON sources, Style Dictionary v4 build pipeline, and verified output in all 4 formats.

### Steps

1. **Create `packages/design-tokens/package.json`**:
   - Name: `@reva/tokens`, private, type: module
   - Dependencies: `style-dictionary@^4`, `@tokens-studio/sd-transforms@^1`
   - Build script: `bun run config/style-dictionary.config.ts`
   - Exports: `./css/*`, `./ts/*`, `./json-dtcg/*`, `./json-mobile/*`

2. **Create foundation token files** (Tokens Studio DTCG format, all with `$description: "PLACEHOLDER"`):
   - `src/foundation/color.json` — neutral grey scale (50-950), one brand colour scale (50-900), white, black
   - `src/foundation/spacing.json` — 0 through 16 scale
   - `src/foundation/typography.json` — font families (Inter, JetBrains Mono), sizes (xs-2xl), weights, line heights
   - `src/foundation/radius.json` — none, sm, md, lg, xl, full
   - `src/foundation/shadow.json` — sm, md shadows

3. **Create semantic token files**:
   - `src/semantic/color.json` — light mode mappings: fg (default, subtle, disabled, onBrand), bg (surface, subtle, muted), border (default, subtle), brand (solid, subtle, fg)
   - `src/semantic/color-dark.json` — dark mode overrides for same tokens

4. **Create Tokens Studio metadata**:
   - `src/$metadata.json` — token set ordering
   - `src/$themes.json` — Light theme (semantic/color enabled, color-dark disabled) and Dark theme (inverse)

5. **Create Style Dictionary config** (`config/style-dictionary.config.ts`):
   - Uses `@tokens-studio/sd-transforms` `register()` + `expandTypesMap`
   - Builds light and dark themes separately
   - Outputs: `dist/css/tokens.css`, `dist/css/tokens-dark.css`, `dist/ts/tokens.ts`, `dist/ts/tokens-dark.ts`, `dist/json-dtcg/tokens.json`, `dist/json-mobile/tokens.json`

6. **Create `tsconfig.json`** extending root

### Verification
```bash
cd packages/design-tokens && bun run build
# Inspect dist/css/tokens.css — should contain CSS custom properties
# Inspect dist/ts/tokens.ts — should contain ES module exports
# Inspect dist/json-dtcg/tokens.json — should contain nested JSON
```

### Key files
- `packages/design-tokens/package.json`
- `packages/design-tokens/config/style-dictionary.config.ts`
- `packages/design-tokens/src/foundation/color.json`
- `packages/design-tokens/src/semantic/color.json`
- `packages/design-tokens/src/$metadata.json`
- `packages/design-tokens/src/$themes.json`

---

## Phase 3: Panda CSS Preset (`@reva/panda-preset`)

### Goal
Bridge tokens into Panda CSS, define light/dark conditions, theme contract, and Button recipe.

### Steps

1. **Create `packages/panda-preset/package.json`**:
   - Dependencies: `@reva/tokens` (workspace)
   - DevDependencies: `@pandacss/dev`, `@pandacss/types`, `@ark-ui/react` (for anatomy imports), `tsdown`
   - Build: `tsdown` → dual CJS/ESM + `.d.ts`

2. **Create `tsdown.config.ts`** — entry: `src/index.ts`, format: esm + cjs, dts: true

3. **Create source files**:
   - `src/tokens.ts` — `defineTokens({...})` with foundation values (color, spacing, radius, font, fontSize, fontWeight, lineHeight). Values duplicated from `@reva/tokens` for now; auto-generation from token output is a future improvement.
   - `src/semantic-tokens.ts` — `defineSemanticTokens({...})` with `_light`/`_dark` conditions for fg, bg, border, brand
   - `src/conditions.ts` — `{ light: '[data-color-mode=light] &', dark: '[data-color-mode=dark] &' }`
   - `src/recipes/button.ts` — Check Ark UI MCP for Button anatomy. If single-element: `cva` with variants (solid/outline/ghost) and sizes (sm/md/lg). If multi-part: `defineSlotRecipe`.
   - `src/recipes/index.ts` — barrel export
   - `src/text-styles.ts` — basic text style presets (xs through 2xl)
   - `src/keyframes.ts` — slideDown, slideUp, fadeIn, fadeOut
   - `src/global-css.ts` — html/body defaults using semantic tokens
   - `src/themes/contract.ts` — `defineThemeContract` enforcing brand colour structure
   - `src/themes/index.ts` — barrel export

4. **Create `src/index.ts`** — main preset export via `definePreset({...})` wiring all of the above

5. **Create `tsconfig.json`** extending root

### Verification
```bash
cd packages/panda-preset && bun run build
ls dist/index.js dist/index.cjs dist/index.d.ts
```

### Key files
- `packages/panda-preset/src/index.ts` (central preset definition)
- `packages/panda-preset/src/tokens.ts`
- `packages/panda-preset/src/semantic-tokens.ts`
- `packages/panda-preset/src/recipes/button.ts`
- `packages/panda-preset/src/themes/contract.ts`

---

## Phase 4: Component Library (`@reva/ui`)

### Goal
Set up the component library with Panda codegen, `createStyleContext`, and the Button component.

### Steps

1. **Create `packages/ui/package.json`**:
   - Dependencies: `@ark-ui/react`, `@reva/panda-preset` (workspace)
   - DevDependencies: `@pandacss/dev`, `tsdown`, `typescript`, `react`, `react-dom`, `@types/react`, `@types/react-dom`
   - PeerDependencies: `react >= 18`, `react-dom >= 18`
   - Scripts: `prepare: panda codegen --clean`, `build: panda codegen --clean && tsdown`

2. **Create `panda.config.ts`** — `presets: [revaPreset]`, include `./src/**`, outdir `styled-system`, jsxFramework: react

3. **Create `tsdown.config.ts`** — external: react, react-dom, @ark-ui/react

4. **Create `tsconfig.json`** with `paths: { "styled-system/*": ["./styled-system/*"] }`

5. **Create `src/utils/create-style-context.tsx`** — style distribution utility (verify against Park UI reference via MCP at implementation time)

6. **Create `src/components/button/index.tsx`**:
   - Import `button` from `styled-system/recipes`
   - Import `RecipeVariantProps` from `styled-system/types`
   - If single-element: use `ark.button` factory + `button.splitVariantProps` + `forwardRef`
   - Export `Button`, `ButtonProps`, `ButtonVariants`

7. **Create `src/index.ts`** — barrel export

### Verification
```bash
cd packages/ui && bun run build
ls styled-system/recipes/     # Panda codegen output
ls dist/index.js dist/index.d.ts  # tsdown output
```

### Key files
- `packages/ui/panda.config.ts`
- `packages/ui/src/utils/create-style-context.tsx`
- `packages/ui/src/components/button/index.tsx`
- `packages/ui/src/index.ts`

---

## Phase 5: Documentation Site (`@reva/docs`)

### Goal
Scaffold Fumadocs + Next.js docs site with Button component page and token reference.

### Steps

1. **Create `apps/docs/package.json`**:
   - Dependencies: `next`, `react`, `react-dom`, `fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`, `@reva/panda-preset` (workspace), `@reva/ui` (workspace)
   - DevDependencies: `@pandacss/dev`, `typescript`, `postcss`
   - Scripts: `prepare: panda codegen --clean`, `build: panda codegen --clean && next build`, `dev: next dev`

2. **Create config files**:
   - `source.config.ts` — Fumadocs MDX content source config
   - `next.config.mjs` — with Fumadocs MDX plugin
   - `panda.config.ts` — extending `@reva/panda-preset`
   - `postcss.config.cjs` — `@pandacss/dev/postcss`
   - `tsconfig.json` — paths for `@/*`, `styled-system/*`, `fumadocs-mdx:collections/*`
   - `lib/source.ts` — Fumadocs loader

3. **Create app directory**:
   - `app/layout.tsx` — root layout with `data-color-mode="light"`
   - `app/global.css` — `@layer reset, base, tokens, recipes, utilities;`
   - `app/page.tsx` — home page linking to docs
   - `app/docs/layout.tsx` — Fumadocs DocsLayout with page tree
   - `app/docs/[[...slug]]/page.tsx` — dynamic docs page

4. **Create content**:
   - `content/docs/index.mdx` — landing page
   - `content/docs/components/button.mdx` — Button docs (variants, sizes, accessibility)
   - `content/docs/tokens/index.mdx` — token architecture overview
   - `content/docs/meta.json` — navigation structure

5. **Update `.gitignore`** — add `.source/`, `.fumadocs/`

### Verification
```bash
cd apps/docs && bun run build
# Should build without errors, generating .next/ output
```

### Key files
- `apps/docs/source.config.ts`
- `apps/docs/next.config.mjs`
- `apps/docs/panda.config.ts`
- `apps/docs/app/layout.tsx`
- `apps/docs/content/docs/components/button.mdx`

---

## Phase 6: Portal Apps

### Goal
Scaffold advisor-portal and client-portal as Vite + React + TS + Panda CSS apps.

### Steps (repeat for both `apps/advisor-portal` and `apps/client-portal`)

1. **Create `package.json`**:
   - Dependencies: `react`, `react-dom`, `@reva/ui` (workspace), `@reva/panda-preset` (workspace)
   - DevDependencies: `@pandacss/dev`, `@vitejs/plugin-react`, `vite`, `postcss`, `typescript`, types
   - Scripts: `prepare: panda codegen --clean`, `build: panda codegen --clean && tsc && vite build`, `dev: vite`

2. **Create config files**:
   - `panda.config.ts` — `presets: [revaPreset]`, include `./src/**`
   - `vite.config.ts` — React plugin
   - `postcss.config.cjs` — `@pandacss/dev/postcss`
   - `tsconfig.json` — paths for `styled-system/*`

3. **Create app files**:
   - `index.html` — with `data-color-mode="light"` on `<html>`
   - `src/main.tsx` — React root mount
   - `src/index.css` — `@layer reset, base, tokens, recipes, utilities;`
   - `src/app.tsx` — renders Button from `@reva/ui` with Panda CSS utilities

### Verification
```bash
cd apps/advisor-portal && bun run build
cd apps/client-portal && bun run build
# Both should build without errors
```

---

## Phase 7: CI/CD

### Goal
GitHub Actions, Playwright config, Vercel setup.

### Steps

1. **Create `.github/workflows/ci.yml`**:
   - Triggers: PR to main, push to main
   - Steps: checkout, setup-bun, `bun install --frozen-lockfile`, lint, typecheck, build, install Playwright browsers, test
   - Concurrency: cancel-in-progress

2. **Create `.github/workflows/release.yml`**:
   - Triggers: push to main
   - Uses `changesets/action@v1` for version PRs and publishing
   - Permissions: contents write, pull-requests write

3. **Create `playwright.config.ts`** at root:
   - `testMatch: '**/*.test.{ts,tsx}'`
   - Chromium only for now

4. **Install Playwright**: `bun add -d @playwright/test` at root

5. **Create `apps/docs/vercel.json`** for Vercel deployment config (or note this is done via Vercel dashboard)

### Key files
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `playwright.config.ts`

---

## Phase 8: Author CLAUDE.md

### Goal
Replace the current CLAUDE.md with a concise, prescriptive reference distilled from the bootstrap prompt and any gotchas discovered during phases 1-7.

### Sections
1. Project overview (3-4 lines)
2. Repository structure (tree with package purposes)
3. Common commands
4. Token rules (semantic colour only, non-colour direct OK, singular naming, three layers)
5. Component checklist (condensed 6-step workflow)
6. MCP server reference hierarchy
7. Coding standards (TypeScript strict, anatomy-first, createStyleContext, naming conventions)
8. Key architectural decisions (runtime theming, no preset-panda, preset-base auto-included, white-labelling)
9. Gotchas discovered during bootstrap

Target: ~150-200 lines, prescriptive, scannable.

---

## Dependency Graph

```
@reva/config            (no internal deps)
@reva/tokens            (no internal deps)
@reva/panda-preset      → @reva/tokens
@reva/ui                → @reva/panda-preset, @ark-ui/react
@reva/docs              → @reva/panda-preset, @reva/ui
@reva/advisor-portal    → @reva/panda-preset, @reva/ui
@reva/client-portal     → @reva/panda-preset, @reva/ui
```

## Build Chain

```
@reva/config        → no build (exports raw config files)
@reva/tokens        → Style Dictionary → dist/
@reva/panda-preset  → tsdown → dist/
@reva/ui            → panda codegen → styled-system/ → tsdown → dist/
@reva/docs          → panda codegen → styled-system/ → next build
apps/*              → panda codegen → styled-system/ → vite build
```
