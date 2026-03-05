# SPEC-02 · Custom Lesson DSL

## What It Is

Lessons are plain `.md` files that **do not use standard Markdown**. They use a proprietary line-based tag language parsed by `LessonParser.jsx`. Each line is examined top-to-bottom; unrecognised lines are rendered as raw text with a trailing `<br />`.

The parser lives entirely in `src/components/lesson/LessonParser.jsx` and returns `{ elements, subtitles, lessonTitle }`.

---

## Block Tags

Block tags must appear alone on a line (trimmed). They open or close a parsing mode.

### `[t] <title text>`
- Renders a `LessonTitle` (`h1`).
- The first `[t]` in the file also sets `lessonTitle` (used by the TOC header).
- Supports inline code and inline links inside the text.

### `[st] <subtitle text>`
- Renders a `LessonSub` (`h4`) with a DOM `id` of `subtitle-<lineIndex>`.
- Appends to the `subtitles` array → appears in the Table of Contents.
- Supports inline code and inline links.

### `[code:<lang>]` … `[endcode]`
- Everything between the open and close tags is captured verbatim into a `CodeBlock`.
- `<lang>` must be a PrismJS language identifier (see supported languages below).
- Raw lines (including indentation) are preserved exactly.
- A `[trycode] <gistId>` tag immediately after `[endcode]` wraps the code block in a `TryCodeButton` tab panel.

**Supported languages:** `java`, `javascript`, `jsx`, `sql`, `dart`, `yaml`, `ini`, `http`, `sql-enhanced`, `java-enhanced`

### `[v] <videoId> | <title>`
- Renders a `YouTubeEmbed` iframe at 16:9 aspect ratio.
- `videoId` is the YouTube video ID string.
- `title` is the accessible title for the iframe.

### `[i] <imageName.ext> | <alt text>`
- Renders an `ImageBlock` (full-width, rounded corners, elevation shadow).
- `imageName.ext` is a filename relative to `src/assets/` **or** an absolute `https://` URL.
- `alt text` is optional but recommended.

### `[icon] <imageName.ext> | <alt text>`
- Renders an `IconBlock` (full-width image, no border-radius, larger vertical margin).
- Accepts the same source formats as `[i]`.

### `[link] <displayname> <url>`
### `[link] (<display text with spaces>) <url>`
- Renders a standalone `Link` component (block-level, opens in new tab, green accent color, launch icon).
- Parentheses syntax allows display names that contain spaces.
- Can also appear **inline** inside paragraph text (same syntax).

### `[dartpad] <gistId>`
- Renders a `DartPadEmbed` iframe loaded from the given GitHub Gist ID.

### `[trycode] <gistId>`
- Must follow immediately after a `[endcode]` line.
- Wraps the preceding code block in a two-tab panel: **Código** (static view) and **Fire it up!** (live DartPad).
- If there is no pending code block, this tag is silently ignored.

### `[list]` … `[endlist]`
- Every non-empty line between the tags becomes a list item.
- Renders as a `<ul>` with custom bullet marks (4 px wide white rectangles).
- List items support inline code and inline links.

### `[beansim]` … `[endbeansim]`
- Renders a `BeanVisualizer` interactive canvas component.
- Everything between the tags is passed as `initialCode` to the visualizer (Java annotations or XML bean definitions).
- See SPEC-07 for BeanVisualizer details.

---

## Inline Tags

Inline tags appear *within* regular text or list items. They are processed by `parseInlineCode` and `parseInlineLinks`.

### `` `code` ``
- Backtick-delimited text renders as `<code class="inline-code">`.
- Styled with `theme.inlineCodeBg` background and `theme.inlineCodeText` color.

### `[link] <displayname> <url>` (inline)
### `[link] (<display text>) <url>` (inline)
- Same as the block link, but appears within a paragraph or list item.
- Renders as an inline `Link` component.

---

## Table of Contents (`toc.md`) Tags

`src/content/toc.md` uses its own subset of tags parsed by `TableOfContentsParser`:

| Tag | Purpose |
|---|---|
| `[t] <label>` | Section heading in the sidebar (non-clickable) |
| `[d]` | Visual divider in the sidebar |
| `[lesson] <filename.md>` | Lesson entry; filename must exist in `src/content/` |

- Lessons are numbered sequentially (1, 2, 3…) by order of appearance in `toc.md`.
- Lines beginning with `**` are ignored (used for commented-out entries).

---

## Parsing Rules & Edge Cases

1. Lines are processed top-to-bottom; no look-ahead except for the `pendingCodeBlock` / `[trycode]` pairing.
2. Blank lines outside a block tag produce a bare `<br />`.
3. Non-tag lines outside a block produce `{text}<br />` (raw text with line break).
4. Trailing blank lines at the end of the file are stripped before parsing.
5. `[beansim]` content is stripped of its own `[beansim]`/`[endbeansim]` tags before being passed to the visualizer (the visualizer does its own stripping as a safety measure).

---

## Adding a New DSL Tag

1. Add a detection block in `LessonParser.jsx` following the existing pattern (check `trimmedLine.startsWith(...)`, flush paragraph buffer if needed, push component to `elements`).
2. Create the React component in `src/components/lesson/` or the appropriate subfolder.
3. Import the component at the top of `LessonParser.jsx`.
4. Document the tag in this file.
