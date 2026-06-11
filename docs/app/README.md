# `app/` — Routes, Layout, and Global Styles

Next.js App Router root. One route (`/`) plus the root layout and global
stylesheet. The Server Action in `app/actions/` is documented separately in
[actions/contact.md](actions/contact.md).

---

## `app/layout.tsx`

Root layout — a Server Component. Configures fonts, metadata, viewport, and
an accessibility skip link.

### Module-level constants

| Constant | Type | Description |
| --- | --- | --- |
| `geistSans` | `NextFontWithVariable` | Geist Sans via `next/font/google`; exposes CSS variable `--font-geist-sans`, latin subset |
| `geistMono` | `NextFontWithVariable` | Geist Mono via `next/font/google`; exposes CSS variable `--font-geist-mono`, latin subset |

### Exports

#### `metadata: Metadata`

Static site metadata consumed by Next.js:

- `title`: `"Elijah Wilt | ML/AI Engineer"`
- `description`: ML/computer-vision/NLP-focused summary
- `keywords`: `["Machine Learning", "AI Engineer", "Computer Vision", "NLP", "PyTorch", "Data Science", "MLOps"]`
- `authors`: `[{ name: "Elijah Wayne Wilt" }]`
- `openGraph`: title, description, `type: "website"`

#### `viewport: Viewport`

- `themeColor`: `"#0d1117"` (matches `--bg-primary`)

#### `default RootLayout(props): JSX.Element`

```tsx
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element
```

| Parameter | Type | Description |
| --- | --- | --- |
| `children` | `React.ReactNode` | The routed page content |

**Returns:** the `<html lang="en">` document shell.

**Behavior:**
- Applies both font CSS variables and `antialiased` to `<body>`.
- Renders a *Skip to main content* link (`href="#main-content"`) as the first
  focusable element. It is visually hidden (`sr-only`) until keyboard focus
  reveals it (`focus:not-sr-only`), then jumps to `<main id="main-content">`
  in `page.tsx`.

---

## `app/page.tsx`

The home page — a Server Component that composes the seven sections.

### Exports

#### `default Home(): JSX.Element`

```tsx
export default function Home(): JSX.Element
```

**Parameters:** none.

**Returns:** `<main id="main-content">` containing, in order: `<Hero />`,
`<About />`, `<Projects />`, `<Skills />`, `<Experience />`, `<Education />`,
`<Contact />`, then a footer rendering `$ exit 0` in terminal style.

`id="main-content"` is the skip-link target from the root layout. Section
components are documented in
[../components/sections/README.md](../components/sections/README.md).

---

## `app/globals.css`

Global stylesheet. Imports Tailwind (`@import "tailwindcss"`) and defines the
theme — this project uses Tailwind v4 CSS-based configuration, so there is no
`tailwind.config.js`.

### Theme tokens

Raw values are set on `:root` (with `color-scheme: dark`), then mapped to
Tailwind color/font tokens in an `@theme inline` block:

| CSS variable | Value | Tailwind utilities generated |
| --- | --- | --- |
| `--bg-primary` | `#0d1117` | `bg-bg-primary`, `text-bg-primary`, … |
| `--bg-secondary` | `#161b22` | `bg-bg-secondary`, … |
| `--text-primary` | `#e6edf3` | `text-text-primary`, … |
| `--text-secondary` | `#8b949e` | `text-text-secondary`, … |
| `--accent-green` | `#3fb950` | `text-accent-green`, `bg-accent-green/20`, … |
| `--accent-cyan` | `#39c5cf` | `text-accent-cyan`, `border-accent-cyan`, … |
| `--border` | `#30363d` | `border-border`, `bg-border/30`, … |
| `--font-sans` | Geist Sans (from layout) | `font-sans` |
| `--font-mono` | Geist Mono (from layout) | `font-mono` |

### Animation classes

| Class | Effect |
| --- | --- |
| `.cursor-blink` | 1s step-end opacity blink (used by `Cursor` and the form's fake caret) |
| `.animate-fade-in` | 0.5s fade-in + 10px rise, `forwards` fill |
| `.animate-delay-100` … `.animate-delay-500` | `animation-delay` of 100–500 ms in 100 ms steps |
| `.scroll-reveal` | Initial state: `opacity: 0`, `translateY(20px)`, 0.6s ease-out transition |
| `.scroll-reveal.visible` | Final state: fully opaque, no offset (toggled by sections via `useInView`) |

All three animation families are neutralized under
`@media (prefers-reduced-motion: reduce)` — content renders in its final
state with no animation or transition.

### Other global rules

- `body` — dark background, light text, Geist Sans with system fallback.
- `:focus-visible` — 2px `--accent-cyan` outline with 2px offset.
- `section[id]` — `scroll-margin-top: 2rem` so anchor targets clear the
  viewport edge.
- `a, button, input, textarea, select` — `touch-action: manipulation`;
  `html` disables the WebKit tap highlight.
- `::selection` — cyan background with dark text.
- WebKit scrollbar styling (8px, themed track/thumb).
