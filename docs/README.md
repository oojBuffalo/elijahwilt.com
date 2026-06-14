# Documentation Index

Code-level documentation for **elijahwilt.com** — a single-page terminal-themed
portfolio site built with Next.js 16 (App Router), React 19, TypeScript (strict),
and Tailwind CSS v4.

## Layout of these docs

Docs mirror the source tree. Cohesive directories are documented per-directory;
files with a substantial standalone API get their own page.

| Doc | Covers |
| --- | --- |
| [app/README.md](app/README.md) | `app/layout.tsx`, `app/page.tsx`, `app/globals.css` |
| [app/actions/contact.md](app/actions/contact.md) | `app/actions/contact.ts` — contact-form Server Action |
| [components/sections/README.md](components/sections/README.md) | The page-section components |
| [components/terminal/README.md](components/terminal/README.md) | `Cursor`, `TypeWriter`, `TerminalForm` |
| [lib/README.md](lib/README.md) | `cn`, `data`, `useInView`, `useSearchParam` |

## Architecture overview

The site is a single route (`/`). A sticky section nav sits above the page, and
six full-width sections are stacked in `app/page.tsx`:

```
RootLayout (app/layout.tsx — fonts, metadata, skip link)
└── Home (app/page.tsx)
    ├── <Nav />         sticky scroll-spy section nav (about → contact)
    └── <main id="main-content">
        ├── <Hero />        animated terminal intro
        ├── <About />       bio paragraphs
        ├── <Timeline />    unified work + education history (collapsible coursework)
        ├── <Projects />    expandable project cards (deep-linkable via ?project=)
        ├── <Skills />      expandable skill categories (deep-linkable via ?skills=)
        ├── <Contact />     social links + terminal-styled contact form
        └── footer
```

Data flow is one-directional and static: all page content lives in
[`lib/data.ts`](lib/README.md#datats) as plain typed constants; section
components import what they render. The only server interaction is the
contact form, which posts through a React 19 Server Action
([`sendContactEmail`](app/actions/contact.md)) that relays mail via Resend.

### Conventions

- **Client components by default for sections.** Every section is a
  `"use client"` component because each uses the `useInView` hook for
  scroll-reveal animation. The page and layout are Server Components.
- **Section navigation.** `components/Nav.tsx` is a sticky scroll-spy bar that
  links to the in-page sections (`about`, `timeline`, `projects`, `skills`,
  `contact`) and highlights the one currently in view via an
  `IntersectionObserver` "trip line". Anchor jumps clear the bar via
  `scroll-padding-top` (globals.css). Legacy `#experience` / `#education`
  anchors still resolve — `Timeline` keeps hidden span anchors so old deep
  links land on the merged timeline.
- **Scroll reveal.** Sections pair `useInView` with the `.scroll-reveal` /
  `.visible` CSS classes (defined in `globals.css`) and stagger children with
  inline `transitionDelay` styles.
- **Deep links via the URL.** Projects and Skills derive their expanded state
  directly from the query string (`?project=` / `?skills=`) — the URL is the
  single source of truth, not local component state. They read it with the
  reactive `useSearchParam` hook and write it with `setSearchParam`
  ([`lib/useSearchParam`](lib/README.md#usesearchparamts)), so deep links work
  on first load, after interaction, and on browser back/forward.
- **Shared collapsible.** `components/Disclosure.tsx` (`<Disclosure id open>`)
  renders the grid-rows `0fr → 1fr` height transition plus the a11y wiring
  (`id`, `aria-hidden`, `inert`) for collapsible panels. Projects, Skills, and
  the Timeline coursework accordion all use it; each caller keeps its own
  trigger button wired with `aria-expanded` / `aria-controls={id}`.
- **Terminal aesthetic.** Section headings are styled as shell prompts
  (`~/about $ cat bio.txt`), and theme tokens (`bg-primary`, `accent-green`,
  …) are GitHub-dark-inspired colors defined in `globals.css` via Tailwind v4
  `@theme inline`.
- **Reduced motion.** All animation paths honor `prefers-reduced-motion`:
  CSS animations are disabled in a media query, the `Disclosure` transition is
  dropped (`motion-reduce:transition-none`), and `TypeWriter` skips typing
  entirely.
- **Accessibility.** Decorative terminal animation is `aria-hidden` with an
  `sr-only` static copy; the form has labeled fields, inline errors wired via
  `aria-describedby`/`aria-invalid`, and a polite live region for status.
- **Path alias.** `@/*` maps to the repository root (`tsconfig.json`).

### Dependencies of note

| Package | Used for |
| --- | --- |
| `resend` | Sending contact-form email from the Server Action |
| `react-katex` + `katex` | Rendering inline LaTeX in Hero terminal output |
| `clsx` + `tailwind-merge` | The `cn()` class-name utility (used throughout, incl. `Nav` and `Disclosure`) |
| `tailwindcss` v4 (`@tailwindcss/postcss`) | Styling; configured in CSS, no `tailwind.config.js` |

### Build & deployment

- `npm run dev` — dev server on port **3314**.
- `npm run build` — production build; `next.config.ts` sets
  `output: "standalone"` so the build emits a self-contained `server.js`.
- **Dockerfile** — three-stage production image (`deps` → `builder` →
  `runner`, all `node:20-alpine`) that runs the standalone server on port
  3314. Server-side secrets (e.g. `RESEND_API_KEY`) are injected at runtime,
  not baked into the image.
- **docker-compose.yml** — development-mode alternative: bind-mounts the
  source into a `node:20-alpine` container, runs `npm install && npm run dev`
  with polling file-watching, and loads `.env.local`.

### Environment variables

| Variable | Required | Used in | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | For contact form sends | `app/actions/contact.ts` | Resend API authentication |
