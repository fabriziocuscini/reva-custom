## Learned User Preferences

- Prefers simplicity over formal contracts in the design system — removed the component token layer because it was overkill for the workflow
- Comfortable with AI-assisted component implementation from Figma designs — no need for token-level specs as intermediary
- Actively maintains documentation accuracy — audits and updates CLAUDE.md, READMEs, and skill files after structural changes
- Never commit secrets to git — use environment variables or gitignored config (a Figma PAT was accidentally committed once)
- Wants `.cursor/` fully gitignored (hooks state, MCP config, workspace settings are machine-local)

## Learned Workspace Facts

- Local dev uses portless proxy: `sudo portless proxy start --https --tld local --port 443` for clean HTTPS at `*.revaos.local`
- Portless proxy runs once per boot; individual dev servers (`bun run dev:tokens`, `bun run dev:docs`) register automatically
- Style Dictionary 4.4.0 bug: `verbosity: 'silent'` causes ENOENT in `cleanFile` on missing output files — use default verbosity with `warnings: 'disabled'`
- User has multiple MacBook Pros — build failures on one machine often mean stale or missing `dist/` artifacts
- Text styles in Panda preset (`text-styles.ts`) are manually authored, not auto-generated from the token pipeline
- The `textStyles.json` source file is excluded from Style Dictionary build via `sdExclude` — renamed collections: `marketing`→`brand`, `body`→`text`
