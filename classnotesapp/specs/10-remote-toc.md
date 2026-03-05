# SPEC-10 · Remote `toc.md` — Deploy Once, Update Content Forever

## Goal

Eliminate the need to rebuild and redeploy the app when course content changes. The app is deployed once to GitHub Pages. From that point, the professor manages all content (structure and lessons) by pushing files to a GitHub repository. The app fetches the latest content on every page load.

This spec completes the content decoupling started in SPEC-09 by making the **entry point** of the content pipeline — `toc.md` itself — a remote resource.

---

## The Problem With the Current Architecture

```
Build time:
  import tocContent from '@/content/toc.md?raw'   ← baked into the JS bundle
  import.meta.glob('@/content/*.md')               ← all lessons baked into bundle

Runtime:
  App starts → reads baked-in toc → renders
```

Any content change requires: edit file → `npm run build` → `git push` to deploy branch.

---

## Target Architecture

```
Build time:
  Only src/config.js is baked in. It contains the toc URL.
  No lesson .md files are bundled.

Runtime:
  App starts
    → fetch toc.md from config URL
    → parse toc (local entries use [lesson:url], remote entries too)
    → fetch all [lesson:url] files in parallel   (SPEC-09)
    → render
```

The only thing deployed is the React app shell + its config. All content lives in GitHub.

---

## Configuration File

A new file `src/content/config.js` is the **only build-time artifact** that needs to change when the content source moves. It is a plain JS module — not a `.md` file, not an env variable — so it is readable, diffable, and type-safe.

```js
// src/content/config.js

const courseConfig = {
  // URL to the remote toc.md file.
  // Change this URL to point the app at a different course without rebuilding.
  tocUrl: 'https://raw.githubusercontent.com/Domiciano/Compunet2-252/refs/heads/main/classnotesapp/src/content/toc.md',
};

export default courseConfig;
```

### Rules

- `tocUrl` must be an `https://` URL serving a plain text file in toc.md format.
- The file at `tocUrl` is fetched at runtime — it is **never** bundled.
- This is the single place that must be edited to point the app at a different course or branch.
- If `tocUrl` is empty string or absent, the app falls back to the local `toc.md` (see Fallback section).

---

## Boot Sequence (Updated)

```
1. App mounts (App.jsx useEffect)
2. Read tocUrl from courseConfig
3. fetch(tocUrl)
   ├─ success → rawTocContent = response.text()
   └─ failure → rawTocContent = fallback local toc (or error state)
4. TableOfContentsParser(rawTocContent)
   ├─ [lesson] entries → resolved via allLessonRawContents (build-time, may be empty)
   └─ [lesson:url] entries → fetch each URL in parallel (SPEC-09)
5. All fetches complete → sections array is ready
6. App renders normally
```

The existing "Cargando contenido del curso…" spinner already covers steps 3–5. No new loading UI is needed.

---

## `App.jsx` Changes

### Before

```js
import tocContent from '@/content/toc.md?raw';   // build-time import

useEffect(() => {
  const parsedSections = await TableOfContentsParser(tocContent);
  setSections(parsedSections);
}, []);
```

### After

```js
import courseConfig from '@/content/config.js';  // build-time config only

useEffect(() => {
  const response = await fetch(courseConfig.tocUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const rawToc = await response.text();
  const parsedSections = await TableOfContentsParser(rawToc);
  setSections(parsedSections);
}, []);
```

The `import tocContent from '@/content/toc.md?raw'` line is removed entirely. The `vite-plugin-string` plugin may still be needed for any remaining local `.md` imports but is no longer required for the toc.

---

## Fallback Behavior

If the remote `toc.md` fetch fails (network error, 404, CORS issue):

| Scenario | Behavior |
|---|---|
| Fetch throws / non-200 | Show full-page error: "No se pudo cargar el contenido del curso. Verifica tu conexión." — **no crash** |
| `tocUrl` is empty string | Skip remote fetch; use local `import '@/content/toc.md?raw'` as fallback |
| Partial fetch (body truncated) | Parser produces whatever sections it could parse; remaining lessons silently absent |

The empty-string fallback preserves the ability to run the app in fully-local mode during development (`npm run dev`) without needing a live GitHub URL.

---

## `toc.md` Format on GitHub

Once this spec is implemented, the `toc.md` file on GitHub **must use `[lesson:url]` for all lessons** (SPEC-09), since the build-time `allLessonRawContents` glob will no longer contain any lesson files (they won't be in the bundle).

Example of the remote `toc.md`:

```
[t] Curso
[lesson:url] https://raw.githubusercontent.com/Domiciano/Compunet2-252/refs/heads/main/classnotesapp/src/content/lesson0.md

[t] SEMANA 1 · Protocolo HTTP y servidores
[lesson:url] https://raw.githubusercontent.com/Domiciano/Compunet2-252/refs/heads/main/classnotesapp/src/content/lesson1.md
[lesson:url] https://raw.githubusercontent.com/Domiciano/Compunet2-252/refs/heads/main/classnotesapp/src/content/lesson2.md
```

The `[lesson]` (local) tag remains supported for development and testing with local files.

---

## Content Update Workflow (After Implementation)

```
Professor wants to add or edit a lesson:

1. Edit or create the lesson .md file in the GitHub repository.
2. git push to main (or the configured branch).
3. Done. Students reload the app and see the new content.

No npm, no build, no deploy needed.
```

To restructure the course (add weeks, reorder lessons):

```
1. Edit toc.md in the GitHub repository.
2. git push.
3. Done.
```

---

## Development Workflow (Local)

When running `npm run dev`, the app will still attempt to `fetch(tocUrl)` from GitHub. This requires an internet connection. For fully offline development:

- Set `tocUrl: ''` in `config.js` temporarily to use the local fallback.
- Or keep a local `toc.md` with `[lesson]` (local) entries — the bundle includes those.

---

## CORS

`https://raw.githubusercontent.com/` serves `Access-Control-Allow-Origin: *`. No proxy needed. Other hosting targets must also be CORS-permissive.

---

## Dependency on SPEC-09

This spec requires SPEC-09 (`[lesson:url]` tag) to be implemented first, or simultaneously. A `toc.md` fetched remotely that still uses `[lesson]` (local) entries will produce "lección no encontrada" errors for all lessons, since the bundle no longer contains lesson files.

**Implementation order:**
1. SPEC-09 — `[lesson:url]` support in `TableOfContentsParser` and `LessonPage`
2. SPEC-10 — remote `toc.md` via `config.js`

---

## Files to Change

| File | Change |
|---|---|
| `src/content/config.js` | **Create** — contains `tocUrl` |
| `src/App.jsx` | Replace static `import tocContent` with `fetch(courseConfig.tocUrl)` |
| `src/content/toc.md` (GitHub) | Migrate all `[lesson]` entries to `[lesson:url]` |
| `vite.config.js` | No change required |
| `specs/02-dsl.md` | Document that `[lesson]` is now dev-only; `[lesson:url]` is production default |
| `specs/06-content-management.md` | Update content update workflow section |

---

## Acceptance Criteria

1. Deploying the app once and then changing `toc.md` on GitHub causes students to see the updated structure on the next page load (no rebuild).
2. Adding a new lesson `.md` file on GitHub and referencing it in the remote `toc.md` makes it appear in the sidebar without rebuilding.
3. A network failure when fetching `toc.md` shows a user-readable error message, not a blank page or crash.
4. Setting `tocUrl: ''` in `config.js` makes the app work with the local `toc.md` (development mode).
5. All previously working local lessons continue to work during the migration period.
