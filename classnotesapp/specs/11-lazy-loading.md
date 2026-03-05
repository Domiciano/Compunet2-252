# SPEC-11 · Lazy Lesson Loading

## Problem

Currently `TableOfContentsParser` fetches **all** lesson files in parallel at startup. For a course with ~50 lessons this means 50 simultaneous HTTP requests before the app renders anything. Startup time is directly proportional to the number of lessons and the latency of each fetch.

```
Current boot sequence:
  fetch toc.md                          ~1 req
  fetch lesson1.md … lesson50.md        ~50 reqs in parallel
  ─────────────────────────────────────────────────
  Total before first render: 51 requests
```

## Goal

Fetch a lesson's content **only when the user navigates to it**. The sidebar must still show all lesson titles immediately after the toc is loaded.

```
Target boot sequence:
  fetch toc.md                          ~1 req
  ─────────────────────────────────────────────────
  Total before first render: 1 request

  User clicks lesson 7:
    fetch lesson7.md                    ~1 req on demand
```

---

## toc.md Syntax Extension

To display sidebar titles without fetching lesson content, the `[lesson:url]` tag is extended to support an **inline label**:

```
[lesson:url] https://…/lesson7.md | Spring Boot Setup
```

The `|` separator is **required** for production toc files. Rules:

| Syntax | Label shown in sidebar |
|---|---|
| `[lesson:url] <url> \| <label>` | `<label>` — displayed immediately, no fetch required |
| `[lesson:url] <url>` | Filename from URL (e.g. `lesson7.md`) — development fallback only |

**Rationale:** Omitting the label causes the sidebar to display a filename instead of a meaningful title. Because labels are now resolved at parse time (no post-fetch update), a missing label is permanent within the session. The professor **must** supply a label for every lesson in the production toc.

### Example toc.md with inline labels

```
[t] SEMANA 4 · Spring Boot
[lesson:url] https://raw.githubusercontent.com/…/lesson7.md | Introducción a Spring Boot
[lesson:url] https://raw.githubusercontent.com/…/lesson71.md | Configuración avanzada
```

---

## Architecture Change

### Before (SPEC-09 eager loading)

```
TableOfContentsParser
  → for each [lesson:url]: fetch URL → store rawContent in section object
  → sections array: all rawContent present at startup

LessonPage
  → reads section.rawContent (already available)
  → parses and renders
```

### After (SPEC-11 lazy loading)

```
TableOfContentsParser
  → for each [lesson:url]: record { url, label } only — NO fetch
  → sections array: rawContent is null/absent at startup

LessonContentCache (new React context)
  → Map<lessonId, rawContent>
  → shared across the app, survives navigation within the session

LessonPage
  → checks cache for lessonId
  → if hit: parse and render immediately
  → if miss: fetch url, store in cache, parse and render
  → shows skeleton while fetching
```

---

## New Component: `LessonContentCache`

**File:** `src/theme/LessonContentCache.jsx`

A React context that holds a `Map<lessonId → rawContent>` and exposes a `getOrFetch(lessonId, url)` async function.

```js
// Shape
{
  cache: Map<string, string>,         // lessonId → rawContent
  getOrFetch: (lessonId, url) => Promise<string>,
}
```

**Behavior:**
- `getOrFetch` returns the cached string if present.
- On miss: fetches `url` with `{ cache: 'no-store' }`, stores the result, returns it.
- On fetch error: stores and returns an error-content string so `LessonParser` can display a message.
- The cache lives in component state — it resets on full page reload (intentional: ensures fresh content on reload).

**Provider location:** wrap in `main.jsx` alongside `ThemeProvider` and `StudiedLessonsProvider`.

---

## `TableOfContentsParser` Changes

Remove all fetch calls. For each `[lesson:url]` line:

```js
// Parse inline label if present
const [url, inlineLabel] = line.slice(12).trim().split('|').map(s => s.trim());
const filenameLabel = url.split('/').pop(); // e.g. "lesson7.md"

sections.push({
  type: 'lesson',
  source: 'remote',
  id: String(lessonId),
  label: inlineLabel || filenameLabel,
  url,
  rawContent: null,   // loaded on demand by LessonPage
});
```

The parser becomes fully synchronous again (no `await` inside the loop).

---

## `LessonPage` Changes

Replace direct `section.rawContent` read with a call to `getOrFetch`:

```js
const { getOrFetch } = useLessonContentCache();

useEffect(() => {
  const section = lessonMap.get(lessonId);
  if (!section) { /* show not-found */ return; }

  setLoading(true);
  getOrFetch(lessonId, section.url).then(rawContent => {
    setParsedContent(LessonParser({ content: rawContent }));
    setLoading(false);
  });
}, [lessonId, lessonMap]);
```

---

## Loading State (Skeleton)

While `getOrFetch` is in flight, `LessonPage` shows a skeleton placeholder instead of the current `"Cargando contenido de la lección..."` text.

**Skeleton spec:**
- Three placeholder blocks stacked vertically, inside `LessonContainer` padding.
- Block 1 (title): `height: 48px`, `width: 60%`, rounded, pulsing opacity animation.
- Block 2 (subtitle): `height: 28px`, `width: 40%`, rounded, pulsing.
- Block 3 (paragraph): `height: 120px`, `width: 100%`, rounded, pulsing.
- Background color: `theme.backgroundLight`.
- Animation: `opacity` cycles `1 → 0.4 → 1` over `1.4s` ease-in-out, infinite.

---

## `toc.md` Label Update (Content Side)

After this spec is implemented, the professor must add labels to the remote `toc.md` on GitHub:

```
[lesson:url] https://raw.githubusercontent.com/…/lesson1.md | Protocolo HTTP
[lesson:url] https://raw.githubusercontent.com/…/lesson2.md | Servidor Web Simple
```

Without inline labels the sidebar still works — it shows the filename until the lesson is first visited — but the experience is better with labels.

---

## Why Post-Fetch Label Updates Are Not Done

An earlier design attempted to update sidebar labels after first fetch (replacing filename placeholders with the real `[t]` title). This caused an infinite re-render loop:

```
onUpdateLabel → setSections → new sections → new lessonMap →
useEffect fires → getOrFetch (cache hit) → onUpdateLabel → …
```

The correct solution is to **require inline labels** in toc.md. Since the label is present at parse time, `sections` never needs to change after initial load, and the re-render loop cannot occur.

---

## Cache Invalidation

The cache resets on full page reload. There is no TTL or manual invalidation in v1. This is intentional:

- The professor pushes new content → students reload → get fresh content.
- Within a session, already-visited lessons render instantly from cache.

---

## Files to Change

| File | Change |
|---|---|
| `src/theme/LessonContentCache.jsx` | **Create** — context + `getOrFetch` |
| `src/main.jsx` | Wrap app in `LessonContentCacheProvider` |
| `src/utils/tableOfContentsParser.js` | Remove all fetch calls; parse inline label; `rawContent: null` |
| `src/pages/LessonPage.jsx` | Use `getOrFetch` instead of `section.rawContent`; add skeleton |
| `src/content/toc.md` (local fallback) | Add `\| Label` to entries (optional, for dev) |
| `specs/02-dsl.md` | Document `[lesson:url] url \| label` syntax |
| `specs/spec-status.md` | Mark SPEC-11 as in progress / done |

---

## Acceptance Criteria

1. The app renders the sidebar after **1 network request** (toc.md only), regardless of how many lessons exist.
2. Navigating to a lesson triggers exactly **1 fetch** for that lesson's content.
3. Navigating back to an already-visited lesson renders **instantly** (from cache, no fetch).
4. A skeleton is shown while a lesson is being fetched.
5. A fetch error shows a readable error message inside the lesson area, not a crash.
6. Inline labels (`| Label`) in toc.md are displayed in the sidebar immediately without any fetch.
7. Entries without inline labels display the filename as a permanent placeholder (dev fallback). Production toc files must supply a label for every lesson.
