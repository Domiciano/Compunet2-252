# SPEC-09 · Remote Lesson Loading

## Goal

Allow `toc.md` to reference lesson files that are hosted at a remote URL (e.g. a raw GitHub file) instead of — or in addition to — the local `src/content/` folder. This decouples content updates from app deployments: new lesson files can be pushed to a GitHub repository and consumed immediately without rebuilding the app.

---

## Motivation

Currently all lesson `.md` files must live inside `src/content/`, which means every content update requires a Vite rebuild and a new GitHub Pages deployment. By supporting remote URLs in `toc.md`, the teacher can:

1. Upload a new lesson `.md` file to a GitHub repository (or any static host).
2. Add a single line to `toc.md` pointing to its raw URL.
3. Students get the updated content on the next page load — no rebuild.

---

## `toc.md` Syntax Extension

Two entry modes will coexist:

| Mode | Syntax | Description |
|---|---|---|
| Local (existing) | `[lesson] lessonNN.md` | File resolved from `src/content/` at build time |
| Remote (new) | `[lesson:url] https://...` | File fetched at runtime from the given URL |

### Examples

```
[t] SEMANA 1 · Protocolo HTTP
[lesson] lesson1.md
[lesson] lesson2.md

[t] SEMANA 5 · Spring Data
[lesson:url] https://raw.githubusercontent.com/user/repo/main/lesson8.md
[lesson:url] https://raw.githubusercontent.com/user/repo/main/lesson11.md
```

### Rules

- The full URL must be on the same line as the tag.
- The URL must be an `https://` address.
- Local and remote entries can be mixed freely within the same `toc.md`.
- A remote entry is identified during parsing by the `[lesson:url]` prefix; anything else is treated as local.
- Lines starting with `**` disable the entry regardless of mode.

---

## `TableOfContentsParser` Changes

`src/utils/tableOfContentsParser.js` must be updated to handle the new tag.

### Current flow (local only)

```
parse toc.md line
  → if [lesson] → look up in allLessonRawContents (build-time glob)
  → push section with rawContent inline
```

### New flow (local + remote)

```
parse toc.md line
  → if [lesson]      → same as today (build-time, synchronous)
  → if [lesson:url]  → record { type: 'lesson', source: 'remote', url }
                        fetch at load time (async)
```

The parser already runs inside an `async` function (`TableOfContentsParser`). Remote entries add `fetch` calls to the same async context.

### Section object shape (extended)

```js
// Local lesson (unchanged)
{
  type: 'lesson',
  source: 'local',         // new field, default for existing entries
  id: '7',
  label: 'Spring Data JPA',
  filePath: 'lesson8.md',
}

// Remote lesson (new)
{
  type: 'lesson',
  source: 'remote',        // new field
  id: '8',
  label: 'Spring Data Queries',   // extracted from fetched content
  url: 'https://raw.githubusercontent.com/...',
  rawContent: '<fetched string>',  // stored after fetch
}
```

---

## `LessonPage` / `lessonImporter` Changes

Currently `LessonPage` looks up `allLessonRawContents[filePath]` (a build-time map). Remote lessons bypass this map entirely — their `rawContent` is already stored in the section object after the fetch in `TableOfContentsParser`.

`LessonPage` must be updated:

```js
// Before (local only)
const rawContent = allLessonRawContents[filePath];

// After (local + remote)
const section = lessonMap.get(lessonId); // section object
const rawContent = section.source === 'remote'
  ? section.rawContent
  : allLessonRawContents[section.filePath];
```

`lessonMap` must be keyed by lesson ID and store the full section object (not just `filePath`).

---

## Loading Strategy

### Fetch timing

All remote lesson fetches happen inside `TableOfContentsParser`, which is called once at app startup (inside the `useEffect` in `App.jsx`). This means:

- All remote content is fetched in parallel at load time.
- The existing loading spinner ("Cargando contenido del curso…") covers the fetch duration.
- No lazy loading per lesson — all content is available once the app is ready.

### Fetch implementation

```js
// Inside TableOfContentsParser, when [lesson:url] is encountered:
const response = await fetch(url);
if (!response.ok) {
  // Push an error-state section
  sections.push({
    type: 'lesson', source: 'remote', id: String(lessonId),
    label: `Error cargando lección (${url})`,
    url, rawContent: `[t] Error\nNo se pudo cargar la lección desde ${url}.`,
  });
  continue;
}
const rawContent = await response.text();
const lessonLabel = getFirstTitleFromMarkdown(rawContent);
sections.push({
  type: 'lesson', source: 'remote', id: String(lessonId),
  label: lessonLabel || `Lección ${lessonId} (sin título)`,
  url, rawContent,
});
```

### Error handling

- Network failure or non-200 response: push an error-state section with a user-visible error message in the lesson content area (uses existing error path in `LessonPage`).
- Timeout: no explicit timeout in v1; browser default applies.

---

## CORS Requirements

GitHub raw file URLs (`https://raw.githubusercontent.com/...`) return `Access-Control-Allow-Origin: *`, so no CORS proxy is needed. Other hosts must also serve CORS-permissive headers. This is a deployment constraint, not an app constraint.

---

## Images in Remote Lessons

A remote lesson file cannot reference images by filename (e.g. `[i] image1.png`) because those are build-time assets in `src/assets/`. Remote lessons **must** use absolute `https://` URLs for all images and icons:

```
[i] https://raw.githubusercontent.com/user/repo/main/images/diagram.png | Diagrama
[icon] https://raw.githubusercontent.com/user/repo/main/images/logo.png | Logo
```

This is already supported by `LessonParser` (the `isWebImage` check exists today).

---

## `toc.md` itself as a Remote Resource (Future / Out of Scope v1)

A natural extension would be to allow `toc.md` itself to be fetched from a URL, making the entire content system fully remote. This is **not** in scope for v1. In v1, `toc.md` remains a build-time local file imported via `import tocContent from '@/content/toc.md?raw'`.

---

## Acceptance Criteria

1. A `[lesson:url]` line in `toc.md` causes the lesson to appear in the sidebar with its correct title.
2. Navigating to a remote lesson renders its content identically to a local lesson.
3. A network error for a remote lesson shows a readable error message in the lesson area (not a crash).
4. Local lessons are unaffected by this change.
5. The loading spinner remains visible until all remote fetches complete.
6. Images in remote lessons using `https://` URLs render correctly.

---

## Files to Change

| File | Change |
|---|---|
| `src/utils/tableOfContentsParser.js` | Handle `[lesson:url]` tag; fetch and store `rawContent` |
| `src/pages/LessonPage.jsx` | Read `rawContent` from section object for remote lessons |
| `src/utils/lessonImporter.js` | No change needed |
| `src/content/toc.md` | Author adds `[lesson:url]` entries as needed |
| `specs/02-dsl.md` | Update toc.md tag table |
| `specs/06-content-management.md` | Document remote lesson workflow |
