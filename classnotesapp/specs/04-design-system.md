# SPEC-04 · Design System (Colors, Typography, Spacing)

## Color Tokens

Two themes are defined in `src/theme/colors.js`. The app defaults to **dark** mode.

### Dark Theme

| Token | Value | Usage |
|---|---|---|
| `background` | `#181C23` | Page background, drawer, TOC |
| `backgroundLight` | `#232936` | Cards, elevated surfaces |
| `contentTitle` | `#FFFFFF` | `[t]` lesson title text |
| `contentSubtitle` | `#00D084` | `[st]` subtitle text |
| `drawerTitle` | `#FFFFFF` | Section headers and selected lesson in drawer |
| `drawerSection` | `#00B97A` | Unselected lesson links in drawer |
| `textPrimary` | `#F3F6FB` | Body paragraph text |
| `textSecondary` | `#AAB4BE` | TOC items (inactive), secondary labels |
| `accent` | `#00D084` | Highlight color (active TOC border, icons, links) |
| `border` | `#232936` | Drawer border, subtle dividers |
| `inlineCodeBg` | `rgba(120,120,120,0.22)` | Inline `code` background |
| `inlineCodeText` | `#00B97A` | Inline `code` text |
| `codeBg` | `#23272e` | (reserved; code blocks use `flutter-like.css`) |
| `codeText` | `#f8f8f2` | (reserved) |
| `appBarBg` | `#009F6B` | AppBar background |
| `appBarText` | `#FFFFFF` | AppBar text and icon color |
| `error` | `#FF5370` | Error messages |
| `success` | `#00B97A` | Success states |
| `warning` | `#FFB300` | Warning messages |

### Light Theme

| Token | Value | Usage |
|---|---|---|
| `background` | `#F5F7FA` | Page background |
| `backgroundLight` | `#FFFFFF` | Cards |
| `contentTitle` | `#222` | Lesson title text |
| `contentSubtitle` | `#00D084` | Subtitle text (same as dark) |
| `drawerTitle` | `#222` | Drawer section headers |
| `drawerSection` | `#00B97A` | Lesson links in drawer |
| `textPrimary` | `#222` | Body text |
| `textSecondary` | `#444` | Secondary text |
| `accent` | `#00D084` | Accent (same as dark) |
| `border` | `#e0e0e0` | Subtle borders |
| `inlineCodeBg` | `rgba(120,120,120,0.10)` | Inline code background |
| `inlineCodeText` | `#009F6B` | Inline code text |
| `codeBg` | `#f5f5f5` | Reserved |
| `codeText` | `#222` | Reserved |
| `appBarBg` | `#009F6B` | AppBar (same as dark) |
| `appBarText` | `#FFFFFF` | AppBar text (same as dark) |
| `error` | `#D32F2F` | Errors |
| `success` | `#00B97A` | Success |
| `warning` | `#FFA000` | Warnings |

---

## Code Block Theme (`flutter-like.css`)

The code block always uses a **fixed dark background** regardless of app theme.

| Element | Color |
|---|---|
| Background | `#0B121A` |
| Default text | `#abb2bf` |
| Keywords | `#7bdb96` (green) |
| Strings | `#e7617e` (pink-red) |
| Class names | `#fd8a38` (orange) |
| Functions | `#61afef` (blue) |
| Numbers / booleans | `#d19a66` (amber) |
| Properties / variables | `#c678dd` (purple) |
| Comments | `#5c6370` (gray, italic) |
| HTTP method tokens | `#7bdb96` bold |
| HTTP URL tokens | `#61afef` |
| HTTP header tokens | `#c678dd` |
| HTTP status codes | `#d19a66` |
| Meta annotations (`@`) | `#7bdb96` |

Font: `'Fira Code', 'Roboto Mono', monospace`
Font size: `0.95rem`
Padding: `16 px`
Border-radius: `8 px`

---

## Typography

Font family: **Roboto** (Google Fonts, weights 300–900).
Base font smoothing: `antialiased`.

| Element | Tag | Font size (xs) | Font size (md+) | Weight | Other |
|---|---|---|---|---|---|
| Lesson title (`[t]`) | `h1` | `2.5rem` | `3.5rem` | 800 | `letter-spacing: 0.05em`, `line-height: 1.1` |
| Subtitle (`[st]`) | `h4` | `1.5rem` | `2rem` | 600 | `letter-spacing: 0.02em`, `line-height: 1.2` |
| Paragraph | `p` | `1rem` | `1.1rem` | 400 | `line-height: 1.7` |
| List item | `Typography` | `1rem` | `1.1rem` | 400 | `line-height: calc(1.7em)` |
| TOC title | `h6` | — | `1.1rem` | 700 | `letter-spacing: 0.01em` |
| TOC item | `body2` | — | `0.875rem` | 400 / 600 | Active: 600 |
| Drawer section label | — | — | `0.75rem` | bold | `text-transform: uppercase` |
| AppBar title (desktop) | `h6` | — | `1.25rem` | 700 | `letter-spacing: 0.04em` |
| AppBar title (mobile) | `h6` | `1rem` | — | 700 | `max-width: 120px`, ellipsis |
| Inline code | `code` | — | — | — | see token colors above |

---

## Spacing Scale (MUI default: 1 unit = 8 px)

| Units | px |
|---|---|
| 0.5 | 4 |
| 1 | 8 |
| 2 | 16 |
| 3 | 24 |
| 4 | 32 |
| 6 | 48 |
| 8 | 64 |

---

## Accent Color System

The brand accent is **#00D084** (bright green). It appears on:
- Subtitle headings
- Drawer section links (unselected)
- Active TOC border
- Check-circle icons (studied status)
- Link components
- AppBar icon buttons

The secondary green **#00B97A** (darker) is used for:
- Drawer section headings (`[t]` in sidebar)
- Inline code text (dark theme)
- AppBar background

---

## Elevation and Shadow

| Component | Shadow |
|---|---|
| ImageBlock | MUI `boxShadow: 20` (highest) |
| YouTubeEmbed | MUI `boxShadow: 3` |
| Mobile TOC overlay | MUI `boxShadow: 6` |
| Mobile nav drawer | `4px 0 20px rgba(0,0,0,0.5)` |
| AppBar | `0 2px 8px rgba(0,0,0,0.04)` |
| Code block copy button | `rgba(0,0,0,0.18)` → `rgba(0,0,0,0.32)` on hover |

---

## Border Radius

| Component | Radius |
|---|---|
| ImageBlock | MUI `borderRadius: 6` (24 px) |
| YouTubeEmbed | MUI `borderRadius: 2` (8 px) |
| Code block container | `8 px` |
| TOC active item | MUI `borderRadius: 1` (4 px) |
| TryCodeButton panel | `8px 8px 0 0` top, `0 0 8px 8px` bottom |
| Copy button | MUI default (circular small) |
