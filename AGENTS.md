## Learned User Preferences

- Prefers simplicity over formal contracts in the design system — removed the component token layer because it was overkill for the workflow
- Comfortable with AI-assisted component implementation from Figma designs — no need for token-level specs as intermediary
- Actively maintains documentation accuracy — audits and updates CLAUDE.md, READMEs, and skill files after structural changes
- Never commit secrets to git — use environment variables or gitignored config (a Figma PAT was accidentally committed once)
- Wants `.cursor/` fully gitignored (hooks state, MCP config, workspace settings are machine-local)
- In Figma, prefers variable bindings over hardcoded values for reusable design properties (font family, weight, size) — only hardcode line height and letter spacing
- Prefers component recipes co-located with component definitions — single place to go when creating or modifying a component (implemented: `@reva/panda-preset` merged into `@reva/ui`)
- Prefers Fumadocs shared `apps/docs/lib/layout.shared.tsx` with `baseOptions()` for nav (logo, GitHub, links) so docs layouts stay consistent and easy to extend
- Reva components use solid, subtle, outline style variants only — no `surface` variant (unlike Park UI/Chakra)
- Uses Park UI component recipes as blueprints for Reva recipe styling
- Prefers explicit icon props (`iconStart`/`iconEnd`) over children-based icon API, mirroring Figma component properties

## Learned Workspace Facts

- Local dev uses portless proxy: `sudo portless proxy start --https --tld local --port 443` for clean HTTPS at `*.revaos.local`; runs once per boot, individual dev servers register automatically; loading `@reva/docs` at `docs.revaos.local` needs `allowedDevOrigins: ['docs.revaos.local']` in `apps/docs/next.config.mjs` (Next.js 16)
- Style Dictionary 4.4.0 bug: `verbosity: 'silent'` causes ENOENT in `cleanFile` on missing output files — use default verbosity with `warnings: 'disabled'`
- `@reva/panda-preset` has been merged into `@reva/ui` — preset, theme files, and recipes live under `packages/ui/src/theme/` and `packages/ui/src/components/*/recipe.ts`; consumers import via `@reva/ui/preset`
- Text styles in the Panda preset (`packages/ui/src/theme/text-styles.ts`) are manually authored; `textStyles.json` source excluded from Style Dictionary build via `sdExclude` — renamed collections: `marketing`→`brand`, `body`→`text`
- `tokens:serve` is only defined on `@reva/tokens` (not the repo root) — run `cd packages/design-tokens && bun run tokens:serve` or `bun run dev:tokens` for watch + serve; the script uses Portless (`tokens.revaos`) to expose `dist/figma/` for the custom Figma plugin
- The official Figma MCP `use_figma` runtime cannot load custom fonts (e.g., Inter Tight) — workaround: create styles with default font and bind fontFamily/fontWeight/fontSize variables to override
- `@reva/ui` is the single golden source for all components (layout + interactive) — layout patterns re-exported from Panda codegen today, but facade allows swapping implementations without consumer impact
- Docs app loads generated Panda CSS via `import './styled-system.css'` in `layout.tsx` (not CSS `@import` in `global.css`) — Turbopack/Tailwind PostCSS can't resolve relative imports to parent directories in dev mode
- Fumadocs: list pages in each section's `meta.json` or they won't appear in the sidebar; layout tabs use folders with `"root": true`; icons and descriptions come from root `meta.json` plus `icon()` handler on `loader()` in `apps/docs/lib/source.ts`
- `@reva/ui` renamed `Divider` → `Separator` — aligns with Ark UI, Chakra v3, and WAI-ARIA; Panda's `Divider` JSX pattern is aliased internally
- Docs component pages in nested category folders (`components/buttons/`, `components/layout/`, `components/data-display/`) under "Reva UI" root tab; examples pattern: `'use client'`, import from `@reva/ui`, export `code` string + default function component at `apps/docs/examples/<component>/<variant>.tsx`
- Fumadocs `global.css` uses `fumadocs-ui/css/neutral.css` preset with `--color-fd-primary` overridden to gold.600 (light) / gold.500 (dark)
- GitHub repo renamed from `reva` to `reva-custom` — remote is `https://github.com/fabriziocuscini/reva-custom.git`; local folder remains `reva/`
- Figma UI Kit file key is `KziMxmqVYKmMnMpAOhBLql`; variable collections: "Foundation" (571 vars, 1 mode) and "Color mode" (214 vars, light/dark modes)
- Figma component variant naming convention uses Title Case: `Variant=solid, Color=accent, Size=xs, Disabled=true`
- Built-in conditions (`_icon`, `_hover`, `_focus`, etc.) come from `@pandacss/preset-base` — Reva's `conditions.ts` only defines `light`/`dark` colour-mode conditions