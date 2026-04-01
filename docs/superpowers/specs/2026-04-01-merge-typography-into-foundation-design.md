# Design Spec: Merge Typography Figma Collection into Foundation

**Date:** 2026-04-01
**Status:** Approved

## Summary

Remove the standalone `Typography` Figma collection and fold typography variables into the existing `Foundation` collection. The token source file (`typography.json`) and the SD/Panda pipeline are unchanged — this is a pure Figma manifest configuration change.

## Context

`packages/design-tokens/src/foundation/typography.json` already lives alongside all other foundation token files and is correctly included in Style Dictionary and Panda CSS builds. Its separation into a dedicated Figma collection was explicit — via `excludeFiles` in `figma-collections.ts` — but adds unnecessary complexity with no architectural benefit.

## What Changes

**File:** `packages/design-tokens/config/figma-collections.ts`

Two edits:
1. Remove `'typography.json'` from the Foundation collection's `excludeFiles` array.
2. Delete the entire `Typography` collection entry.

No other files change.

## Figma Variables Impact

The 20 typography variables currently in the `Typography` collection will move to `Foundation`:

| Group | Count | Figma type |
|-------|-------|------------|
| `fonts` | 4 | STRING |
| `fontSizes` | 12 | FLOAT (px) |
| `fontWeights` | 4 | FLOAT |

Foundation variable count goes from 535 → ~555.

`lineHeights` and `letterSpacings` remain absent from Figma (as today) — these groups are excluded via `SKIP_GROUPS` in `figma-format.ts` because Figma FLOAT variables bound to line-height/letter-spacing are always interpreted as px, making em/unitless values incorrect.

## What Does Not Change

- `src/foundation/typography.json` — source file untouched
- `config/build.ts` — `getFoundationFiles()` already includes `typography.json`
- `config/panda-format.ts` — already processes typography as a foundation token category
- `config/figma-format.ts` — `SKIP_GROUPS` and all value converters unchanged
- `textStyles.json` exclusion — remains excluded from both SD and Figma
- `shadows.json` exclusion — remains excluded from Foundation Figma collection

## After This Change

Running `bun run tokens:build` will produce a Figma manifest with:
- No `Typography` collection
- Foundation collection containing all typography variables (`fonts/*`, `fontSizes/*`, `fontWeights/*`)
- A re-sync via the Figma dev plugin will delete the stale `Typography` collection and add the variables to `Foundation`
