# CLAUDE.md

## Project Overview

Reva is a design system, component library, and application platform for AI-enabled wealth management infrastructure. This is a monorepo managed with Turborepo and Bun. The system supports white-labelling: each advisory firm gets a branded environment where their end users never see Reva branding. Theme switching happens at runtime via Panda CSS themes.

## Tech Stack

- **Monorepo**: Turborepo
- **Package manager**: Bun (`bun install`, `bun run build`, `bun run dev`)
- **Language**: TypeScript (strict mode, no `any`)
- **Components**: Ark UI (headless) + Panda CSS (styling)
- **Design tokens**: Tokens Studio (DTCG format) → Style Dictionary v4 + `@tokens-studio/sd-transforms` → CSS / TS / W3C JSON / React Native
- **Package builds**: tsdown (dual CJS/ESM + `.d.ts`)
- **Web framework**: Next.js (docs, future website), Vite (portal apps)
- **Mobile**: React Native + Expo (future)
- **Documentation**: Fumadocs (Next.js)
- **Testing**: Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel
- **Versioning**: Changesets (`@changesets/cli`)

## Repository Structure

```
reva/
├── apps/
│   ├── docs/                  # @reva/docs — Fumadocs + Next.js documentation site
│   ├── reva-website/           # @reva/website-static — Current static site (Vite + PostCSS + PostHTML)
│   ├── advisor-portal/        # @reva/advisor-portal — Advisor-facing web portal (Vite + React, placeholder)
│   └── client-portal/         # @reva/client-portal — End-client web portal, white-labelled (Vite + React, placeholder)
├── packages/
│   ├── design-tokens/         # @reva/tokens — Platform-agnostic, multi-themeable design tokens
│   ├── panda-preset/          # @reva/panda-preset — Panda CSS preset, themes, recipes
│   ├── ui/                    # @reva/ui — React component library (Ark UI + Panda CSS)
│   └── config/                # @reva/config — Shared ESLint, Prettier, TS configs
├── turbo.json
├── tsconfig.base.json
├── .prettierrc.mjs            # Re-exports from packages/config/prettier.config.mjs
└── eslint.config.mjs          # Re-exports from packages/config/eslint.config.mjs
```

### Future additions (do not scaffold yet)

- `apps/website/` — Next.js marketing site eventually replacing `reva-website`, consuming `@reva/tokens` and `@reva/ui`
- `apps/client-app/` — React Native + Expo mobile app consuming `@reva/tokens`
- `apps/sandbox/` — Internal component testing and experimentation

## Package Details

- **@reva/tokens** (`packages/design-tokens`): Authored in Tokens Studio DTCG format (`$value`, `$type`, `$description`). Transformed via Style Dictionary v4 with `@tokens-studio/sd-transforms` into CSS custom properties, TypeScript constants, W3C DTCG JSON, and React Native JSON. Code is source of truth; Figma syncs bidirectionally via Tokens Studio plugin.
- **@reva/website-static** (`apps/reva-website`): Current static marketing site (Vite + PostCSS + PostHTML). Will be updated to consume CSS custom properties from `@reva/tokens` once the token package is published. A more complex Next.js `website` app will eventually replace it.
- **@reva/panda-preset** (`packages/panda-preset`): Bridges design tokens into Panda CSS. Defines base Reva theme, client themes (white-labelling), light/dark mode conditions (`data-color-mode` attribute), and component recipes (currently: Button). Does NOT include `@pandacss/preset-panda` (Panda's opinionated tokens); `@pandacss/preset-base` (utility mappings) is auto-included.
- **@reva/ui** (`packages/ui`): Anatomy-first, fully typed, accessible-by-default React components built on Ark UI and Panda CSS. Uses Panda `styled()` for single-element components (`styled(ark.<element>, recipe)`) and `createStyleContext` for compound slot recipes. Currently ships Button; more components to follow.
- **@reva/config** (`packages/config`): Shared ESLint 9 flat config (typescript-eslint, @pandacss/eslint-plugin, react, react-hooks, jsx-a11y, simple-import-sort), Prettier config, and base TypeScript configs.

## Common Commands

```bash
bun install           # Install dependencies
bun run build         # Build all packages (Turborepo)
bun run dev           # Start development (Turborepo, persistent)
bun run lint          # Lint all packages
bun run typecheck     # Type-check all packages
bun run tokens:build  # Build design tokens only
bun run codegen       # Run Panda CSS codegen
bun run format        # Format all files with Prettier
bun run format:check  # Check formatting
```

## Token Rules

- **Panda-aligned plural namespace**: `colors`, `spacing`, `radii`, `shadows`, `fonts`, `fontSizes`, `fontWeights`, `lineHeights`. Matches Panda CSS category names for zero-mapping between token source and Panda preset.
- **Two layers**: foundation → semantic (recipes reference semantic tokens directly via Panda's `colorPalette.*`)
- **Colour foundation tokens NEVER in recipes or app code** — always go through the semantic layer. Per-palette semantic structure: root-level `canvas`, `surface`, `contrast`, `focusRing`; `bg.{subtle,muted,emphasized}` for interactive component fills; `border.{subtle,default,strong}`; `solid.{default,strong}` for high-impact fills; `fg.{subtle,default,emphasized}`; `alpha.{transparent,a1-a10}`. In recipe style objects, omit the `colors.` prefix — Panda auto-maps CSS properties to token categories (e.g., `bg: 'bg.surface'`, not `bg: 'colors.bg.surface'`)
- **Non-colour foundation tokens** (spacing, radii, borders, z-indices, durations, easings) MAY be used directly in recipes (`py: '4'`, `rounded: 'md'`)
- **DTCG format**: Always use `$value`, `$type`, `$description` (dollar-prefixed keys). No comments in JSON source files.
- **Token pipeline**: `@reva/tokens` builds Panda-compatible JSON (`dist/panda/`) that `@reva/panda-preset` imports directly — no hardcoded values in the preset.

### Semantic token reference (per-palette)

| Token | Group | Radix step | Use case | Neutral light | Neutral dark | Chromatic light | Chromatic dark |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `canvas` | root | 1 | Page/section tinted background | .50 | .950 | .50 | .950 |
| `surface` | root | 2 | Subtle panels, sidebars, table stripes | .100 | .900 | .100 | .900 |
| `bg.subtle` | bg | 3 | Interactive component fill, resting | .150 | .850 | .150 | .850 |
| `bg.muted` | bg | 4 | Interactive component fill, intensified | .200 | .800 | .200 | .800 |
| `bg.emphasized` | bg | 5 | Interactive component fill, most intense | .250 | .750 | .250 | .750 |
| `border.subtle` | border | 6 | Non-interactive borders: cards, dividers | .300 | .700 | .300 | .700 |
| `border.default` | border | 7 | Interactive component borders | .350 | .650 | .350 | .650 |
| `border.strong` | border | 8 | Emphasized borders, focus rings | .400 | .600 | .400 | .600 |
| `solid.default` | solid | 9 | Solid fills: buttons, CTAs, badges | .500 | .500 | .600 | .450 |
| `solid.strong` | solid | 10 | Intensified solid fill | .550 | .450 | .650 | .400 |
| `fg.subtle` | fg | -- | Dim tinted text: placeholders, annotations | .500 | .500 | .500 | .500 |
| `fg.default` | fg | 11 | Standard readable palette-tinted text | .650 | .350 | .700 | .300 |
| `fg.emphasized` | fg | 12 | High-contrast text: headings, key numbers | .800 | .200 | .850 | .150 |
| `contrast` | root | -- | Text on solid fills (white for most palettes) | white | white | white | white |
| `focusRing` | root | -- | Focus ring (alias of `border.strong`) | .400 | .600 | .400 | .600 |

### Recipe token paths

- Global: `bg: 'bg.surface'`, `color: 'fg.default'`
- Brand/accent variants: `_open: { color: 'brand.solid.default' }` (was `brand.solid`)
- In recipes with `colorPalette`: `bg: 'colorPalette.solid.default'` (was `colorPalette.bg.solid`), `color: 'colorPalette.contrast'` (was `colorPalette.fg.onSolid`), `outlineColor: 'colorPalette.focusRing'` (was `colorPalette.border.focusRing`)

## Key Architectural Decisions

- **Runtime theming** via Panda CSS themes API (`getTheme`/`injectTheme` from `styled-system/themes`)
- **No `@pandacss/preset-panda`** — we own all token definitions. Consuming apps use `presets: [revaPreset]` only.
- **`@pandacss/preset-base` auto-included** — provides utility mappings (`bg` → `background`, `p` → `padding`). Do NOT use `eject: true`.
- **Light/dark orthogonal to brand theme** — colour mode set via `data-color-mode` attribute on `<html>`, brand theme set via `data-panda-theme`
- **Code is source of truth for tokens** — never create Figma variables manually; go code-first
- **Anatomy-first components** — always derive slots from Ark UI anatomy via `anatomyKeys()`, never hardcode
- **Root config files use relative paths** — `.prettierrc.mjs` and `eslint.config.mjs` re-export from `./packages/config/` via relative path (not `@reva/config` specifier) due to Bun workspace hoisting behaviour
- **Docs site hybrid CSS** — Tailwind v4 handles the Fumadocs shell; Panda CSS handles component styling. PostCSS only runs `@tailwindcss/postcss` (no Panda PostCSS plugin). Panda CSS is generated via `panda cssgen --outfile styled-system/styles.css` and imported after explicit `@layer` declarations (`panda_base`, `panda_tokens`, `panda_recipes`, `panda_utilities`).
- **Portal apps use standard Panda PostCSS** — `@pandacss/dev/postcss` + `postcss-discard-duplicates`, no Tailwind.
- **`sizes` token mapping** — because we omit `@pandacss/preset-panda`, Panda has no built-in `sizes` category. The preset maps `sizes: pandaTokens.spacing` so that `h`, `w`, `minH`, `maxH` utilities resolve to token values instead of raw pixel values.
- **Styled primitives via Panda `styled()`** — For single-element components, use `styled(ark.<element>, recipe)` from `styled-system/jsx`. This is the north star (Park UI pattern). Avoids type assertions and manual `cx()`. Use `createStyleContext` only for compound components with slot recipes.

## Build Chain

```
@reva/config        → no build (exports raw config files)
@reva/tokens        → Style Dictionary → dist/
@reva/panda-preset  → tsdown → dist/
@reva/ui            → panda codegen → styled-system/ → tsdown → dist/
@reva/docs          → panda codegen + panda cssgen → styled-system/ → next build
portal apps         → panda codegen → styled-system/ → tsc -b → vite build
```

## Not Yet Implemented

The following are planned but not yet configured:

- **CI/CD** — GitHub Actions workflows for build, lint, typecheck, and publish
- **Testing** — Playwright end-to-end tests
- **Deployment** — Vercel project configuration

## Licence

Proprietary. All rights reserved.
