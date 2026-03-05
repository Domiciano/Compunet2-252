# SPEC-03 · Layout & Responsive Design

## Breakpoints (MUI defaults)

| Name | Width | Behavior |
|---|---|---|
| `xs` | 0 px + | Mobile baseline |
| `sm` | 600 px + | Tablet portrait |
| `md` | 900 px + | Tablet landscape |
| `lg` | 1200 px + | Desktop (three-column) |
| `xl` | 1536 px + | Wide desktop |

The app uses **`lg`** as the primary breakpoint between mobile/tablet layout and desktop layout.

---

## Three-Column Desktop Layout (`lg` and above)

```
┌────────────────────────────────────────────────────────────────────┐
│  AppBar (fixed, full width, height: 64 px, z-index: 1300)         │
├──────────────┬─────────────────────────────────────┬──────────────┤
│ Nav Drawer   │  Lesson Content                     │  TOC         │
│ width: 280px │  position: absolute                 │  width: 235px│
│ fixed, left:0│  left: 240px, right: 220px          │  fixed,right:│
│ top: 0       │  height: 100vh, overflow: scroll    │  top: 64px   │
│ z-index:1201 │                                     │              │
│              │  LessonContainer padding:           │              │
│              │  px: 6 (md) | pt: 6 (md)            │              │
└──────────────┴─────────────────────────────────────┴──────────────┘
```

- Nav Drawer is **permanent** (not collapsible) at `lg+`.
- Content area uses `position: absolute` to avoid layout shift from the fixed columns.
- TOC is `position: fixed`, `right: 0`, `top: 64px`, does not scroll with content.
- Both Nav Drawer and TOC have hidden scrollbars (`scrollbar-width: none`).

---

## Mobile / Tablet Layout (below `lg`)

```
┌────────────────────────────────────────────────────────────────────┐
│  AppBar (64 px)  [☰ menu]  Logo  Title         [☀/☾]  [📖 TOC]  │
├────────────────────────────────────────────────────────────────────┤
│  Lesson Content (full width, padding-top: 8 units ≈ 64px)         │
│  LessonContainer padding: px: 2 (xs) | pt: 3 (xs)                 │
└────────────────────────────────────────────────────────────────────┘
```

- Nav Drawer becomes a **temporary MUI Drawer** sliding from the left.
  - Width: `85%` of viewport, capped at `280 px`.
  - Opens via the hamburger `[☰]` button in the AppBar.
  - Backdrop: `rgba(0, 0, 0, 0.5)`.
  - Padding top: `64 px` (to clear the AppBar).
- TOC becomes a **custom fixed overlay** sliding in from the right.
  - Width: `85vw`, capped at `320 px`.
  - Opens via the `[📖]` button in the AppBar.
  - Closes via an `×` button inside the overlay.
  - `z-index: 2000`.

---

## AppBar

| Property | Value |
|---|---|
| Position | `fixed`, full width |
| Height | `64 px` (`minHeight: 64`) |
| `z-index` | `1300` |
| Background | `theme.appBarBg` (`#009F6B` both modes) |
| Text / icons | `theme.appBarText` (`#FFFFFF` both modes) |
| Elevation | `0` (no MUI shadow); custom `box-shadow: 0 2px 8px rgba(0,0,0,0.04)` |

### AppBar content — desktop (`md+`)
- Left: Logo image (36 × 36 px) + "Computación en internet II" (`font-size: 1.25rem`, `font-weight: 700`, `letter-spacing: 0.04em`)
- Right: Theme toggle icon button

### AppBar content — mobile (below `md`)
- Left: Hamburger `[☰]` button + Logo + "Compunet II" (`font-size: 1rem`, `max-width: 120 px`, ellipsis overflow)
- Right: Theme toggle + TOC open button

---

## Nav Drawer (sidebar)

| Property | Value |
|---|---|
| Width | `280 px` |
| Background | `theme.background` |
| Border | none |
| Top offset | `64 px` spacer inside drawer content |
| Bottom padding | `100 px` spacer at end of list |
| Overflow-Y | auto (scrollable), scrollbar hidden |

### Drawer items

**Section title** (`[t]`)
- `font-size: 0.75rem`
- `font-weight: bold`
- `text-transform: uppercase`
- Color: `theme.drawerTitle`
- Padding: `px: 2, py: 1`

**Lesson item** (`[lesson]`)
- `ListItemButton` with React Router `Link`
- Default color: `theme.drawerSection` (`#00B97A`)
- Hover color: `theme.drawerTitle`
- Selected background: `rgba(66, 165, 245, 0.1)`
- Selected color: `theme.drawerTitle`
- Right side: checkmark icon (studied/unStudied toggle)
  - Studied: `CheckCircleIcon` in `theme.accent`
  - Unselected + not studied: `CheckCircleOutlineIcon` in `theme.border`
  - Selected + not studied: `CheckCircleOutlineIcon` in `theme.accent`, opacity `0.8`

---

## Table of Contents (TOC)

| Property | Desktop | Mobile |
|---|---|---|
| Width | `235 px` | `85vw`, max `320 px` |
| Position | `fixed`, `right: 0`, `top: 64px` | `fixed`, `right: 0`, `top: 0` |
| Display | always visible | overlay, toggle via AppBar button |
| Background | `theme.background` | `theme.background` |
| `z-index` | default | `2000` |

### TOC header
- Lesson title text (`font-size: 1.1rem`, `font-weight: 700`)
- Check-circle icon (accent color) for lesson completion

### TOC items
- Font size: `0.875rem`
- Inactive: `theme.textSecondary`, `font-weight: 400`
- Active: highlighted with `rgba(66, 165, 245, 0.15)` background, `1px solid theme.accent` border, `font-weight: 600`
- Hover: `rgba(66, 165, 245, 0.08)` background
- Transition: `all 0.2s ease-in-out`
- Clicking scrolls to the section with `80 px` offset (64 px AppBar + 16 px padding) and updates the URL hash.

---

## LessonContainer (content wrapper)

| Property | xs | sm | md |
|---|---|---|---|
| `px` (horizontal padding) | 2 (16 px) | 4 (32 px) | 6 (48 px) |
| `pt` (top padding) | 3 (24 px) | 4 (32 px) | 6 (48 px) |
| `pb` (bottom padding) | 2 (16 px) | 3 (24 px) | 3 (24 px) |
| `maxWidth` | 100% | 100% | 100% |

---

## Scroll Behavior

- Global scrollbar is hidden on `html` and `body` (all browsers).
- Lesson content area scrolls via the `.hide-scrollbar` absolute-positioned box.
- Navigating to a new lesson resets scroll to `(0, 0)` instantly (no animation).
- Clicking a TOC item: smooth scroll with `80 px` offset.
- `useContentSpy` tracks active section via `IntersectionObserver` with `rootMargin: '-10% 0px -60% 0px'`. At 90 % of page-end, the last subtitle is activated.
