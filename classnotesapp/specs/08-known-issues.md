# SPEC-08 · Known Issues & Gaps

This file documents current inconsistencies between the implementation and intended behavior. It is the primary input for planning future evolution of the app.

---

## DSL Parser Issues

### P1 — `LessonParagraph` is unreachable in practice

**Location:** `LessonParser.jsx`, `flushParagraph` function.

**Description:** The parser maintains a `paragraphBuffer` that accumulates text and flushes it as a `<LessonParagraph>`. However, the main loop's catch-all branch renders raw text directly as `{text}<br />` instead of accumulating into the buffer. As a result, `LessonParagraph` is never actually pushed to `elements` during normal parsing — only via the `flushParagraph` calls that happen when other block tags open, where the buffer is always empty.

**Impact:** Paragraphs don't get the `LessonParagraph` margin and styling — they render as raw text lines with line breaks. Lesson content currently relies on this behavior, so changing it would require migrating all lesson files.

**Planned fix:** Either (a) remove `LessonParagraph` and formalize the raw-line rendering, or (b) introduce a blank-line-delimited paragraph mode that groups consecutive text lines into a `LessonParagraph`.

---

### P2 — `IconBlock` and `ImageBlock` have identical rendering

**Location:** `src/components/lesson/IconBlock.jsx`, `ImageBlock.jsx`

**Description:** Both render a full-width `<img>`. `ImageBlock` adds `borderRadius: 6` and `boxShadow: 20`; `IconBlock` does not. The naming implies `IconBlock` is for small decorative images, but the implementation renders them at full width (100%). The `[icon]` tag is used in practice for wide diagram images that should not have rounded corners.

**Impact:** Minor — visual inconsistency. The distinction between `[i]` and `[icon]` is unclear to authors.

**Planned clarification:** Document the semantic intent and optionally add a `width` parameter.

---

### P3 — `[d]` divider in `toc.md` renders nothing

**Location:** `src/components/drawer/Layout.jsx` — `sections.map` switch.

**Description:** `TableOfContentsParser` produces `{ type: 'divider' }` items, but `Layout.jsx` only handles `type === 'title'` and `type === 'lesson'`. The divider returns `null`.

**Impact:** Low — the feature was intended to render a visual separator in the sidebar.

---

### P4 — TOC check-circle button in `TableOfContents` is non-functional

**Location:** `src/components/lesson/TableOfContents.jsx`, lines 62–75.

**Description:** The `onClick` handler attempts to call `window.useStudiedLessons()`, which is never set. The `StudiedLessonsContext` is only available through React's `useContext`, not on the window object.

**Impact:** The button renders but clicking it does nothing. Lesson completion can only be toggled from the sidebar checkmark.

---

### P5 — `paddingBottom` in `YouTubeEmbed` uses `66.25%` instead of `56.25%`

**Location:** `src/components/embed/YouTubeEmbed.jsx`

**Description:** A 16:9 aspect ratio requires `padding-bottom: 56.25%`. The current value `66.25%` makes the video taller than true 16:9.

**Impact:** Videos appear slightly taller than the actual video content, creating black bars.

---

## Layout Issues

### L1 — Lesson content `left`/`right` values are hardcoded in `LessonPage`

**Location:** `src/pages/LessonPage.jsx`, the content `Box`.

**Description:** `left: {lg: 240, xs: 10}` and `right: {lg: 220, xs: 10}` are magic numbers that correspond to the drawer width (280 px) and TOC width (235 px) respectively, but are not derived from them. If either sidebar width changes, these must be updated manually.

---

### L2 — AppBar mobile breakpoint uses `md` but nav drawer breakpoint uses `lg`

**Location:** `AppBarGlobal.jsx` uses `breakpoints.down('md')` for mobile controls. `Layout.jsx` uses `breakpoints.down('lg')` for the drawer.

**Description:** Between `md` (900 px) and `lg` (1200 px), the AppBar shows in desktop mode (no hamburger) but the drawer is actually a temporary overlay (no permanent sidebar). This means users in the 900–1200 px range have no way to open the nav drawer.

---

## Feature Gaps

### G1 — No search functionality

Students cannot search across lessons. Navigation requires knowing which week/lesson contains the information.

---

### G2 — No lesson completion percentage indicator

The sidebar shows per-lesson checkmarks but no aggregate progress indicator (e.g., "12 / 45 lessons completed").

---

### G3 — `TryCodeButton` is DartPad-only

The "Fire it up!" tab only supports DartPad (for Dart/Flutter code). There is no equivalent for Java (Spring Boot) code examples, which are the majority of the course content.

---

### G4 — Lesson IDs are positional and not stable

Inserting a lesson before existing ones in `toc.md` renumbers all subsequent lessons, breaking saved progress (stored by ID) and bookmarked URLs.

---

### G5 — No light/dark mode persistence

The theme selection is not saved to `localStorage`. It resets to dark mode on every page load.
