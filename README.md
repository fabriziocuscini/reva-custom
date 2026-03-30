# Reva

The digital foundation for the Reva brand and product — design system, component library, and application platform. Reva is intelligent orchestration for modern wealth: financial infrastructure for growing advisory firms, delivering personalised outcomes for every client.

## Overview

This monorepo contains Reva's design system, component library, and product applications:

- **`packages/design-tokens`** (`@reva/tokens`): Platform-agnostic, multi-themeable design token system. Authored in W3C DTCG format with colours in oklch(). Transformed via Style Dictionary v4 and custom build scripts into CSS custom properties, TypeScript constants, JSON, React Native JSON, Panda CSS JSON, and a Figma variables manifest. Includes a component token layer (`src/components/`) for recipe metrics.
- **`packages/panda-preset`** (`@reva/panda-preset`): Panda CSS preset bridging design tokens into the styling system. Imports foundation and semantic tokens from `@reva/tokens`, defines light/dark mode conditions, component recipes (Button), keyframes, and text styles. Does not include `@pandacss/preset-panda`.
- **`packages/ui`** (`@reva/ui`): React component library built on Ark UI (headless) and Panda CSS (styling). Anatomy-first, fully typed, accessible by default.
- **`packages/config`** (`@reva/config`): Shared ESLint, Prettier, and TypeScript configurations.
- **`apps/docs`** (`@reva/docs`): Documentation site built with Fumadocs and Next.js.
- **`apps/reva-website`** (`@reva/website-static`): Current static marketing site (Vite + PostCSS + PostHTML). Will adopt `@reva/tokens` CSS custom properties once the token package is published.
- **`apps/advisor-portal`** (`@reva/advisor-portal`): Advisor-facing web portal (Vite + React). Scaffolded, in development.
- **`apps/client-portal`** (`@reva/client-portal`): End-client web portal, white-labelled per advisory firm (Vite + React). Scaffolded, in development.

## Tech Stack

| Layer           | Technology                          |
| --------------- | ----------------------------------- |
| Monorepo        | Turborepo                           |
| Package manager | Bun                                 |
| Components      | Ark UI + Panda CSS                  |
| Language        | TypeScript (strict)                 |
| Design tokens   | DTCG JSON (oklch) + Style Dictionary v4 |
| Package builds  | tsdown                              |
| Web framework   | React, Next.js, Vite                |
| Mobile          | React Native + Expo (future)        |
| Documentation   | Fumadocs                            |
| Testing         | Playwright                          |
| CI/CD           | GitHub Actions                      |
| Deployment      | Vercel                              |
| Versioning      | Changesets                          |

## Getting Started

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Start development
bun run dev
```

## Project Structure

```
reva/
├── apps/
│   ├── docs/                  # Documentation site
│   ├── reva-website/          # Current static marketing site
│   ├── advisor-portal/        # Advisor web portal
│   └── client-portal/         # Client web portal (white-labelled)
├── packages/
│   ├── design-tokens/         # Design token system
│   │   └── src/
│   │       ├── foundation/    # Foundation tokens (colours, spacing, radii, etc.)
│   │       ├── colorMode/     # Semantic colour tokens (light.json, dark.json)
│   │       └── components/    # Component-specific tokens (button.json, etc.)
│   ├── panda-preset/          # Panda CSS preset and recipes
│   ├── ui/                    # React component library
│   └── config/                # Shared lint, format, TS configs
└── turbo.json
```

## Current Status

The design system foundation is in place: tokens (DTCG format, three-layer architecture: foundation, semantic colour modes, component metrics), Panda CSS preset, and the docs site are functional. The UI component library currently ships Button, with more components to follow. One-way code-to-Figma variable sync is operational via a custom dev plugin. Portal apps are scaffolded as minimal placeholders. CI/CD pipelines, end-to-end testing (Playwright), and deployment configuration (Vercel) are planned but not yet set up.

## Licence

Proprietary. All rights reserved.
