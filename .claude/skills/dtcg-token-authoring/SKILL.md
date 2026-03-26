---
name: dtcg-token-authoring
description: >
  Technical reference for writing valid W3C DTCG-format JSON design token
  files for the Reva design system. Use this skill whenever creating, editing,
  or reviewing design token .json source files, or when the user mentions
  design tokens, token types, DTCG format, token references, Style Dictionary,
  or token authoring. Also trigger when generating tokens for colours,
  typography, spacing, shadows, borders, opacity, or any other design property
  in JSON. This skill prevents bugs in source tokens that would break the
  build pipeline and Figma variable sync.
---

# W3C DTCG Token Authoring Reference

Technical reference for authoring design token JSON source files in the
W3C DTCG format for the Reva design system. These files are the source of
truth — they feed the Style Dictionary build pipeline, which outputs CSS,
TypeScript, JSON, Panda CSS, and Figma variables manifest.

Getting the source format wrong causes lint failures, broken builds, and
incorrect Figma variable sync. Follow these rules precisely.

The token linter (`bun run tokens:lint`) validates all source files against
these rules. It runs automatically before every build.

---

## Token anatomy

Every token is a JSON object with dollar-prefixed properties per the
W3C DTCG specification:

```json
{
  "amber": {
    "500": {
      "$value": "oklch(0.769 0.174 70.08)",
      "$type": "color",
      "$description": "Core amber midpoint."
    }
  }
}
```

**Required properties:**

- `$value` : the design decision (format depends on type)
- `$type` : the token type string (see supported types below)

**Optional properties:**

- `$description` : a human-readable string documenting the intent

**Critical rules:**

- Always use the `$` prefix. Never write `"value"` or `"type"` without
  it.
- `$type` can be declared at **group level** and is inherited by all
  tokens nested within that group.
- `$description` must ONLY be placed on **leaf tokens** (nodes with a
  `$value`). Never place `$description` on group nodes.
- Token groups are nested JSON objects.
- **No comments in JSON source files** — must be valid JSON.
- **No trailing commas.**

```json
{
  "spacing": {
    "$type": "dimension",
    "1": { "$value": "4px" },
    "2": { "$value": "8px" },
    "3": { "$value": "12px" }
  }
}
```

---

## Supported token types

Use only the W3C DTCG `$type` strings listed below, plus the Reva
project extension `other`.

### Core types

| `$type`       | `$value` format                                     | Examples                                     |
| ------------- | --------------------------------------------------- | -------------------------------------------- |
| `color`       | oklch() string (preferred) or hex                   | `"oklch(0.769 0.174 70.08)"`, `"#f59e0b"`    |
| `dimension`   | Number + unit string (`px`, `rem`, `em`, `ms`, `s`) | `"16px"`, `"1.5rem"`, `"-0.02em"`, `"200ms"` |
| `number`      | Unitless number                                     | `4`, `1.5`, `0.7`                            |
| `fontFamily`  | String or array of strings                          | `"Inter Tight"`, `["Inter", "sans-serif"]`   |
| `fontWeight`  | Number (100–900) or named string                    | `400`, `700`, `"bold"`                       |
| `duration`    | Number + time unit                                  | `"200ms"`, `"0.5s"`                          |
| `cubicBezier` | Array of 4 numbers                                  | `[0.4, 0, 0.2, 1]`                           |
| `shadow`      | Object or array of objects                          | See composites section                       |
| `border`      | Composite object                                    | See composites section                       |
| `typography`  | Composite object                                    | See composites section                       |
| `gradient`    | Array of gradient stops                             | See W3C DTCG spec                            |
| `strokeStyle` | String or object                                    | `"solid"`, `"dashed"`                        |
| `transition`  | Composite object                                    | See W3C DTCG spec                            |
| `other`       | Any value (Reva extension)                          | Aspect ratios, cursors, CSS keywords         |

### Colour values

**Always use oklch() for new colour tokens.** This provides perceptual
uniformity and wide-gamut support. The build pipeline converts oklch to
hex (CSS) and RGBA (Figma).

```json
{
  "gold": {
    "500": {
      "$value": "oklch(0.769 0.174 70.08)",
      "$type": "color",
      "$description": "Reva brand gold midpoint"
    }
  }
}
```

### Typography tokens

Use the **W3C DTCG official types** for individual typography tokens:

| `$type`      | `$value` format                | Examples                                   |
| ------------ | ------------------------------ | ------------------------------------------ |
| `fontFamily` | String or array of strings     | `"Inter Tight"`, `["Inter", "sans-serif"]` |
| `fontWeight` | Numeric weight (100–900)       | `400`, `600`, `700`                        |
| `dimension`  | For font sizes, letter spacing | `"16px"`, `"-0.02em"`                      |
| `number`     | For line heights (unitless)    | `1.2`, `1.3`, `1.5`                        |

---

## Composite token structures

Composite tokens combine multiple properties into a single `$value`
object. Property names are **camelCase**.

### Typography

```json
{
  "$type": "typography",
  "$value": {
    "fontFamily": "{fonts.display}",
    "fontWeight": "{fontWeights.semibold}",
    "fontSize": "{fontSizes.2xl}",
    "lineHeight": "130%",
    "letterSpacing": "-1%"
  }
}
```

### Shadow

The `$type` is `"shadow"`. Single or multiple layers via array:

```json
{
  "$type": "shadow",
  "$value": {
    "color": "oklch(0 0 0 / 0.1)",
    "offsetX": "0px",
    "offsetY": "4px",
    "blur": "6px",
    "spread": "-1px"
  }
}
```

### Border

```json
{
  "$type": "border",
  "$value": {
    "color": "{colors.gray.300}",
    "width": "{borderWidths.default}",
    "style": "solid"
  }
}
```

---

## References and aliases

Reference another token by wrapping its full dot-notation path in
curly braces within a `$value`:

```json
{ "$value": "{colors.amber.500}", "$type": "color" }
```

**Syntax rules:**

- Path segments map to the JSON nesting hierarchy:
  `{colors.amber.500}` resolves to `colors` > `amber` > `500`.
- References work **across source files**. At build time all files are
  merged before resolution.
- Math expressions: `"{spacing.2} * 2"`, `"{spacing.base} + 4"`.
  Always use spaces around operators.
- **Never create circular references.**

---

## Naming conventions

- **Panda-aligned plural namespaces**: `colors`, `spacing`, `radii`,
  `shadows`, `fonts`, `fontSizes`, `fontWeights`, `lineHeights`,
  `letterSpacings`. Matches Panda CSS category names.
- **Flat numeric scales**: `0`, `1`, `2`, `sm`, `md`, `lg`.
- **T-shirt sizing**: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`.
- **Half-steps**: `half`, `1_half`, `2_half`.
- **Colour palettes**: 19-stop scale (50–950 in 50-step increments).

---

## Source file structure

```
src/
├── foundation/          # Foundation tokens (one file per category)
│   ├── colors.json
│   ├── spacing.json
│   ├── sizes.json
│   ├── typography.json
│   ├── textStyles.json
│   ├── shadows.json
│   ├── radii.json
│   ├── blurs.json
│   ├── opacity.json
│   ├── durations.json
│   ├── borderWidths.json
│   ├── zIndex.json
│   ├── aspectRatios.json
│   ├── cursors.json
│   ├── containerSizes.json
│   └── breakpoints.json
├── colorMode/
│   ├── light.json       # Light mode semantic tokens (references foundation)
│   └── dark.json        # Dark mode semantic tokens (references foundation)
```

---

## Figma variable mapping

Not all tokens become Figma variables. The build pipeline excludes:

- **`lineHeights`** and **`letterSpacings`** — Figma FLOAT variables are
  unitless; percentage interpretation is impossible.
- **`shadow`** and **`typography`** composite types.
- **`other`** type tokens (aspect ratios, cursors).

All other foundation and semantic tokens are mapped to three Figma
collections: Foundation, Typography, and Color mode.

---

## Common errors

1. **Missing `$` prefix.** `"type"` and `"value"` are invalid.
2. **Bare numbers for dimensions.** `16` is wrong; use `"16px"`.
3. **Wrong composite property names.** Use `fontFamily` not `font-family`.
4. **`$description` on groups.** Only place on leaf tokens.
5. **Circular references.** A → B → A fails the build.
6. **Trailing commas or comments.** Source files must be valid JSON.
7. **Using hex for new colours.** Always use oklch() for new colour tokens.
8. **Forgetting `$type` inheritance.** A child inherits the parent group's
   `$type`. Don't place a mismatched token inside a typed group without
   overriding `$type`.
