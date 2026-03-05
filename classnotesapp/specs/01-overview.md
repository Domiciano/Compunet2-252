# SPEC-01 · Project Overview

## Purpose

**Compunet2 Class Notes App** is a single-page web application that delivers beautifully formatted course content to students of *Computación en Internet II* (fullstack Spring Boot + React). Content is authored in a custom tag-based DSL that compiles to themed React components.

## Guiding Principles

- Content first: every UI decision must serve reading clarity.
- Author simplicity: adding a lesson must require zero React knowledge.
- Responsive: fully usable on mobile, tablet, and desktop.
- Consistent visual identity: dark-first, green-accent brand.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| UI library | MUI v7 (Material UI) |
| Routing | React Router DOM v7 |
| Syntax highlight | PrismJS + custom grammars |
| Styling | MUI `sx` prop + global CSS |
| Deployment | GitHub Pages at `/compu2/` |
| Package manager | npm |

## Deployment URL

```
https://<org>.github.io/compu2/
```

Deep links use a `public/404.html` redirect trick: GitHub 404 appends `?p=<path>`, the app reads it and calls `navigate(deepPath, { replace: true })`.

## Repository Layout (relevant parts)

```
classnotesapp/
  src/
    content/          ← lesson MD files + toc.md
    components/
      AppBarGlobal.jsx
      drawer/         ← Layout, sections, DrawerTitle, DrawerDivider
      lesson/         ← LessonParser, LessonContainer, LessonTitle, LessonSub,
                         LessonParagraph, ImageBlock, IconBlock, Link,
                         TryCodeButton, TableOfContents
      code/           ← CodeBlock
      embed/          ← YouTubeEmbed, DartPadEmbed
      BeanVisualizer/ ← interactive Spring bean graph tool
    pages/
      LessonPage.jsx
    theme/
      colors.js           ← light / dark token objects
      ThemeContext.jsx     ← ThemeProvider, useThemeMode
      StudiedLessonsContext.jsx
    hooks/
      useContentSpy.js    ← IntersectionObserver for active TOC section
    utils/
      tableOfContentsParser.js
      lessonImporter.js
      markdownUtils.js
    prism/
      languages/      ← prism-http.js, prism-java-enhanced.js, prism-sql-enhanced.js
    styles/
      flutter-like.css    ← dark code-block theme
  specs/              ← this folder
  vite.config.js
  package.json
```

## User Roles

| Role | Interaction |
|---|---|
| Student | Reads lessons, marks lessons as studied, navigates with sidebar/TOC |
| Author (teacher) | Writes `.md` files in `src/content/`, edits `toc.md` |
| Developer | Maintains React app, adds new DSL tags or components |
