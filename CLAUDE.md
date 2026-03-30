# CLAUDE.md

## Project Overview

Reva is intelligent orchestration for modern wealth — financial infrastructure for growing advisory firms. Personalised outcomes for every client, not just your largest. This monorepo establishes the digital foundation for the Reva brand and product: a design system (unnamed), component library, and application platform. Managed with Turborepo and Bun. The system is designed for white-labelling: each advisory firm will get a branded environment where their end users never see Reva branding. Runtime theme switching (via Panda CSS themes API) is planned but not yet implemented; the current preset defines a single base Reva theme with light/dark colour modes.

## Tech Stack

- **Monorepo**: Turborepo
- **Package manager**: Bun (`bun install`, `bun run build`, `bun run dev`)
- **Language**: TypeScript (strict mode, no `any`)
- **Components**: Ark UI (headless) + Panda CSS (styling)
- **Design tokens**: DTCG JSON (oklch colours) → Style Dictionary v4 + custom transforms → CSS / TS / JSON / React Native / Panda / Figma manifest
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
│   │   └── src/
│   │       ├── foundation/    # Foundation tokens (16 files: colours, spacing, sizes, radii, etc.)
│   │       ├── colorMode/     # Semantic colour tokens (light.json, dark.json)
│   │       └── components/    # Component-specific tokens (button.json)
│   ├── panda-preset/          # @reva/panda-preset — Panda CSS preset, recipes, text styles
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

- **@reva/tokens** (`packages/design-tokens`): Authored in W3C DTCG format (`$value`, `$type`, `$description`) with colours in oklch(). Three-layer architecture: foundation tokens (16 files — colours, spacing, sizes, radii, typography, shadows, etc.), semantic colour tokens (`colorMode/light.json`, `colorMode/dark.json`), and component tokens (`components/button.json`). Transformed via Style Dictionary v4 and custom build scripts (`config/build.ts`) into CSS custom properties, TypeScript constants, JSON, React Native JSON, Panda CSS JSON (foundation + semantic), per-component recipe spec JSON, and a Figma variables manifest. Includes a custom linter (`config/lint.ts`) that validates against DTCG spec and Reva conventions, and a watch script (`config/watch.ts`) for live development. Code is source of truth; Figma syncs one-way (code → Figma) via a custom dev plugin at `tools/figma-variable-sync/`.
- **@reva/website-static** (`apps/reva-website`): Current static marketing site (Vite + PostCSS + PostHTML). Will be updated to consume CSS custom properties from `@reva/tokens` once the token package is published. A more complex Next.js `website` app will eventually replace it.
- **@reva/panda-preset** (`packages/panda-preset`): Bridges design tokens into Panda CSS. Imports `@reva/tokens/panda/tokens` and `@reva/tokens/panda/semantic-tokens` via `defineTokens`/`defineSemanticTokens`. Also imports component token specs (`@reva/tokens/panda/components/*`) for recipe metrics. Defines light/dark mode conditions, component recipes (currently: Button), keyframes, and text styles (marketing + product). Does NOT include `@pandacss/preset-panda` (Panda's opinionated tokens); `@pandacss/preset-base` (utility mappings) is auto-included. Breakpoints and container sizes are hardcoded as flat maps in the preset (not wrapped as `{ value }` tokens).
- **@reva/ui** (`packages/ui`): Anatomy-first, fully typed, accessible-by-default React components built on Ark UI and Panda CSS. Uses Panda `styled()` for single-element components (`styled(ark.<element>, recipe)`) and `createStyleContext` for compound slot recipes. Currently ships Button; more components to follow.
- **@reva/config** (`packages/config`): Shared ESLint 9 flat config (typescript-eslint, @pandacss/eslint-plugin, react, react-hooks, jsx-a11y, simple-import-sort), Prettier config, and base TypeScript configs.

## Common Commands

```bash
bun install           # Install dependencies
bun run build         # Build all packages (Turborepo)
bun run dev           # Start development (Turborepo, persistent)
bun run lint          # Lint all packages
bun run typecheck     # Type-check all packages
bun run tokens:lint   # Validate token source JSON against DTCG spec + Reva conventions
bun run tokens:build  # Lint then build design tokens (all output formats)
bun run tokens:watch  # Watch src/ → auto lint + build on .json changes
bun run tokens:serve  # Serve dist/figma/ on localhost:3456 for Figma plugin
bun run codegen       # Run Panda CSS codegen
bun run format        # Format all files with Prettier
bun run format:check  # Check formatting
```

## Token Rules

- **Panda-aligned plural namespace**: `colors`, `spacing`, `sizes`, `radii`, `shadows`, `fonts`, `fontSizes`, `fontWeights`, `lineHeights`, `letterSpacings`, `borderWidths`, `blurs`, `opacity`, `durations`, `zIndex`, `aspectRatios`, `cursors`. Matches Panda CSS category names for zero-mapping between token source and Panda preset. Additionally, `containerSizes` and `breakpoints` are authored as DTCG token files but consumed as Panda flat maps (not `{ value }` wrapped).
- **Three layers**: foundation → semantic → component (recipes reference semantic colour tokens via Panda's `colorPalette.*`; non-colour metrics like height, padding, font-size come from component token specs)
- **Colour foundation tokens NEVER in recipes or app code** — always go through the semantic layer. Per-palette semantic structure: root-level `canvas`, `surface`, `solid` (.500 midpoint), `focusRing`; `bg.{subtle,muted,emphasized,solid,strong}` for component fills; `border.{subtle,default,strong}`; `fg.{default,highContrast,onSolid}`; `alpha.{transparent,a50,a100,a200,a300,a400,a500,a600,a700,a800,a900,a950}`. Semantic palettes: neutral (→ olive), brand (→ gold), accent (→ amber), error (→ mulberry), warning (→ copper), success (→ fern), info (→ cobalt), misc (utility). In recipe style objects, omit the `colors.` prefix — Panda auto-maps CSS properties to token categories (e.g., `bg: 'bg.surface'`, not `bg: 'colors.bg.surface'`)
- **Non-colour foundation tokens** (spacing, radii, borders, z-indices, durations, easings) MAY be used directly in recipes (`py: '4'`, `rounded: 'md'`)
- **DTCG format**: Always use `$value`, `$type`, `$description` (dollar-prefixed keys). No comments in JSON source files.
- **Token pipeline**: `@reva/tokens` builds Panda-compatible JSON (`dist/panda/tokens.json`, `dist/panda/semantic-tokens.json`) that `@reva/panda-preset` imports directly — no hardcoded values in the preset. Also builds per-component recipe spec JSON (`dist/panda/components/*.json`) that recipes import for sizing/spacing metrics, and a Figma variables manifest (`dist/figma/variables-manifest.json`) for one-way sync to Figma.
- **Colour format**: Source tokens use oklch() for perceptual uniformity and wide-gamut support. Custom Style Dictionary transforms convert oklch → hex for CSS and oklch → RGBA for Figma.
- **Token linting**: `tokens:lint` validates all source JSON against W3C DTCG spec and Reva conventions before every build. Runs automatically in `tokens:build` and `tokens:watch`.

### Semantic token reference (per-palette)

| Token              | Group  | Use case                                                   | Neutral light | Neutral dark | Chromatic light | Chromatic dark |
| ------------------ | ------ | ---------------------------------------------------------- | ------------- | ------------ | --------------- | -------------- |
| `canvas`           | root   | Page/section tinted background                             | .50           | .950         | .50             | .950           |
| `surface`          | root   | Subtle panels, sidebars, table stripes                     | .100          | .900         | .100            | .900           |
| `solid`            | root   | Reference midpoint (.500) for charts, indicators           | .500          | .500         | .500            | .500           |
| `focusRing`        | root   | Focus ring (alias of `border.strong`)                      | .400          | .600         | .400            | .600           |
| `bg.subtle`        | bg     | Interactive component fill, resting                        | .150          | .850         | .150            | .850           |
| `bg.muted`         | bg     | Interactive component fill, intensified                    | .200          | .800         | .200            | .800           |
| `bg.emphasized`    | bg     | Interactive component fill, most intense                   | .250          | .750         | .250            | .750           |
| `bg.solid`         | bg     | Solid fill: buttons, CTAs, badges                          | .700          | .200         | .600            | .450           |
| `bg.strong`        | bg     | Intensified solid fill                                     | .750          | .150         | .650            | .400           |
| `border.subtle`    | border | Non-interactive borders: cards, dividers                   | .300          | .700         | .300            | .700           |
| `border.default`   | border | Interactive component borders                              | .350          | .650         | .350            | .650           |
| `border.strong`    | border | Emphasized borders, focus rings                            | .400          | .600         | .400            | .600           |
| `fg.default`       | fg     | Standard readable palette-tinted text                      | .650          | .350         | .700            | .300           |
| `fg.highContrast`  | fg     | High-contrast text: headings, key numbers                  | .800          | .200         | .850            | .150           |
| `fg.onSolid`       | fg     | Text on solid fills (white in light; palette .900 in dark) | white         | .900         | white           | .900           |
| `alpha.a50`–`a950` | alpha  | Non-linear opacity ramp (a50,a100,a200…a900,a950: 4%–95%) | --            | --           | --              | --             |

### Recipe token paths

- Global: `bg: 'bg.surface'`, `color: 'fg.default'`
- In recipes with `colorPalette`: `bg: 'colorPalette.bg.solid'`, `color: 'colorPalette.fg.onSolid'`, `_hover: { bg: 'colorPalette.bg.strong' }`, `outlineColor: 'colorPalette.focusRing'`

## Key Architectural Decisions

- **Runtime theming** (planned, not yet implemented) — will use Panda CSS themes API (`getTheme`/`injectTheme` from `styled-system/themes`) for brand/client themes. Currently the preset defines a single base Reva theme; multi-theme support for white-labelling is a future addition.
- **No `@pandacss/preset-panda`** — we own all token definitions. Consuming apps use `presets: [revaPreset]` only.
- **`@pandacss/preset-base` auto-included** — provides utility mappings (`bg` → `background`, `p` → `padding`). Do NOT use `eject: true`.
- **Light/dark orthogonal to brand theme** — colour mode conditions support both `:root.dark` / `:root:not(.dark)` class and `[data-color-mode=light]` / `[data-color-mode=dark]` attribute selectors. Brand theme will be set via `data-panda-theme` once runtime theming is implemented.
- **Code is source of truth for tokens** — never create Figma variables manually; go code-first. Figma sync is one-way (code → Figma) via a custom dev plugin that reads a variables manifest from `localhost:3456`. The plugin deletes stale variables and collections on every sync.
- **Anatomy-first components** — always derive slots from Ark UI anatomy via `anatomyKeys()`, never hardcode
- **Root config files use relative paths** — `.prettierrc.mjs` and `eslint.config.mjs` re-export from `./packages/config/` via relative path (not `@reva/config` specifier) due to Bun workspace hoisting behaviour
- **Docs site hybrid CSS** — Tailwind v4 handles the Fumadocs shell; Panda CSS handles component styling. PostCSS only runs `@tailwindcss/postcss` (no Panda PostCSS plugin). Panda CSS is generated via `panda cssgen --outfile styled-system/styles.css` and imported after explicit `@layer` declarations (`panda_base`, `panda_tokens`, `panda_recipes`, `panda_utilities`).
- **Portal apps use standard Panda PostCSS** — `@pandacss/dev/postcss` + `postcss-discard-duplicates`, no Tailwind.
- **`sizes` as a dedicated token set** — `src/foundation/sizes.json` provides a comprehensive sizing scale (numeric px steps with half-step granularity, named rem sizes, viewport units, and intrinsic keywords). Because we omit `@pandacss/preset-panda`, Panda has no built-in `sizes`. The token pipeline emits `sizes` as a proper Panda token category, so `h`, `w`, `minH`, `maxH` utilities resolve to token values.
- **Styled primitives via Panda `styled()`** — For single-element components, use `styled(ark.<element>, recipe)` from `styled-system/jsx`. This is the north star (Park UI pattern). Avoids type assertions and manual `cx()`. Use `createStyleContext` only for compound components with slot recipes.

## Build Chain

```
@reva/config        → no build (exports raw config files)
@reva/tokens        → lint → Style Dictionary + custom transforms → dist/ (CSS, TS, JSON, Panda tokens, Panda semantic-tokens, Panda component specs, Figma manifest)
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
