## Learned User Preferences

- Prefers simplicity over formal contracts in the design system — removed the component token layer because it was overkill for the workflow
- Comfortable with AI-assisted component implementation from Figma designs — no need for token-level specs as intermediary
- Actively maintains documentation accuracy — audits and updates CLAUDE.md, READMEs, and skill files after structural changes
- Never commit secrets to git — use environment variables or gitignored config (a Figma PAT was accidentally committed once)
- Wants `.cursor/` fully gitignored (hooks state, MCP config, workspace settings are machine-local)
- In Figma, prefers variable bindings over hardcoded values for reusable design properties (font family, weight, size) — only hardcode line height and letter spacing
- Prefers component recipes co-located with component definitions — single place to go when creating or modifying a component (implemented: `@reva/panda-preset` merged into `@reva/ui`)
- Prefers Fumadocs shared `apps/docs/lib/layout.shared.tsx` with `baseOptions()` for nav (logo, GitHub, links) so docs layouts stay consistent and easy to extend


## Learned Workspace Facts

- Local dev uses portless proxy: `sudo portless proxy start --https --tld local --port 443` for clean HTTPS at `*.revaos.local`; loading `@reva/docs` at `docs.revaos.local` in dev needs `allowedDevOrigins: ['docs.revaos.local']` in `apps/docs/next.config.mjs` (Next.js 16) or client JS won't load and hydration breaks (tabs, theme toggle, and other client controls)
- Portless proxy runs once per boot; individual dev servers (`bun run dev:tokens`, `bun run dev:docs`) register automatically
- Style Dictionary 4.4.0 bug: `verbosity: 'silent'` causes ENOENT in `cleanFile` on missing output files — use default verbosity with `warnings: 'disabled'`
- User has multiple MacBook Pros — build failures on one machine often mean stale or missing `dist/` artifacts
- `@reva/panda-preset` has been merged into `@reva/ui` — preset, theme files, and recipes live under `packages/ui/src/theme/` and `packages/ui/src/components/*/recipe.ts`; consumers import via `@reva/ui/preset`
- Text styles in the Panda preset (`packages/ui/src/theme/text-styles.ts`) are manually authored, not auto-generated from the token pipeline
- The `textStyles.json` source file is excluded from Style Dictionary build via `sdExclude` — renamed collections: `marketing`→`brand`, `body`→`text`
- `tokens:serve` is only defined on `@reva/tokens` (not the repo root) — run `cd packages/design-tokens && bun run tokens:serve` or `bun run dev:tokens` for watch + serve; the script uses Portless (`tokens.revaos`) to expose `dist/figma/` for the custom Figma plugin
- The official Figma MCP `use_figma` runtime cannot load custom fonts (e.g., Inter Tight) — workaround: create styles with default font and bind fontFamily/fontWeight/fontSize variables to override
- Figma typography and colour variables live in a team library (not local to design files) — import via `figma.variables.importVariableByKeyAsync(key)`
- `@reva/ui` is the single golden source for all components (layout + interactive) — layout patterns re-exported from Panda codegen today, but facade allows swapping implementations without consumer impact
- Docs app loads generated Panda CSS via `import './styled-system.css'` in `layout.tsx` (not CSS `@import` in `global.css`) — Turbopack/Tailwind PostCSS can't resolve relative imports to parent directories in dev mode
- Fumadocs: list pages in each section's `meta.json` or they won't appear in the sidebar; layout tabs (section switcher) use folders with `"root": true`. Icons and short descriptions in that dropdown come from root `meta.json` (`icon` as a Lucide name string, `description`) plus an `icon()` handler on `loader()` in `apps/docs/lib/source.ts`
- `@reva/ui` renamed `Divider` → `Separator` — aligns with Ark UI, Chakra v3, and WAI-ARIA; Panda's `Divider` JSX pattern is aliased internally
- Docs component pages are organised in nested category folders (`components/buttons/`, `components/layout/`) under the "Reva UI" root tab, modeled after Chakra UI
- Component docs examples pattern: `'use client'`, import from `@reva/ui`, export a `code` string + default function component; files at `apps/docs/examples/<component>/<variant>.tsx`