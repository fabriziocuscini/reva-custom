# Merge Typography into Foundation Figma Collection — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the standalone `Typography` Figma collection and include typography variables in the `Foundation` collection.

**Architecture:** `figma-collections.ts` is the single source of truth for Figma collection layout. Removing `typography.json` from Foundation's `excludeFiles` and deleting the `Typography` collection entry is the entire change — the SD and Panda pipelines already handle `typography.json` as a foundation file.

**Tech Stack:** TypeScript, Style Dictionary v4, Bun

---

### Task 1: Update figma-collections.ts

**Files:**
- Modify: `packages/design-tokens/config/figma-collections.ts`

- [ ] **Step 1: Edit the file**

Replace the current `figmaCollections` export with:

```ts
export const figmaCollections: FigmaCollectionConfig[] = [
  {
    name: 'Foundation',
    modes: [{ name: 'foundation', sources: ['foundation'] }],
    excludeFiles: ['textStyles.json', 'shadows.json'],
  },
  {
    name: 'Color mode',
    modes: [
      { name: 'light', sources: ['colorMode/light'] },
      { name: 'dark', sources: ['colorMode/dark'] },
    ],
  },
]
```

Two changes from the current file:
- `'typography.json'` removed from Foundation's `excludeFiles`
- The entire `Typography` collection object removed

- [ ] **Step 2: Build tokens and verify the manifest**

```bash
bun run tokens:build
```

Expected output includes:
```
✓ Built theme: foundation
✓ Built theme: light
✓ Built theme: dark
✓ Built Panda CSS output
✓ Built Figma variables manifest
```

Then inspect the manifest to confirm the Typography collection is gone and Foundation contains `fonts/*`, `fontSizes/*`, and `fontWeights/*`:

```bash
node -e "
const m = require('./packages/design-tokens/dist/figma/variables-manifest.json');
const cols = m.collections.map(c => ({ name: c.name, count: c.variables.length }));
console.log(JSON.stringify(cols, null, 2));
const found = m.collections.find(c => c.name === 'Foundation');
const typoVars = found.variables.filter(v => v.name.startsWith('fonts') || v.name.startsWith('fontSizes') || v.name.startsWith('fontWeights'));
console.log('Typography vars in Foundation:', typoVars.map(v => v.name));
"
```

Expected: No `Typography` entry in the collections array. Foundation count increases by 20. `fonts/*`, `fontSizes/*`, `fontWeights/*` variables listed.

- [ ] **Step 3: Commit**

```bash
git add packages/design-tokens/config/figma-collections.ts
git commit -m "feat(tokens): merge typography variables into Foundation Figma collection"
```
