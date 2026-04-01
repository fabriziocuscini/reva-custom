# Implementation Plan: Remove Component Token Layer

**Spec:** `2026-04-01-remove-component-token-layer-design.md`

## Task Breakdown

Three independent work streams that can run in parallel, plus a final serial verification step.

### Stream A: Token package cleanup (`@reva/tokens`)

Files to modify:
1. **Delete** `packages/design-tokens/src/components/` directory
2. **Edit** `packages/design-tokens/config/build.ts`:
   - Remove `getComponentFiles()` function
   - Remove `componentFiles` variable from `build()`
   - Remove the entire "Component build" `if (componentFiles.length > 0)` SD block
   - Remove `buildComponentSpecs(componentFiles, distDir)` call and its console.log
   - Remove the components aggregate block in Figma manifest section
   - Remove `buildComponentSpecs` from the import of `panda-format`
3. **Edit** `packages/design-tokens/config/panda-format.ts`:
   - Delete `resolveRefToKey()` function
   - Delete `stripDtcgToSpec()` function
   - Delete `buildComponentSpecs()` function and its export
4. **Edit** `packages/design-tokens/config/figma-collections.ts`:
   - Remove the `Components` entry from `figmaCollections` array
5. **Edit** `packages/design-tokens/package.json`:
   - Remove `"./panda/components/*"` export
6. **Clean** stale build outputs: `rm -rf packages/design-tokens/dist/panda/components/ packages/design-tokens/dist/css/tokens-components.css packages/design-tokens/dist/ts/tokens-components.ts packages/design-tokens/dist/json/tokens-components.json packages/design-tokens/dist/json-mobile/tokens-components.json`

### Stream B: Recipe rewrite (`@reva/panda-preset`)

Files to modify:
1. **Rewrite** `packages/panda-preset/src/recipes/button.ts`:
   - Remove `import btn from '@reva/tokens/panda/components/button'`
   - Replace all `btn.*` references with inline foundation token keys
   - Base: `fontFamily: 'text'`, `fontWeight: 'medium'`, `borderWidth: 'default'`, `transitionDuration: 'fast'`, `_disabled.opacity: 'disabled'`, `_focus.outline: 'thick solid'`, `_focus.outlineOffset: 'thick'`
   - Size variants (inline): 2xs→{h:'6',minW:'6',px:'2',gap:'1',fontSize:'2xs',lineHeight:'normal',borderRadius:'xs'}, xs→{h:'7',minW:'7',px:'2',gap:'1',fontSize:'xs',lineHeight:'normal',borderRadius:'sm'}, sm→{h:'8',minW:'8',px:'3',gap:'1',fontSize:'xs',lineHeight:'normal',borderRadius:'sm'}, md→{h:'10',minW:'10',px:'4',gap:'2',fontSize:'sm',lineHeight:'normal',borderRadius:'md'}, lg→{h:'12',minW:'12',px:'5',gap:'2',fontSize:'md',lineHeight:'normal',borderRadius:'md'}, xl→{h:'14',minW:'14',px:'6',gap:'3',fontSize:'lg',lineHeight:'normal',borderRadius:'lg'}

### Stream C: Documentation updates

Files to modify:
1. **Edit** `CLAUDE.md`: Update all references from three-layer to two-layer architecture. Remove component token mentions from: Token Rules, Package Details, Build Chain, Repository Structure sections.
2. **Check** `.claude/skills/ui-component-patterns/SKILL.md`: Verify no stale component token references.
3. **Check** `.claude/skills/dtcg-token-authoring/SKILL.md`: Remove component token patterns if present.

### Stream D (serial, after A+B+C): Verification

1. `bun run tokens:build` — no errors, no component outputs
2. `bun run build` — full monorepo build passes
3. `bun run typecheck` — no type errors
4. `bun run lint` — passes
5. Confirm `dist/figma/variables-manifest.json` has no `Components` collection
6. Confirm `dist/panda/components/` does not exist
