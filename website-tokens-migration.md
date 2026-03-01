# Migrate website-static CSS tokens to @reva/tokens

## Context

The static website (`apps/website-static`) defines its own CSS custom properties in `src/styles/tokens/`. Now that it's part of the monorepo, we want it to consume the foundation CSS variables from `@reva/tokens` (`dist/css/tokens-foundation.css`) instead of maintaining duplicate token definitions.

This document covers the **audit and mapping** phase only. The actual CSS migration will follow.

---

## Complete token inventory & mapping

### 1. COLORS

#### Brand colors (website → @reva/tokens)

The website uses named brand colors that map to specific stops in the Reva palette:

| Website variable | Value | @reva/tokens equivalent | Notes |
|---|---|---|---|
| `--color-brand-gold` | `#e2a336` | `--reva-colors-gold-500` | Exact match |
| `--color-brand-amber` | `#ab6400` | `--reva-colors-amber-600` | Exact match |
| `--color-brand-burgundy` | `#460815` | `--reva-colors-wine-800` | `#460819` vs `#460815` — **4-digit difference**, near match |
| `--color-brand-coffee-bean` | `#180207` | `--reva-colors-wine-950` | `#180206` vs `#180207` — **1-digit difference**, near match |
| `--color-brand-olive` | `#8a7d42` | `--reva-colors-olive-600` | Exact match |
| `--color-brand-deep-teal` | `#195257` | **No match** | Not in any Reva palette — teal-700 is `#005d51` |
| `--color-brand-eggshell` | `#ede9d9` | **No match** | Between olive-200 (`#ddd7ba`) and olive-100 (`#f0ede0`) — no exact match |
| `--color-brand-soft-linen` | `#f0ede0` | `--reva-colors-olive-100` | Exact match |
| `--color-brand-porcelain` | `#faf9f2` | `--reva-colors-olive-50` | Exact match |

#### Brand opacity scales (website → @reva/tokens)

The website defines 4 opacity scales for brand colors (gold, amber, burgundy, olive) using hex alpha notation (e.g. `#e2a33680`). **@reva/tokens does NOT have brand-specific opacity scales** — it only has `common.black` and `common.white` opacity scales.

| Website scale | @reva/tokens equivalent |
|---|---|
| `--color-brand-gold-a{5..95}` | **No equivalent** — would need to be added or use CSS `color-mix()` |
| `--color-brand-amber-a{5..95}` | **No equivalent** |
| `--color-brand-burgundy-a{5..95}` | **No equivalent** |
| `--color-brand-olive-a{5..95}` | **No equivalent** |

#### Black / white opacity scales

| Website pattern | @reva/tokens pattern | Match |
|---|---|---|
| `--color-black-solid` | `--reva-colors-common-black-solid` | Exact value match |
| `--color-black-a{5..95}` | `--reva-colors-common-black-a{5..95}` | Exact value match (hex alpha) |
| `--color-white-solid` | `--reva-colors-common-white-solid` | Exact value match |
| `--color-white-a{5..95}` | `--reva-colors-common-white-a{5..95}` | Exact value match (hex alpha) |
| `--color-black` | `--reva-colors-black` | Alias, same |
| `--color-white` | `--reva-colors-white` | Alias, same |
| `--color-transparent` | `--reva-colors-common-white-transparent` | Same value |

#### Sand palette

| Website pattern | @reva/tokens equivalent |
|---|---|
| `--color-sand-{50..950}` | **No match** — Reva has `stone` (close but different values) and no `sand` palette |

Website sand-50 is `#fafaf9` vs Reva stone-50 `#fafaf9` (same), but sand-200 `#e5e5e3` vs stone-200 `#e7e5e4` (different). Sand is not in @reva/tokens.

#### Semantic colors

These are website-specific semantic aliases. They don't exist in `tokens-foundation.css` (foundation has no semantic layer). They'll remain as local aliases pointing to @reva/tokens vars:

| Website variable | Current value | Reva foundation equivalent of the resolved value |
|---|---|---|
| `--color-bg` | `var(--color-brand-porcelain)` → `#faf9f2` | `--reva-colors-olive-50` |
| `--color-primary` | `var(--color-brand-amber)` → `#ab6400` | `--reva-colors-amber-600` |
| `--color-primary-hover` | `var(--color-brand-amber-a90)` | No equivalent (brand opacity scale) |
| `--color-focus` | `var(--color-brand-gold)` → `#e2a336` | `--reva-colors-gold-500` |
| `--color-text` | `var(--color-black-a90)` | `--reva-colors-common-black-a90` |
| `--color-text-muted` | `var(--color-black-a50)` | `--reva-colors-common-black-a50` |
| `--color-text-placeholder` | `var(--color-black-a35)` | `--reva-colors-common-black-a35` |
| `--color-text-inverted-default` | `var(--color-white-solid)` | `--reva-colors-common-white-solid` |
| `--color-text-inverted-muted` | `var(--color-white-a70)` | `--reva-colors-common-white-a70` |
| `--color-text-success` | `#166534` | `--reva-colors-green-800` (exact match) |
| `--color-text-error` | `#991b1b` | `--reva-colors-red-800` (exact match) |
| `--color-surface` | `var(--color-brand-porcelain)` → `#faf9f2` | `--reva-colors-olive-50` |
| `--color-surface-emphasized` | `var(--color-brand-soft-linen)` → `#f0ede0` | `--reva-colors-olive-100` |

---

### 2. SPACING

| Website variable | Value (rem) | Value (px) | @reva/tokens variable | Value | Match |
|---|---|---|---|---|---|
| `--spacing-half` | 0.125rem | 2px | `--reva-spacing-half` | 2px | Exact (units differ: rem vs px) |
| `--spacing-1` | 0.25rem | 4px | `--reva-spacing-1` | 4px | Exact |
| `--spacing-2` | 0.5rem | 8px | `--reva-spacing-2` | 8px | Exact |
| `--spacing-3` | 0.75rem | 12px | `--reva-spacing-3` | 12px | Exact |
| `--spacing-4` | 1rem | 16px | `--reva-spacing-4` | 16px | Exact |
| `--spacing-5` | 1.25rem | 20px | `--reva-spacing-5` | 20px | Exact |
| `--spacing-6` | 1.5rem | 24px | `--reva-spacing-6` | 24px | Exact |
| `--spacing-8` | 2rem | 32px | `--reva-spacing-8` | 32px | Exact |
| `--spacing-10` | 2.5rem | 40px | `--reva-spacing-10` | 40px | Exact |
| `--spacing-12` | 3rem | 48px | `--reva-spacing-12` | 48px | Exact |
| `--spacing-16` | 4rem | 64px | `--reva-spacing-16` | 64px | Exact |
| `--spacing-20` | 5rem | 80px | `--reva-spacing-20` | 80px | Exact |
| `--spacing-24` | 6rem | 96px | `--reva-spacing-24` | 96px | Exact |
| `--spacing-30` | 7.5rem | 120px | **No match** | — | Gap: 120px not in Reva |
| `--spacing-32` | 8rem | 128px | `--reva-spacing-32` | 128px | Exact |
| `--spacing-40` | 10rem | 160px | `--reva-spacing-40` | 160px | Exact |
| `--spacing-50` | 12.5rem | 200px | `--reva-spacing-50` | 200px | Exact |
| `--spacing-60` | 15rem | 240px | `--reva-spacing-60` | 240px | Exact |

**Unit difference**: Website uses `rem`, @reva/tokens uses `px`. Both resolve to the same computed values. This is a cosmetic difference that won't affect layout.

---

### 3. TYPOGRAPHY

Typography tokens are **NOT in `tokens-foundation.css`**. They exist in the `typography.json` source and are consumed by the Panda preset, but the `foundation` theme in `$themes.json` does not include `foundation/typography` — so **no CSS custom properties are generated for fonts, font sizes, weights, line heights, or letter spacings**.

| Website variable | Value | @reva/tokens source match | CSS var available? |
|---|---|---|---|
| `--font-body` | `'Inter Tight', system-ui, ...` | `fonts.text` = "Inter Tight" | **No** (not in foundation CSS) |
| `--font-heading` | `'Playfair Display', Georgia, ...` | `fonts.serif` = "Playfair Display" | **No** |
| `--font-mono` | `'Geist Mono', ui-monospace, ...` | `fonts.mono` = "Geist Mono" | **No** |
| `--font-size-{2xs..6xl}` | 11 sizes | `fontSizes.{3xs..6xl}` — 12 sizes | **No** |
| `--font-weight-{regular..bold}` | 400–700 | `fontWeights.{regular..bold}` | **No** |
| `--line-height-{tight..relaxed}` | 1.15–1.4 | `lineHeights.{tight..relaxed}` | **No** |
| `--letter-spacing-{dense..spacious}` | 6 values | `letterSpacings.{dense..spacious}` — 7 values | **No** |

**Notable differences**:
- Website `--font-size-2xs` = 11px, Reva `fontSizes.2xs` = 12px (website's 11px matches Reva's `fontSizes.3xs`)
- Website `--font-size-xs` = 12px, Reva `fontSizes.xs` = 13px (off by 1px)
- Website has no `--letter-spacing-tight` (-1%), Reva has it

---

### 4. RADII

| Website variable | Value (rem) | Value (px) | @reva/tokens variable | Value | Match |
|---|---|---|---|---|---|
| `--radius-xs` | 0.125rem | 2px | `--reva-radii-2xs` | 2px | Value match, **name differs** |
| `--radius-sm` | 0.25rem | 4px | `--reva-radii-xs` | 4px | Value match, **name differs** |
| `--radius-md` | 0.375rem | 6px | `--reva-radii-sm` | 6px | Value match, **name differs** |
| `--radius-lg` | 0.5rem | 8px | `--reva-radii-md` | 8px | Value match, **name differs** |
| `--radius-xl` | 0.75rem | 12px | `--reva-radii-lg` | 12px | Value match, **name differs** |
| `--radius-2xl` | 1rem | 16px | `--reva-radii-xl` | 16px | Value match, **name differs** |
| `--radius-3xl` | 1.5rem | 24px | `--reva-radii-2xl` | 24px | Value match, **name differs** |
| `--radius-4xl` | 2rem | 32px | `--reva-radii-3xl` | 32px | Value match, **name differs** |
| `--radius-full` | 9999px | 9999px | `--reva-radii-full` | 9999px | Exact match |
| `--radius-square` | 0 | 0 | `--reva-radii-none` | 0 | Value match, **name differs** |

The radii scales are **offset by one step** — the website's scale starts one size smaller than Reva's.

| Website component alias | Resolved value | @reva/tokens equivalent |
|---|---|---|
| `--radius-section-card-lg` | `var(--radius-4xl)` → 32px | `--reva-radii-3xl` |
| `--radius-section-card-md` | `var(--radius-3xl)` → 24px | `--reva-radii-2xl` |

---

### 5. SHADOWS

| Website variable | Value | @reva/tokens equivalent |
|---|---|---|
| `--shadow-card` | `0 12px 60px 0 var(--color-black-a20), 0 12px 32px -16px var(--color-black-a30)` | **No match** — Reva shadows have different values. Closest is `--reva-shadows-xl` or `--reva-shadows-2xl` but they're different. |

---

### 6. BREAKPOINTS

| Website variable | Value | @reva/tokens variable | Value | Match |
|---|---|---|---|---|
| `--screen-sm` | 480px | `--reva-breakpoints-sm` | 640px | **Different** |
| `--screen-md` | 768px | `--reva-breakpoints-md` | 768px | Exact |
| `--screen-lg` | 1024px | `--reva-breakpoints-lg` | 1024px | Exact |
| `--screen-xl` | 1280px | `--reva-breakpoints-xl` | 1536px | **Different** |
| `--screen-2xl` | 1536px | `--reva-breakpoints-2xl` | 1920px | **Different** |

Also: website uses `@custom-media` (PostCSS compile-time), while @reva/tokens exports CSS custom properties (runtime). Different mechanisms entirely.

---

### 7. BUTTON COMPONENT TOKENS

| Website variable | Value | @reva/tokens equivalent |
|---|---|---|
| `--button-size-sm` | 2rem (32px) | `--reva-sizes-8` (32px) |
| `--button-size-md` | 2.5rem (40px) | `--reva-sizes-10` (40px) |
| `--button-size-lg` | 3rem (48px) | `--reva-sizes-12` (48px) |

---

## Summary of gaps

Tokens that exist on the website but have **no equivalent** in `@reva/tokens`:

1. **Brand color opacity scales** (gold, amber, burgundy, olive × 19 steps each = 76 tokens) — only black/white opacity exists in Reva
2. **`--color-brand-deep-teal`** (`#195257`) — not in any Reva palette
3. **`--color-brand-eggshell`** (`#ede9d9`) — not in any Reva palette
4. **Sand palette** (11 tokens) — not in Reva (stone is close but different)
5. **`--spacing-30`** (120px) — not in Reva spacing scale
6. **All typography CSS variables** — not exported to CSS by the foundation build (only available in Panda preset)
7. **`--shadow-card`** — different shadow values from Reva's shadow scale
8. **Breakpoints sm, xl, 2xl** — different values
9. **Breakpoints mechanism** — `@custom-media` vs CSS custom properties

---

## Decision points for migration

Before implementing, we need to resolve these:

1. **Brand opacity scales**: Keep as local website tokens, or add them to @reva/tokens?
2. **deep-teal / eggshell**: Keep as hardcoded local values, or add to @reva/tokens palette?
3. **Sand palette**: Keep local, or add to @reva/tokens? (It's used in the website but not elsewhere)
4. **Typography**: Keep local CSS vars (since @reva/tokens doesn't export them to CSS), or add typography to the foundation build?
5. **Spacing 30**: Add to @reva/tokens or replace with a nearby value (24=96px or 32=128px)?
6. **Shadow**: Keep custom card shadow, or adopt a Reva shadow scale value?
7. **Breakpoints**: Keep the website's different breakpoints or align to Reva's?
8. **Unit system**: Website uses rem, @reva/tokens uses px — accept the switch?
