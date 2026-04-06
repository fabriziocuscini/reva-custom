# DecorativeBox Design Spec

Date: 2026-04-06
Status: Proposed (approved in chat), ready for implementation planning
Owner: UI system (`@reva/ui`) + docs app (`apps/docs`)

## Goal

Add a `DecorativeBox` component to `@reva/ui` for documentation examples and code snippets where a visual placeholder is needed (for example, grid and layout demos).

The component should match the existing Reva primitive patterns and be token-driven so it supports light/dark mode through semantic tokens by default.

## Scope

### In scope

- Add `DecorativeBox` as a public component in `@reva/ui`.
- Keep API minimal for v1 (no dedicated custom props).
- Style with Reva tokens:
  - radius: `xs` (4px)
  - fill: `neutral alpha a200`
  - stroke: `neutral alpha a300`
  - subtle diagonal stripe pattern using black alpha `a5` target intensity
- Add docs usage example in `apps/docs` for layout/grid placeholders.
- Wire exports from component barrel and root `@reva/ui` index.

### Out of scope

- Pattern variants, tone variants, or explicit intensity props.
- Non-doc use-case optimization.
- New token additions for this component.

## Naming Decision

Chosen public name: `DecorativeBox`.

Rationale:

- Aligns with the familiar Radix docs placeholder naming.
- Explicit enough for docs context while remaining compact.
- Avoids overloaded terms like `Slot`.

## Architecture

Implement as a single-element primitive, following existing Reva patterns:

1. Add recipe in `packages/panda-preset/src/recipes/decorative-box.ts`.
2. Add wrapper component in `packages/ui/src/components/decorative-box/index.tsx`.
3. Export from:
  - `packages/ui/src/components/decorative-box`
  - `packages/ui/src/index.ts`

Implementation approach:

- Reuse `Box` as the base primitive.
- Use Panda recipe + `styled(...)` wrapper pattern used across current single-element components.

## Component Contract (v1)

- Component: `DecorativeBox`
- Props: same baseline shape as `Box`/layout primitive props.
- No dedicated custom props in v1.
- Defaults:
  - `height: 100%` (parent controls final size)
  - decorative fill + stroke + subtle stripe pattern
- Standard consumer override path remains available via existing style/class mechanisms.

## Styling Specification

Default visual rules:

- `border-radius`: token `xs`
- `background-color`: semantic `colors.neutral.alpha.a200`
- `border`: `1px solid colors.neutral.alpha.a300`
- `background-clip`: `padding-box`
- `background-image`: diagonal stripe pattern (data URI), tuned to subtle black alpha `a5` visual intensity

Theme behavior:

- Use semantic neutral alpha tokens so light/dark mode is automatic.

## Docs Integration

- Add a docs example that demonstrates `DecorativeBox` inside layout primitives (especially `Grid`) to mirror common placeholder scenarios.
- Keep snippet concise and aligned with existing `ComponentPreview` conventions in `apps/docs`.

## Validation Plan

Run targeted checks after implementation:

- `bun run lint`
- `bun run typecheck`
- docs smoke verification for placeholder example render

Expected outcome:

- `DecorativeBox` imports cleanly from `@reva/ui`.
- Example renders in docs with expected token-based styling in light and dark modes.

## Risks and Mitigations

- Risk: Stripe appears too strong in one theme.
  - Mitigation: tune only stripe alpha value (internal style), no API changes.
- Risk: Component perceived as app-level primitive instead of docs helper.
  - Mitigation: document intended use in component docs and examples.

## Acceptance Criteria

- `DecorativeBox` is publicly exported from `@reva/ui`.
- Default style uses the specified token mapping (radius/fill/stroke).
- Docs include at least one working layout/grid placeholder example.
- Lint/typecheck/docs smoke pass for touched areas.

