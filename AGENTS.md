## Learned User Preferences

- Prefers simplicity over formal contracts in the design system — removed the component token layer because it was overkill for the workflow
- Comfortable with AI-assisted component implementation from Figma designs — no need for token-level specs as intermediary
- Actively maintains documentation accuracy — audits and updates CLAUDE.md, READMEs, and skill files after structural changes
- Never commit secrets to git — use environment variables or gitignored config (a Figma PAT was accidentally committed once)
- Wants `.cursor/` fully gitignored (hooks state, MCP config, workspace settings are machine-local)
- In Figma, prefers variable bindings over hardcoded values for reusable design properties (font family, weight, size) — only hardcode line height and letter spacing

## Learned Workspace Facts

- Local dev uses portless proxy: `sudo portless proxy start --https --tld local --port 443` for clean HTTPS at `*.revaos.local`
- Portless proxy runs once per boot; individual dev servers (`bun run dev:tokens`, `bun run dev:docs`) register automatically
- Style Dictionary 4.4.0 bug: `verbosity: 'silent'` causes ENOENT in `cleanFile` on missing output files — use default verbosity with `warnings: 'disabled'`
- User has multiple MacBook Pros — build failures on one machine often mean stale or missing `dist/` artifacts
- Text styles in Panda preset (`text-styles.ts`) are manually authored, not auto-generated from the token pipeline
- The `textStyles.json` source file is excluded from Style Dictionary build via `sdExclude` — renamed collections: `marketing`→`brand`, `body`→`text`
- `tokens:serve` is only defined on `@reva/tokens` (not the repo root) — run `cd packages/design-tokens && bun run tokens:serve` or `bun run dev:tokens` for watch + serve; the script uses Portless (`tokens.revaos`) to expose `dist/figma/` for the custom Figma plugin
- The official Figma MCP `use_figma` runtime cannot load custom fonts (e.g., Inter Tight) — workaround: create styles with default font and bind fontFamily/fontWeight/fontSize variables to override
- Figma typography and colour variables live in a team library (not local to design files) — import via `figma.variables.importVariableByKeyAsync(key)`
- `@reva/ui` is the single golden source for all components (layout + interactive) — layout patterns re-exported from Panda codegen today, but facade allows swapping implementations without consumer impact
- Docs app loads generated Panda CSS via `import './styled-system.css'` in `layout.tsx` (not CSS `@import` in `global.css`) — Turbopack/Tailwind PostCSS can't resolve relative imports to parent directories in dev mode
- Fumadocs sidebar navigation requires explicit entries in `content/docs/{section}/meta.json` — new docs pages won't appear in the sidebar menu without updating this file