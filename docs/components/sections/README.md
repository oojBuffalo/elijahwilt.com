# `components/sections/` — Page Sections

The seven full-width sections composed by `app/page.tsx`. All are
**client components** (`"use client"`), all are **zero-prop**, and all
follow the same shape:

```tsx
export function SectionName(): JSX.Element
```

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

Each `<section>` has an `id` (`about`, `projects`, `skills`, `experience`,
`education`, `contact`) used for in-page anchors; `globals.css` gives these a
`scroll-margin-top`.

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
| `StaticPrompt` | `({ line }: { line: TerminalLine }) => JSX.Element` | Fully-rendered prompt row (`elijah@portfolio ~ <command>`); `line.prompt.slice(2)` strips the leading `"$ "` |
| `StaticOutput` | `({ line, index }: { line: TerminalLine; index: number }) => JSX.Element` | Fully-rendered output; splits multi-line output on `\n`, prefixes each with `>`, pipes through `MathText` |

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
[`Cursor`](../terminal/README.md#cursortsx) remains).

**Rendering strategy:** lines before `lineIndex` render statically; lines
after it render `invisible` (laid out but hidden) so the page height never
shifts; the current line renders a `TypeWriter` for the active phase and an
invisible static copy of the output while the prompt types.

**Accessibility:** the animated terminal is `aria-hidden="true"`; a parallel
`sr-only` block renders the first line's output as the page `<h1>` and the
rest as static paragraphs. The "scroll for more" arrow animates only under
`motion-safe`.

---

## `About.tsx`

```tsx
export function About(): JSX.Element
```

Renders `about.paragraphs` as `<p>` elements with the shared scroll-reveal
pattern (100 ms stagger). Heading: `~/about $ cat bio.txt`.

---

## `Projects.tsx`

```tsx
export function Projects(): JSX.Element
```

Accordion of project cards from `projects`, deep-linkable via the
`?project=<id>` query parameter. Heading: `~/projects $ ls -la`.

**State & derived values:**

| Name | Type | Meaning |
| --- | --- | --- |
| `urlProject` | `string \| null` | From [`useSearchParam("project")`](../../lib/README.md#usesearchparamts) |
| `userProject` | `string \| null \| undefined` | User's explicit toggle choice; `undefined` = untouched, `null` = explicitly collapsed |
| `expandedProject` | `string \| null` | `userProject` if the user has toggled; otherwise `urlProject` when it matches a known project id; otherwise `null` |

**`toggleProject(id: string): void`** — collapses the card if already
expanded, otherwise expands it (one card open at a time). Syncs the URL with
`window.history.replaceState`, setting or deleting the `project` query
parameter while preserving the rest of the query string and hash.

**Markup notes:** the toggle `<button>` carries `aria-expanded`; expansion
animates via the CSS grid `grid-rows-[0fr] → grid-rows-[1fr]` trick with
`motion-reduce:transition-none`. The expanded panel shows `description` and
`tech` badge chips.

---

## `Skills.tsx`

```tsx
export function Skills(): JSX.Element
```

Accordion of skill categories from `skills`, deep-linkable via
`?skills=<cat1>,<cat2>` (comma-separated category names; unknown names are
ignored). Multiple categories can be open simultaneously. Heading:
`~/skills $ ls -la`.

**State & derived values:**

| Name | Type | Meaning |
| --- | --- | --- |
| `urlSkills` | `string \| null` | From `useSearchParam("skills")` |
| `userCategories` | `Set<string> \| null` | User's explicit selection; `null` until first toggle |
| `expandedCategories` | `Set<string>` | `userCategories` if set, else the URL value parsed and filtered to keys of `skills` |

**`toggleCategory(category: string): void`** — adds/removes the category
from the set and mirrors the new set into the `skills` query parameter
(deleted when empty) via `history.replaceState`, preserving other query
params and the hash.

Same `aria-expanded` / grid-rows expansion markup as `Projects`.

---

## `Experience.tsx`

```tsx
export function Experience(): JSX.Element
```

Vertical timeline of `experience` entries — absolute-positioned line and a
green dot per entry — each rendering title, period, company, and
description with the shared scroll-reveal pattern (100 ms stagger).
Heading: `~/experience $ cat timeline.log`.

---

## `Education.tsx`

```tsx
export function Education(): JSX.Element
```

Card per `education` entry showing degree, institution, period, optional
GPA, and `coursework` as badge chips. Heading:
`~/education $ cat degrees.txt`.

> **Note:** the data's optional `current` field (in-progress coursework) is
> **not rendered** by this component — only `coursework` is shown.

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
