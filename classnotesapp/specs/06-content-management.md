# SPEC-06 · Content Management

## Content Folder

All lesson content lives in `src/content/`. This folder is the only place an author needs to touch.

```
src/content/
  toc.md              ← navigation structure (required)
  lesson0.md          ← intro / welcome
  lesson0A.md
  lesson1.md          ← SEMANA 1 starts here
  lesson2.md
  ...
  lesson107.md
```

Lesson files can use any name, but the convention is `lesson<N>.md`. The numeric suffix does not imply order — order is solely determined by `toc.md`.

---

## Table of Contents File (`toc.md`)

`toc.md` defines what appears in the sidebar and in what order. Parsed by `TableOfContentsParser`.

### Syntax

```
[t] Section Heading
[lesson] lessonXX.md
[d]
**[lesson] ignoredLesson.md
```

| Token | Result |
|---|---|
| `[t] <text>` | Non-clickable section heading in sidebar |
| `[lesson] <file>` | Clickable lesson entry |
| `[d]` | Visual divider (currently renders nothing visible — renders `null`) |
| `**` prefix | Line is skipped (comment/disabled entry) |

### Lesson ID Assignment

IDs are assigned by counting `[lesson]` entries in order from top to bottom, starting at `1`. The ID is stable only if `toc.md` entries above it do not change. If you insert a lesson before existing ones, all subsequent IDs shift — **this will break bookmarked URLs**.

### Current Course Structure (`toc.md` as of latest commit)

| Week | Lessons | Topics |
|---|---|---|
| Intro | lesson0, lesson0A | Welcome / intro |
| Semana 1 | lesson1–3 | HTTP protocol, web servers |
| Semana 2 | lesson4, lesson41, lesson5 | Application servers |
| Semana 3 | lesson55, lesson6, lesson9, lesson10 | Spring Framework, Bean Wiring |
| Semana 4 | lesson7, lesson71 | Spring Boot |
| Semana 5 | lesson8, lesson11 | Spring Data |
| Semana 6 | lesson14, lesson13, lesson16, lesson12 | Spring Data continued |
| Semana 7 | lesson15, lesson17, lesson18 | Spring Data / tests |
| Semana 8 | lesson19, lesson20 | Spring MVC / Thymeleaf |
| Semana 9 | lesson21, lesson22, lesson23 | Spring MVC continued |
| Semana 10 | lesson24, lesson25, lesson26 | Spring Security |
| Semana 11 | lesson27, lesson28 | REST APIs |
| Semana 12 | lesson29, lesson30 | REST continued |
| Semana 13 | lesson31 | API testing |
| Semana 14 | lesson32–36 | React |
| Semana 15 | lesson37–39, lesson102, lesson103 | React Hooks |
| Semana 16 | lesson106, lesson107 | Deploy |
| Extras | lesson104, lesson105 | Additional topics |

---

## Lesson File Format

A well-formed lesson file looks like:

```
[t] Título de la Lección

[st] Primera Sección

Texto del párrafo con `código inline` y [link] (nombre) https://url.com

[code:java]
public class Ejemplo {
    public static void main(String[] args) {}
}
[endcode]

[st] Segunda Sección

[v] dQw4w9WgXcQ | Video explicativo

[i] image1.png | Diagrama de arquitectura

[list]
Primer punto
Segundo punto con `código`
[endlist]
```

### Authoring Rules

1. Tags must be on their own line, trimmed.
2. Inline tags (`\`code\``, `[link]`) can appear anywhere in a text line.
3. Lines that don't start with a known tag are rendered as plain text + `<br />`.
4. Blank lines produce a `<br />` spacer.
5. Code content between `[code:lang]` and `[endcode]` is verbatim — indentation is preserved.
6. Image names are filenames only (e.g. `image1.png`), not paths. The file must exist in `src/assets/`.
7. For images hosted externally, use the full `https://` URL as the image name.

---

## Asset Management

All images referenced from lessons must be placed in `src/assets/`. The file `src/assets/index.js` exports all `*.png`, `*.jpg`, `*.jpeg`, `*.svg` files as a dictionary keyed by filename.

When a new image is added to `src/assets/`, it is automatically available to `[i]` and `[icon]` tags without any code change.

---

## Progress Tracking (Studied Lessons)

Implemented via `StudiedLessonsContext`:
- State is persisted to `localStorage` under the key `studiedLessons` as a JSON array of lesson ID strings.
- Synced across tabs via the `storage` event.
- Toggle is accessible from the Nav Drawer (checkmark icon per lesson) and from the TOC header (check-circle icon).

---

## Routing and Deep Links

- URL pattern: `/compu2/lesson/<lessonId>`
- `lessonId` is the sequential integer from `TableOfContentsParser`.
- GitHub Pages 404 redirect: `public/404.html` captures the path and redirects to `/?p=<path>`. `App.jsx` reads the `p` query param and calls `navigate(deepPath, { replace: true })`.
- URL hash: updated live by `useContentSpy` to `#<subtitle-slug>` as the user scrolls. Clicking a TOC item sets the hash too.

---

## Adding a New Lesson (Step-by-Step)

1. Create `src/content/lessonNN.md` using DSL tags (see SPEC-02).
2. Add any images to `src/assets/`.
3. Open `src/content/toc.md` and add `[lesson] lessonNN.md` under the correct week heading.
4. Run `npm run dev` to preview.
5. Run `npm run build` to produce the production bundle.

No code changes are needed for a standard lesson.

---

## `upload-gists.js`

`classnotesapp/upload-gists.js` is a Node.js utility script that uploads code blocks to GitHub Gist for use with `[dartpad]` and `[trycode]` tags. It is not part of the Vite build and must be run manually.
