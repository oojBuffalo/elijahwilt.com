# `components/sections/` — Page Sections

The full-width sections composed by `app/page.tsx`. All are
**client components** (`"use client"`), all are **zero-prop**, and all
follow the same shape:

```tsx
export function SectionName(): JSX.Element
```

`app/page.tsx` renders [`Nav`](#navtsx) (the sticky scroll-spy bar) followed by
`<main id="main-content">`, which contains six sections in order — **Hero,
About, Timeline, Projects, Skills, Contact** — and a small `$ exit 0` footer.

### Shared pattern

Except where noted, every section:

1. Calls [`useInView<HTMLElement>()`](../../lib/README.md#useinviewts) and
   attaches the returned `ref` to its `<section>` element.
2. Renders a terminal-style `<h2>` heading
   (e.g. `~/about $ cat bio.txt`).
3. Applies `cn("scroll-reveal", isInView && "visible")` to its content
   blocks, staggering siblings with inline
   `style={{ transitionDelay: \`${index * N}ms\` }}` (N = 50–100 ms
   per section).
4. Sources all content from [`lib/data.ts`](../../lib/README.md#datats) —
   sections contain no copy of their own.

Each `<section>` has an `id` (`about`, `timeline`, `projects`, `skills`,
`contact`) used for in-page anchors and by `Nav`'s scroll-spy;
`globals.css` gives these a `scroll-padding-top`/`scroll-margin-top` so anchor
jumps clear the sticky bar.

---

## `Hero.tsx`

The animated terminal intro. The most complex section — it does **not** use
`useInView` (it is above the fold) and has internal animation state.

### Internal (non-exported) helpers

| Name | Signature | Purpose |
| --- | --- | --- |
| `MathText` | `({ text }: { text: string }) => JSX.Element` | Splits `text` on `$…$` spans; renders math via `react-katex`'s `<InlineMath>`, everything else as plain spans |
| `Phase` | `type Phase = "prompt" \| "output"` | Which half of the current line is animating |
| `TerminalLine` | `(typeof heroTerminalLines)[number]` → `{ prompt: string; output: string }` | One scripted terminal exchange |
| `outputClasses` | `(index: number) => string` | Output text classes; line 0 (the name) is `text-text-primary`, later lines `text-accent-cyan` |
| `typedOutput` | `(line: TerminalLine) => string` | The exact multi-line string the output `TypeWriter` types — each line of `line.output` prefixed with `"> "` |
| `StaticPrompt` | `({ line }: { line: TerminalLine }) => JSX.Element` | Fully-rendered prompt row (`elijah@portfolio ~ <command>`); `line.prompt.slice(2)` strips the leading `"$ "` |
| `StaticOutput` | `({ line, index, withCursor?, plain? }: …) => JSX.Element` | Fully-rendered output; splits multi-line output on `\n`, prefixes each with `>`, pipes through `MathText` (or raw text when `plain`, to match the typed overlay exactly) |

### `Hero`

```tsx
export function Hero(): JSX.Element
```

**State:**

| State | Type | Meaning |
| --- | --- | --- |
| `lineIndex` | `number` | Index of the line currently animating |
| `phase` | `Phase` | Whether the prompt or the output of that line is typing |

**Animation flow:** `advancePhase()` is invoked from `TypeWriter`'s
`onComplete` (after a 200 ms pause post-prompt, 350 ms post-output). It
flips `phase` from `"prompt"` to `"output"`, then advances `lineIndex` and
resets to `"prompt"`, stopping after the last line (where a blinking
[`Cursor`](../terminal/README.md#cursortsx) remains). It uses the captured
`lineIndex` rather than a functional updater so it stays idempotent if Strict
Mode fires `onComplete` twice.

**Rendering strategy:** lines before `lineIndex` render statically; lines
after it render `invisible` (laid out but hidden) so the page height never
shifts; the current line renders a `TypeWriter` for the active phase and an
invisible static copy of the output (`plain` mode) while the prompt types.

**Accessibility:** the animated terminal is `aria-hidden="true"`; a parallel
`sr-only` block renders the first line's output as the page `<h1>` and the
rest as static paragraphs. The "scroll for more" arrow animates only under
`motion-safe`.

---

## `About.tsx`

```tsx
export function About(): JSX.Element
```

Renders `about.focusAreas` as a `<ul>` of badge chips followed by
`about.paragraphs` as `<p>` elements, all with the shared scroll-reveal
pattern (100 ms paragraph stagger). Heading: `~/about $ cat bio.txt`.

---

## `Timeline.tsx`

```tsx
export function Timeline(): JSX.Element
```

Unified work + education history, deep-link-free, rendered from
`timeline: TimelineEntry[]` ([`lib/data.ts`](../../lib/README.md#datats)). The
list is **newest-first** (hand-ordered in the data, not derived from
`period`). On `md+` screens it is a two-column layout around a center spine —
**education on the left, work on the right** — collapsing to a single
left-spine column on narrow screens. Each entry gets a connector line and a
type-colored dot (cyan = education, green = work). Heading:
`~/timeline $ cat history.log`.

The `<ol>` uses the array `index` as the React key: the list is static and
never reordered, and an index key avoids `org`+`period` collisions that could
bleed card state across rows. Each `<li>` carries the shared scroll-reveal
classes with a 100 ms stagger.

> **Legacy anchors:** two `aria-hidden` `<span id="experience">` /
> `<span id="education">` markers sit at the top of the section so old
> `#experience` / `#education` deep links still land here. (This component
> replaces the former separate `Experience.tsx` and `Education.tsx`.)

### Internal (non-exported) helpers

| Name | Signature | Purpose |
| --- | --- | --- |
| `CardHeader` | `({ type, period, children }: { type: TimelineEntry["type"]; period: string; children: ReactNode }) => JSX.Element` | Shared card header: a colored type kicker (`Education` cyan / `Experience` green) with the `period` anchored right, then the `<h3>` title row. The visible kicker carries the type for sighted and assistive-tech users alike, so no separate visually-hidden label is needed |
| `WorkCard` | `({ entry }: { entry: WorkEntry }) => JSX.Element` | Renders a `WorkEntry`: `CardHeader` (`type="work"`), `org`, and `description` |
| `EducationCard` | `({ entry }: { entry: EducationEntry }) => JSX.Element` | Renders an `EducationEntry`: `CardHeader` (`type="education"`) with optional `major`, the `org` and optional `gpa` row, and a collapsible coursework panel |

**Collapsible coursework:** `EducationCard` keeps a local
`showCoursework` boolean (`useState`, collapsed by default) toggled by a
button carrying `aria-expanded` / `aria-controls`. The course chips live
inside a shared [`Disclosure`](#disclosuretsx) keyed off a `useId()`-generated
id. This is purely local card state — unlike Projects/Skills it is **not**
URL-driven.

---

## `Projects.tsx`

```tsx
export function Projects(): JSX.Element
```

Accordion of project cards from `projects`, deep-linkable via the
`?project=<id>` query parameter. Heading: `~/projects $ ls -la`.

**The URL is the single source of truth.** There is no local toggle state:
expansion is derived directly from
[`useSearchParam("project")`](../../lib/README.md#usesearchparamts), and the
button writes via
[`setSearchParam`](../../lib/README.md#setsearchparam). Because
`useSearchParam` re-renders on URL changes (including browser back/forward),
deep links work on first load *and* after interaction.

**Derived value:**

| Name | Type | Meaning |
| --- | --- | --- |
| `urlProject` | `string \| null` | From `useSearchParam("project")` |
| `expandedProject` | `string \| null` | `urlProject` when it matches a known project id (`projects.some(p => p.id === urlProject)`); otherwise `null` |

**`toggleProject(id: string): void`** — calls
`setSearchParam("project", expandedProject === id ? null : id)`: collapses the
card if it is already the expanded one, otherwise opens it (one card open at a
time). `setSearchParam` performs the `replaceState` write that preserves the
rest of the query string and hash.

**Markup notes:** the toggle `<button>` carries `aria-expanded` and
`aria-controls`; the panel is a shared [`Disclosure`](#disclosuretsx)
(`id={\`project-panel-${project.id}\`}`) showing `description` and `tech`
badge chips.

---

## `Skills.tsx`

```tsx
export function Skills(): JSX.Element
```

Accordion of skill categories from `skills`, deep-linkable via
`?skills=<cat1>,<cat2>` (comma-separated category names; unknown names are
ignored). Multiple categories can be open simultaneously. Heading:
`~/skills $ ls -la`.

**The URL is the single source of truth** — same model as `Projects`, with no
local toggle state. Expansion derives from
[`useSearchParam("skills")`](../../lib/README.md#usesearchparamts) and writes
go through [`setSearchParam`](../../lib/README.md#setsearchparam).

**Derived value:**

| Name | Type | Meaning |
| --- | --- | --- |
| `urlSkills` | `string \| null` | From `useSearchParam("skills")` |
| `expandedCategories` | `Set<string>` | `useMemo` over `urlSkills`: the param split on `,` and filtered with `Object.hasOwn(skills, category)` so only real categories survive |

**`toggleCategory(category: string): void`** — clones
`expandedCategories`, adds/removes the category, then mirrors the new set into
the `skills` param via
`setSearchParam("skills", next.size > 0 ? Array.from(next).join(",") : null)`
(the param is deleted when the set is empty).

Same `aria-expanded` / `aria-controls` button and shared
[`Disclosure`](#disclosuretsx) panel as `Projects` (panel id derived from the
category name).

---

## `Contact.tsx`

```tsx
export function Contact(): JSX.Element
```

Closing section: social links, the contact form, and a sign-off line.
Heading: `~/contact $ cat links.txt`.

**Internal data:** a `links` array of
`{ label: string; href: string; icon: JSX.Element }` built from
`personalInfo` — GitHub, LinkedIn, Email (`mailto:` to `personalInfo.email`),
X, and Replit, each with an inline `aria-hidden` SVG icon. Non-email links
open in a new tab with `rel="noopener noreferrer"`.

Embeds [`TerminalForm`](../terminal/README.md#terminalformtsx) below the
links, then an `$ echo "Thanks for visiting!"` sign-off.

---

## `Nav.tsx`

> Lives at `components/Nav.tsx` (one level above this folder), but is
> documented here as it is the page-level chrome that ties these sections
> together.

```tsx
export function Nav(): JSX.Element
```

Sticky in-page section navigation rendered by `app/page.tsx` above `<main>`. A
const `SECTIONS` array (`about`, `timeline`, `projects`, `skills`, `contact`)
drives both the link list and the scroll-spy.

**Scroll-spy:** an `IntersectionObserver` watches the section elements through
a narrow active band (`rootMargin: "-15% 0px -55% 0px"`, ~15%–45% down the
viewport, just under the bar). The topmost intersecting section wins (a
tiebreak for the brief moment two cross the band), and its id is stored in
`active` state; the matching link gets `aria-current="true"` and the cyan
accent color. The bar itself is `position: sticky` with a backdrop blur and a
skip-style `~` link to `#main-content`.

---

## `Disclosure.tsx`

> Lives at `components/Disclosure.tsx`. Documented here because it is the
> shared collapsible panel used by `Projects`, `Skills`, and `Timeline`'s
> coursework.

```tsx
export function Disclosure({
  id,
  open,
  children,
}: {
  id: string;
  open: boolean;
  children: ReactNode;
}): JSX.Element
```

Renders the shared CSS grid `grid-rows-[0fr] → grid-rows-[1fr]` height
transition (`motion-reduce:transition-none`) plus the a11y wiring: it carries
the panel `id`, sets `aria-hidden={!open}` and `inert={!open}` so a collapsed
panel is out of the tab order and the accessibility tree. The trigger
`<button>` stays with each caller, which sets `aria-expanded` and
`aria-controls={id}`. This replaces the previously-duplicated grid-rows markup
in each accordion.
