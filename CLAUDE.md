# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a course repository for **Computación en Red 2 (Compunet2)**. It contains:
- `classnotesapp/` — A React + Vite SPA that renders the course notes as a navigable lesson viewer
- `Notas de clase/` — Raw markdown notes organized by session (S01–S32)
- `Images/` — Images referenced in notes

## classnotesapp Commands

All commands run from `classnotesapp/`:

```bash
npm run dev       # Start dev server (Vite, hot reload)
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # ESLint
npm run test      # Vitest (run all tests)
npx vitest run <file>  # Run a single test file
```

## Architecture

### Content Pipeline

Lessons are authored as custom-tagged Markdown files in `src/content/`. The app **does not use standard Markdown** — it uses a custom DSL parsed line-by-line by `LessonParser.jsx`.

**Flow:**
1. `src/content/toc.md` — defines the sidebar structure and lesson order using `[t]` (title), `[d]` (divider), and `[lesson] filename.md` directives
2. `TableOfContentsParser` (`src/utils/tableOfContentsParser.js`) reads `toc.md` and builds a `sections` array
3. `lessonImporter.js` eagerly imports all `src/content/*.md` files as raw strings via `import.meta.glob`
4. `LessonPage.jsx` looks up the lesson file by ID, passes raw content to `LessonParser`
5. `LessonParser.jsx` converts the DSL into React components

### Custom Lesson DSL Tags

| Tag | Purpose |
|-----|---------|
| `[t] Title` | Main lesson title (`LessonTitle`) |
| `[st] Subtitle` | Section subtitle (`LessonSub`), also populates Table of Contents |
| `[code:lang]` ... `[endcode]` | Syntax-highlighted code block (PrismJS) |
| `[v] videoId \| title` | YouTube embed |
| `[i] imageName.png \| alt` | Image from `src/assets/` or a URL |
| `[icon] imageName.png \| alt` | Small icon |
| `[link] displayname url` or `[link] (display text) url` | Styled link |
| `[dartpad] gistId` | DartPad embed |
| `[trycode] gistId` | "Try Code" button paired with preceding code block |
| `[list]` ... `[endlist]` | Bulleted list |
| `[beansim]` ... `[endbeansim]` | Interactive Spring Bean Visualizer |
| Inline `` `code` `` | Inline code |
| Inline `[link]` | Link within a paragraph |

### Adding a New Lesson

1. Create `src/content/lessonXX.md` using the DSL tags above
2. Add `[lesson] lessonXX.md` to the appropriate section in `src/content/toc.md`
3. If the lesson uses images, place them in `src/assets/` and reference by filename (without path)

### BeanVisualizer

Located in `src/components/BeanVisualizer/`. It is an interactive canvas tool that parses Java Spring bean annotations or XML bean definitions and renders a dependency graph. It uses `src/components/BeanVisualizer/regex/` modules for detection and `src/components/BeanVisualizer/model/buildBeanGraph.js` to produce the graph model.

### Routing

Routes are `/{base}/lesson/:lessonId` where `lessonId` is a sequential integer assigned by `TableOfContentsParser`. The app is deployed at base path `/compu2/` (configured in `vite.config.js`). Deep-link support for GitHub Pages is handled via `public/404.html` and a `?p=` query parameter redirect in `App.jsx`.

### Theme

`ThemeContext.jsx` provides a dark/light theme toggle. Custom color tokens are in `src/theme/colors.js`. The default mode is `dark`.

### Path Alias

`@/` maps to `src/` (configured in `vite.config.js`).
