# @reva/tokens

Platform-agnostic, multi-themeable design tokens for the Reva design system.

Authored in [Tokens Studio](https://tokens.studio/) DTCG format (`$value`, `$type`, `$description`) and transformed via [Style Dictionary v4](https://styledictionary.com/) + `@tokens-studio/sd-transforms` into multiple output formats.

## Token Architecture

Tokens are organised in three layers:

| Layer | Purpose | Usage in code |
| --- | --- | --- |
| **Foundation** | Raw, context-free values (colours, spacing, radii, etc.) | Only in the semantic layer or Panda preset — never in app code directly |
| **Semantic** | Contextual aliases (`fg.default`, `bg.surface`, `brand.solid`) | In recipes and app code via Panda token paths |
| **Component** | Rare, component-specific overrides when semantic tokens don't fit | Must reference semantic tokens |

Colour foundation tokens are **never used directly** in recipes or app code — always go through the semantic layer. Non-colour foundation tokens (spacing, radii, z-index, etc.) may be used directly.

## Foundation Token Sets

| Token set | Panda category | Description |
| --- | --- | --- |
| `colors` | `colors` | Colour palettes — neutral, brand, and common (white/black) |
| `spacing` | `spacing` | Spatial scale for padding, margins, and gaps (`0`–`16` = 0–64px) |
| `sizes` | `sizes` | Container widths (`container.md`–`container.8xl`), viewport units, and intrinsic sizing keywords (`full`, `min`, `max`, `fit`, `prose`) — merged with spacing in the Panda preset |
| `typography` | `fonts`, `fontSizes`, `fontWeights`, `lineHeights` | Font families, sizes, weights, and line heights |
| `radii` | `radii` | Border radius scale (`none`–`4xl`, `full`) |
| `blurs` | `blurs` | Blur radius scale for backdrop/filter effects (`none`–`xl`) |
| `durations` | `durations` | Animation/transition timing (`fastest` 50ms – `slowest` 500ms) |
| `aspectRatios` | `aspectRatios` | Common aspect ratios (`square`, `landscape`, `portrait`, `wide`, `ultrawide`, `golden`) |
| `breakpoints` | `breakpoints` | Responsive breakpoints (`sm` 640px – `2xl` 1920px) |
| `zIndex` | `zIndex` | Stacking order from `hide` (-1) through `tooltip` (1800) |
| `shadows` | `shadows` | Elevation shadows (`sm`, `md`) |

## Semantic Token Sets

| Token set | Description |
| --- | --- |
| `colors` | Light mode colour assignments — maps semantic names to foundation colours |
| `colors-dark` | Dark mode colour assignments — same semantic names, different foundation values |

## Output Formats

| Format | Path | Description |
| --- | --- | --- |
| CSS custom properties | `dist/css/tokens-{theme}.css` | `--reva-{category}-{name}` variables |
| TypeScript constants | `dist/ts/tokens-{theme}.ts` | Named exports (`colorsBrand500`, `spacing4`) |
| JSON (nested) | `dist/json/tokens-{theme}.json` | Nested structure with resolved values |
| JSON (flat, mobile) | `dist/json-mobile/tokens-{theme}.json` | Flat camelCase keys for React Native |
| W3C DTCG JSON | `dist/json-dtcg/tokens-{theme}.json` | Standards-compliant `$value`/`$type` output |
| Panda CSS | `dist/panda/tokens.json`, `dist/panda/semantic-tokens.json` | `{ value }` format consumed by `@reva/panda-preset` |

## Build

```bash
bun run tokens:build    # Build all output formats
bun run build           # Same, via Turborepo
```

## How Panda CSS Consumes Tokens

`@reva/panda-preset` imports from `@reva/tokens/panda/tokens` and `@reva/tokens/panda/semantic-tokens`. The preset performs two mappings:

- **`sizes`**: merges `spacing` + `sizes` tokens (so `h: '10'` resolves spacing while `maxW: 'container.3xl'` resolves container widths)
- **`breakpoints`**: flattens from `{ value }` token format to Panda's flat `{ sm: '640px' }` map

## Source of Truth

Code is the source of truth — tokens are authored here and synced bidirectionally with Figma via the Tokens Studio plugin. Never create Figma variables manually.
