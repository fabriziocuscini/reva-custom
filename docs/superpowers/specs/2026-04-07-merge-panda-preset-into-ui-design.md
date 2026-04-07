# Merge `@reva/panda-preset` into `@reva/ui`

## Context

The Reva monorepo currently splits Panda CSS concerns across two packages:

- `**@reva/panda-preset**` — theme infrastructure (token integration, conditions, breakpoints, container sizes, text styles, keyframes, global CSS) and component recipes (button, absoluteCenter, decorativeBox).
- `**@reva/ui**` — React components built on Ark UI + Panda CSS. Recipe-backed components import from `styled-system/recipes` (generated via the preset at codegen time). Layout primitives re-export from `styled-system/jsx`.

This split means recipe definitions and component implementations live in different packages. Changing a component requires touching two packages and navigating an extra build step in the pipeline.

## Decision

Merge `@reva/panda-preset` entirely into `@reva/ui`. The ui package becomes the single source for theme assembly, recipes, and React components.

### Rationale

- **Consumer apps always depend on `@reva/ui`** for both theme and components — there is no "theme-only" consumer scenario that justifies a separate preset package.
- **Co-location** — recipe and component definition live in the same folder, so creating or modifying a component is a single-location task.
- **Fewer hops** — the build pipeline drops from four steps to three, removing the panda-preset build entirely.
- **Less maintenance** — one fewer package to version, build, and reason about.

## Package structure

### Entrypoints

`@reva/ui` exposes two entrypoints:


| Entrypoint        | Export                                           | Purpose               |
| ----------------- | ------------------------------------------------ | --------------------- |
| `@reva/ui`        | React components (`Button`, `Box`, `Flex`, etc.) | App source code       |
| `@reva/ui/preset` | `revaPreset`, `revaGlobalCss`                    | App `panda.config.ts` |


The `/preset` entrypoint exists so that `panda.config.ts` files (Node build-time context) don't pull in React component code.

### File layout

```
packages/ui/src/
├── index.ts                        # main entrypoint — re-exports components
├── preset.ts                       # /preset entrypoint — exports revaPreset, revaGlobalCss
├── theme/
│   ├── index.ts                    # assembles definePreset(...)
│   ├── tokens.ts                   # defineTokens from @reva/tokens/panda/tokens
│   ├── semantic-tokens.ts          # defineSemanticTokens from @reva/tokens/panda/semantic-tokens
│   ├── conditions.ts               # light/dark mode conditions
│   ├── breakpoints.ts
│   ├── container-sizes.ts
│   ├── text-styles.ts
│   ├── keyframes.ts
│   └── global-css.ts
├── components/
│   ├── button/
│   │   ├── index.tsx               # component implementation (styled + Ark UI)
│   │   └── recipe.ts              # button recipe (defineRecipe)
│   ├── absolute-center/
│   │   ├── index.tsx
│   │   └── recipe.ts
│   ├── decorative-box/
│   │   ├── index.tsx
│   │   └── recipe.ts
│   ├── box/index.tsx               # layout facade (no recipe)
│   ├── flex/index.tsx
│   ├── stack/index.tsx
│   └── ...                         # remaining layout primitives
└── utils/
    └── create-style-context.tsx
```

Conventions:

- Recipe-backed components: `componentName/index.tsx` + `componentName/recipe.ts`
- Layout facades: `componentName/index.tsx` only
- A `types.ts` file may be added to a component folder when it grows custom prop types, but is not created preemptively.

### Theme assembly

`src/theme/index.ts` calls `definePreset(...)` with:

- Tokens and semantic tokens imported from `@reva/tokens`
- Conditions, breakpoints, container sizes, text styles, keyframes defined locally in `src/theme/`
- Recipes imported from their respective component directories

`src/preset.ts` re-exports `revaPreset` from `src/theme/index.ts` and `revaGlobalCss` from `src/theme/global-css.ts`.

## Build chain

### Before

```
@reva/tokens → build → dist/panda/*.json
    ↓
@reva/panda-preset → tsdown → dist/ (preset with tokens + recipes)
    ↓
@reva/ui → panda codegen → styled-system/ → tsdown → dist/ (components)
    ↓
apps → panda codegen → styled-system/ → app build
```

### After

```
@reva/tokens → build → dist/panda/*.json
    ↓
@reva/ui → panda codegen → styled-system/ → tsdown → dist/ (preset + components)
    ↓
apps → panda codegen → styled-system/ → app build
```

### Dependency changes

`**@reva/ui` `package.json`:**

- Add `@reva/tokens` (`workspace:*`) as a dependency (was indirect via panda-preset)
- Remove `@reva/panda-preset` from devDependencies
- `@pandacss/dev` and `@pandacss/types` remain as devDependencies
- Add `"./preset"` to the `exports` map pointing to `dist/preset.mjs` / `dist/preset.cjs` + types

`**@reva/ui` `tsdown.config.ts`:**

- Add `src/preset.ts` as a second entrypoint
- Externalise `@pandacss/dev` and `@pandacss/types` (same as panda-preset does today)

`**@reva/ui` `panda.config.ts`:**

- Import `revaPreset` from `./src/theme` (local) instead of from `@reva/panda-preset`

**Apps (docs, advisor-portal, client-portal):**

- `panda.config.ts` — change import from `@reva/panda-preset` to `@reva/ui/preset`
- `package.json` — remove `@reva/panda-preset` dependency

`**turbo.json`:**

- Remove any `@reva/panda-preset`-specific task config. Turbo infers the `@reva/ui` → `@reva/tokens` dependency from `package.json`.

## Removal of `@reva/panda-preset`

- Delete `packages/panda-preset/` entirely (source, config, `package.json`)
- Remove all workspace references
- Run `bun install` to regenerate the lockfile

No deprecation period needed — this is an internal monorepo package, not published to npm. All consumers update in the same commit.

## Documentation updates

- `**CLAUDE.md`** — update repository structure, package details, build chain, and any references to `@reva/panda-preset`
- **Root `README.md`** — update package descriptions and structure
- `**packages/design-tokens/README.md**` — update references to panda-preset as a downstream consumer

## Migration steps

1. Move theme files from `panda-preset/src/` to `ui/src/theme/`
2. Move recipes to co-locate with their components as `recipe.ts`
3. Create `ui/src/preset.ts` entrypoint and `ui/src/theme/index.ts` assembler
4. Update `ui/package.json` — dependencies, exports
5. Update `ui/tsdown.config.ts` — second entrypoint, externals
6. Update `ui/panda.config.ts` — local preset import
7. Update app `panda.config.ts` files — import from `@reva/ui/preset`
8. Update app `package.json` files — remove `@reva/panda-preset`
9. Delete `packages/panda-preset/`
10. Update documentation — `CLAUDE.md`, root `README.md`, `packages/design-tokens/README.md`
11. Run `bun install`
12. Verify — `bun run build`, `bun run lint`, `bun run typecheck` all pass

