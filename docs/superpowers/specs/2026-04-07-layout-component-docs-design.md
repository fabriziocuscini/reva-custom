# Layout Component Documentation

## Summary

Document all layout components from `@reva/ui` in the docs site, organised under a "Layout" section with nested folders. Six priority components get full pages with live previews; the remaining eleven get placeholder pages. Also renames the `Divider` component to `Separator` across the library.

## Scope

Two workstreams:

1. **Library change**: Rename `Divider` → `Separator` in `@reva/ui`
2. **Docs restructure + content**: Reorganise docs into nested category folders, author 6 priority pages, create 11 placeholder pages

## 1. Library change: Divider → Separator

Rename the component to align with Ark UI, Chakra v3, and WAI-ARIA conventions.

- Rename `packages/ui/src/components/divider/` → `packages/ui/src/components/separator/`
- Rename exports in `packages/ui/src/index.ts`: `Separator`, `SeparatorProps` (remove `Divider`, `DividerProps`)
- Update `Stack` component — imports `Divider` internally for the `separator` prop; update to use renamed component
- No recipe needed — plain Panda JSX re-export, only the name changes
- Update any docs prose that references `Divider` (e.g. `decorative-box.mdx` — being removed anyway)

## 2. Docs restructure: nested category folders

### New folder structure

```
content/docs/components/
├── meta.json              # pages: ["index", "buttons", "layout"]
├── index.mdx              # existing Overview page (unchanged)
├── buttons/
│   ├── meta.json          # title: "Buttons", pages: ["button"]
│   └── button.mdx         # moved from components/button.mdx
└── layout/
    ├── meta.json
    ├── box.mdx            # priority
    ├── container.mdx      # priority
    ├── flex.mdx           # priority
    ├── grid.mdx           # priority (includes GridItem)
    ├── spacer.mdx         # priority
    ├── stack.mdx          # priority (includes HStack, VStack)
    ├── separator.mdx      # placeholder
    ├── absolute-center.mdx # placeholder
    ├── aspect-ratio.mdx   # placeholder
    ├── bleed.mdx          # placeholder
    ├── center.mdx         # placeholder
    ├── circle.mdx         # placeholder
    ├── float.mdx          # placeholder
    ├── link-overlay.mdx   # placeholder
    ├── square.mdx         # placeholder
    ├── visually-hidden.mdx # placeholder
    └── wrap.mdx           # placeholder
```

### Root components/meta.json

```json
{
  "title": "Reva UI",
  "description": "The component library",
  "icon": "LayoutGrid",
  "root": true,
  "pages": ["index", "buttons", "layout"]
}
```

### layout/meta.json

Priority pages first, then a visual separator, then placeholders alphabetically:

```json
{
  "title": "Layout",
  "pages": [
    "box", "container", "flex", "grid", "spacer", "stack",
    "---",
    "absolute-center", "aspect-ratio", "bleed", "center",
    "circle", "float", "link-overlay", "separator", "square",
    "visually-hidden", "wrap"
  ]
}
```

### buttons/meta.json

```json
{
  "title": "Buttons",
  "pages": ["button"]
}
```

### Files removed

- `content/docs/components/decorative-box.mdx` — docs-only utility, no longer documented
- `apps/docs/examples/decorative-box/` — associated example files

### Files moved

- `content/docs/components/button.mdx` → `content/docs/components/buttons/button.mdx`

## 3. Priority component pages

### Approach

Lightweight-first (Approach B): each page gets a default preview, usage section, 2–3 key examples with `ComponentPreview`, and a basic props table. Richer examples added in a later pass.

### Content per page

Each page follows the established pattern from `button.mdx`:

- **Frontmatter**: `title` + `description`
- **Default `<ComponentPreview>`**: hero example
- `**## Usage**`: import line from `@reva/ui`
- `**## Examples**`: 2–3 `###` subsections, each with `<ComponentPreview>`
- `**## Props**`: markdown table (Prop, Type, Default, Description)

### Example files

Live at `apps/docs/examples/<component>/` with the existing pattern: each file exports a default React component for the preview and a `code` string for the Code tab.

### Per-component plan

#### Box

- **Description**: The most fundamental layout building block. Renders a `div` with Panda CSS style props.
- **Default**: Box with padding and background colour
- **Examples**: `as` polymorphism (render as different element), style props demo (margin, padding, colour, border)
- **Props**: Standard Panda CSS style props (all CSS properties via style props)

#### Container

- **Description**: Constrains content to a max-width and centres it horizontally.
- **Default**: Centred content block
- **Examples**: Max-width sizes (`sm`–`8xl`), `centerContent` prop for vertical + horizontal centering
- **Props**: `maxW` (token key or CSS value), `centerContent` (boolean)

#### Flex

- **Description**: A `Box` with `display: flex`. Shorthand for flexbox layouts.
- **Default**: Row of items
- **Examples**: Direction (row/column), align/justify combinations, responsive direction change
- **Props**: `direction`, `align`, `justify`, `wrap`, `gap` + standard style props

#### Grid

- **Description**: A `Box` with `display: grid`. Includes `GridItem` for spanning.
- **Default**: 3-column grid
- **Examples**: Template columns, GridItem spanning (colSpan/rowSpan), responsive column count
- **Props**: Grid: `columns`, `gap`, `templateColumns`, `templateRows`. GridItem: `colSpan`, `rowSpan`, `colStart`, `colEnd`

#### Spacer

- **Description**: Creates flexible space between flex items. Expands to fill available space.
- **Default**: Spacer pushing items apart in a Flex row
- **Examples**: In horizontal flex, in vertical flex
- **Props**: Standard style props only (no component-specific props)

#### Stack

- **Description**: Arranges children in a vertical or horizontal stack with consistent spacing. Includes `HStack` and `VStack` shorthand variants.
- **Default**: Vertical stack of items
- **Examples**: HStack/VStack variants, custom gap sizing, Stack with separator
- **Props**: `direction`, `gap`, `separator` (boolean or element), `align`, `justify`

## 4. Placeholder pages

Each deferred component gets a minimal MDX page with frontmatter (`title`, `description`) and a short message indicating docs are coming soon, with a link to the Panda CSS pattern docs for reference.

**11 placeholder pages**: AbsoluteCenter, AspectRatio, Bleed, Center, Circle, Float, LinkOverlay, Separator, Square, VisuallyHidden, Wrap.

No `ComponentPreview`, no example files, no props tables.

## Out of scope

- **DecorativeBox**: docs-only utility, removed from docs
- **Cq**: utility component, documented later
- **SimpleGrid, ScrollArea, Splitter, Group**: not in `@reva/ui` — future additions
- **Rich examples / advanced patterns**: second pass after initial pages ship
- **Prop types auto-generation**: manual tables for now

