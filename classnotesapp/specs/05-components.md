# SPEC-05 · Component Specifications

Each component spec covers: purpose, props, visual output, and constraints.

---

## AppBarGlobal

**File:** `src/components/AppBarGlobal.jsx`

**Purpose:** Fixed top navigation bar. Shows branding, theme toggle, and mobile-only controls.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `onOpenMobileToc` | `() => void` | Opens the in-page TOC overlay (mobile only) |
| `onOpenMobileNav` | `() => void` | Opens the temporary nav drawer (mobile only) |

**Visual:** See SPEC-03 AppBar section.

**Constraints:**
- Always `position: fixed`, `z-index: 1300` (above drawer z-index 1201, below TOC overlay 2000).
- Theme toggle icon: `LightModeIcon` when dark mode, `DarkModeIcon` when light mode. Both in `theme.accent`.
- Hamburger and TOC buttons: only rendered below `md` breakpoint.

---

## Layout

**File:** `src/components/drawer/Layout.jsx`

**Purpose:** Shell component that positions the nav drawer and wraps the main content.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `children` | `ReactNode` | Main content (the `<Routes>` tree) |
| `sections` | `Section[]` | Parsed TOC sections for the sidebar |
| `onOpenMobileNav` | `React.MutableRefObject` | Ref that Layout writes a callback into so `AppBarGlobal` can trigger mobile drawer open |

**Section type:**
```js
{ type: 'title' | 'lesson' | 'divider', id: string, label: string, filePath?: string }
```

**Constraints:**
- Desktop: nav drawer is a plain fixed `Box`, not a MUI `Drawer`.
- Mobile: MUI `Drawer` with `variant="temporary"`, `keepMounted: true`.
- Main content `margin-left` equals `drawerWidth` (280 px) on desktop, `0` on mobile.
- Main content `padding-top` is `8 units` (64 px) on mobile to clear AppBar, `2 units` on desktop.

---

## LessonPage

**File:** `src/pages/LessonPage.jsx`

**Purpose:** Route component for `/lesson/:lessonId`. Loads raw lesson content and renders it.

**Props (via `forwardRef`):**
| Prop | Type | Description |
|---|---|---|
| `sections` | `Section[]` | Used to build `lessonId → filePath` map |

**Imperative handle (ref):**
| Method | Description |
|---|---|
| `openMobileToc()` | Sets `showMobileToc = true` |
| `closeMobileToc()` | Sets `showMobileToc = false` |

**Behavior:**
1. On `lessonId` change: looks up `filePath`, calls `LessonParser({ content: rawContent })`.
2. Sets `parsedContent` → `{ elements, subtitles, lessonTitle }`.
3. Scrolls to `(0, 0)` instantly.
4. Passes `subtitles` to `useContentSpy` to track active section.

**Layout:**
- Content: `position: absolute`, `left: 240px`, `right: 220px` (desktop); adjusted to `10px` on mobile.
- Desktop TOC: `position: fixed`, `right: 0`, `top: 64px`, `width: 235px`.
- Mobile TOC: overlay `Box`, `fixed`, `right: 0`, `top: 0`, `width: 85vw`, max `320px`, `z-index: 2000`.

---

## LessonParser

**File:** `src/components/lesson/LessonParser.jsx`

**Purpose:** Pure function (used as `LessonParser({ content })`) that converts DSL text into React elements.

**Input:** `content: string` (raw lesson file text)

**Output:** `{ elements: ReactNode, subtitles: Subtitle[], lessonTitle: string | null }`

```js
// Subtitle shape
{ id: string, text: string }
```

**Constraints:**
- Stateless — returns new output on every call, no side effects.
- Does not render anything itself; wraps output in `<LessonContainer>`.
- The `paragraphBuffer` / `flushParagraph` mechanism is currently unused in practice (raw lines fall through to the inline text + `<br />` handler). This is a known inconsistency.

---

## LessonContainer

**File:** `src/components/lesson/LessonContainer.jsx`

**Purpose:** Padding wrapper for all lesson content.

**Props:** `children: ReactNode`

**Padding (responsive):**
| Property | xs | sm | md |
|---|---|---|---|
| `px` | 16 px | 32 px | 48 px |
| `pt` | 24 px | 32 px | 48 px |
| `pb` | 16 px | 24 px | 24 px |

---

## LessonTitle

**File:** `src/components/lesson/LessonTittle.jsx` *(note: filename typo)*

**Purpose:** Renders the main lesson heading.

**Props:** `children: ReactNode`

| Property | xs | md+ |
|---|---|---|
| Font size | `2.5rem` | `3.5rem` |
| Font weight | 800 | 800 |
| Color | `theme.contentTitle` | same |
| Margin top | `4 units` (32 px) | same |
| Margin bottom | `2 units` (16 px) | same |
| Letter spacing | `0.05em` | same |
| Line height | `1.1` | same |

---

## LessonSub

**File:** `src/components/lesson/LessonSub.jsx`

**Purpose:** Section subtitle; anchor for TOC navigation.

**Props:** `children: ReactNode`, `id: string`

| Property | xs | md+ |
|---|---|---|
| Font size | `1.5rem` | `2rem` |
| Font weight | 600 | 600 |
| Color | `theme.contentSubtitle` (`#00D084`) | same |
| Margin top | `3 units` (24 px) | same |
| Margin bottom | `2 units` (16 px) | same |
| Letter spacing | `0.02em` | same |
| Line height | `1.2` | same |

The `id` attribute enables `IntersectionObserver` tracking and smooth scroll targeting.

---

## LessonParagraph

**File:** `src/components/lesson/LessonParagraph.jsx`

**Purpose:** Styled body text paragraph.

**Props:** `children: ReactNode`

| Property | xs | md+ |
|---|---|---|
| Font size | `1rem` | `1.1rem` |
| Color | `theme.textPrimary` | same |
| Margin bottom | `2 units` (16 px) | same |
| Line height | `1.7` | same |

*Note: Currently `LessonParagraph` is pushed to `elements` via `flushParagraph`, but the main parsing loop renders raw lines directly as `{text}<br />`. `LessonParagraph` is effectively only used for content that accumulates in `paragraphBuffer` — which the current DSL does not produce. This is a known gap.*

---

## CodeBlock

**File:** `src/components/code/CodeBlock.jsx`

**Purpose:** Syntax-highlighted code block with copy button.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `children` | `string` | Raw code text |
| `language` | `string` | PrismJS language key |
| `className` | `string` | Optional additional class |

**Visual:**
- Outer `Box` with class `flutter-code` (CSS in `flutter-like.css`).
- Copy button: absolute top-right, `8 px` from edge, semi-transparent dark background.
- `<pre>` is scrollable horizontally, no border, no shadow.
- Code is always left-aligned.

**Supported language IDs:** `java`, `javascript`, `jsx`, `sql`, `dart`, `yaml`, `ini`, `http`

**Custom grammars:**
- `prism-http.js`: HTTP request/response syntax
- `prism-java-enhanced.js`: Spring annotations (`@Component`, `@Autowired`, etc.)
- `prism-sql-enhanced.js`: Enhanced SQL keywords

---

## ImageBlock

**File:** `src/components/lesson/ImageBlock.jsx`

**Purpose:** Full-width lesson image with rounded corners and elevation.

**Props:** `src: string`, `alt: string`

- Width: `100%`
- Height: auto (preserves aspect ratio)
- Border-radius: MUI `6` (24 px)
- Shadow: MUI `boxShadow: 20`
- Vertical margin: `1 unit` (8 px)

---

## IconBlock

**File:** `src/components/lesson/IconBlock.jsx`

**Purpose:** Full-width decorative image without border-radius (used for diagrams/icons).

**Props:** `src: string`, `alt: string`

- Width: `100%`
- Height: auto
- No border-radius
- Vertical margin: `3 units` (24 px)

---

## YouTubeEmbed

**File:** `src/components/embed/YouTubeEmbed.jsx`

**Purpose:** Responsive YouTube iframe at 16:9.

**Props:** `videoId: string`, `title: string`

- Aspect ratio container: `padding-bottom: 66.25%` (approx 16:9), height 0.
- `iframe` fills `100% × 100%` absolutely.
- Border-radius: MUI `2` (8 px)
- Shadow: MUI `boxShadow: 3`
- Vertical margin: `3 units` (24 px)
- Load params: `?vq=hd1080&rel=0` (HD preferred, no related videos)

---

## DartPadEmbed

**File:** `src/components/embed/DartPadEmbed.jsx`

**Purpose:** Embeds a DartPad iframe loaded from a GitHub Gist.

*Detailed visual spec depends on DartPad's own iframe behavior.*

---

## Link

**File:** `src/components/lesson/Link.jsx`

**Purpose:** External link with launch icon. Can be block-level or inline.

**Props:** `displayname: string`, `url: string`

- Color: `theme.accent` by default, `theme.contentTitle` on hover.
- Opens in `_blank` with `rel="noopener noreferrer"`.
- Inline `LaunchIcon` at `1.1em`.
- Transition: `color 0.2s`.
- Block-level wrapper: `display: block`, `margin-bottom: 10px`.

---

## TryCodeButton

**File:** `src/components/lesson/TryCodeButton.jsx`

**Purpose:** Tab panel that switches between a static code view and a live DartPad.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `gistId` | `string` | GitHub Gist ID for DartPad |
| `codeBlock` | `ReactNode` | The preceding `CodeBlock` element |

**Tabs:**
- **Código** tab: shows the static `codeBlock`.
- **Fire it up!** tab: renders `<DartPadEmbed gistId={gistId} />`.
- Active tab uses `variant="contained"` with `primary.main` background.
- Inactive tab uses `variant="text"` with `theme.textSecondary` color.
- Tab bar has `borderBottom: 1, borderColor: divider`.
- Content panel: `border: 1`, `borderTop: none`, `borderRadius: 0 0 8px 8px`.

---

## TableOfContents

**File:** `src/components/lesson/TableOfContents.jsx`

**Purpose:** Sticky sidebar list of subtitles for the current lesson.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `subtitles` | `Subtitle[]` | List of `{ id, text }` from `LessonParser` |
| `lessonTitle` | `string` | Lesson main title (shown at top of TOC) |
| `activeSection` | `string` | ID of currently visible subtitle |
| `lessonId` | `string \| number` | Used for the completion check icon |

- Returns `null` if `subtitles.length === 0`.
- Clicking an item: smooth scroll to element with `80 px` offset, updates URL hash to a slug of the subtitle text.
- URL hash format: lowercase, accents stripped, spaces → hyphens.

---

## BeanVisualizer

**File:** `src/components/BeanVisualizer/BeanVisualizer.jsx`

See SPEC-07 for the full specification.
