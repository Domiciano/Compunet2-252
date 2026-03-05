# Spec Suite · Compunet2 Class Notes App

This folder contains the full SDD (Spec Driven Development) specification for the app.
Each spec file is self-contained. Edit specs before implementing changes.

## Files

| File | Contents |
|---|---|
| [01-overview.md](./01-overview.md) | Project purpose, tech stack, repo layout, user roles |
| [02-dsl.md](./02-dsl.md) | Complete reference for the custom lesson DSL (all tags) |
| [03-layout.md](./03-layout.md) | Page layout, breakpoints, responsive behavior, scroll |
| [04-design-system.md](./04-design-system.md) | Color tokens (dark/light), typography scale, spacing, shadows, border-radius |
| [05-components.md](./05-components.md) | Per-component specs: props, visual dimensions, behavior |
| [06-content-management.md](./06-content-management.md) | Content folder structure, toc.md format, adding lessons, asset management |
| [07-bean-visualizer.md](./07-bean-visualizer.md) | BeanVisualizer canvas tool: layout, parsing, validation, state |
| [08-known-issues.md](./08-known-issues.md) | Current bugs, gaps, and inconsistencies — input for roadmap |
| [09-remote-lessons.md](./09-remote-lessons.md) | Spec for loading lessons from remote URLs (GitHub raw files) via `[lesson:url]` in `toc.md` |
| [10-remote-toc.md](./10-remote-toc.md) | Spec for fetching `toc.md` itself from a URL via `src/content/config.js` — deploy once, update content forever |

## How to Use These Specs

**Before changing the app:**
1. Identify which spec files are affected.
2. Update the spec first (spec change = design decision documented).
3. Implement the change to match the updated spec.
4. If the change reveals a new issue, add it to `08-known-issues.md`.

**When adding a new DSL tag:**
1. Document the tag in `02-dsl.md`.
2. Document the new component in `05-components.md`.
3. Then implement.

**When changing layout or visual design:**
1. Update `03-layout.md` and/or `04-design-system.md` first.
2. Then update the component code.
