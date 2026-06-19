# `lib/` — Utilities, Hooks, and Site Data

Four small modules: a class-name helper, the site's content data, and two
client hooks.

---

## `cn.ts`

### `cn`

```ts
export function cn(...inputs: ClassValue[]): string
```

| Parameter | Type | Description |
| --- | --- | --- |
| `...inputs` | `ClassValue[]` (from `clsx`) | Any mix of strings, arrays, objects, falsy values |

**Returns:** `string` — the inputs flattened by `clsx` (dropping falsy
entries), then deduplicated by `tailwind-merge` so conflicting Tailwind
utilities resolve to the last one (e.g. `cn("p-2", "p-4")` → `"p-4"`).

The standard conditional-class idiom throughout the components:
`cn("scroll-reveal", isInView && "visible")`.

---

## `data.ts`

All site content as plain typed constants — no functions. Components import
exactly the slices they render, so copy edits happen here, not in JSX.
Types below are the inferred shapes unless an explicit `interface`/`type` is
exported (the timeline entries are).

### `personalInfo`

```ts
export const personalInfo: {
  name: string;      // "Elijah Wayne Wilt"
  title: string;     // newline-separated role lines
  tagline: string;
  subtitle: string;  // newline-separated education lines
  email: string;     // primary (Cornell) — used for mailto link & error-message fallback
  email2: string;    // OSU
  email3: string;    // Wilt Technologies
  github: string;    // profile URLs…
  replit: string;
  linkedin: string;
  x: string;
}
```

Multi-line values (`title`, `subtitle`) use embedded `\n`; `Hero` splits on
newlines when rendering. Consumed by `Hero` (via `heroTerminalLines`),
`Contact`, and the Server Action's failure messages.

### `heroTerminalLines`

```ts
export const heroTerminalLines: { prompt: string; output: string }[]
```

The Hero's scripted terminal session — four entries (`$ whoami`,
`$ cat role.txt`, `$ cat education.txt`, `$ cat tagline.txt`) whose outputs
are drawn from `personalInfo`. Prompts include the literal `"$ "` prefix;
`Hero` strips it (`prompt.slice(2)`) and renders its own prompt decoration.
Output text may contain `$…$` LaTeX spans, rendered by `Hero`'s `MathText`.

### `about`

```ts
export const about: { focusAreas: string[]; paragraphs: string[] }
```

`focusAreas` is a short list of headline domains; `paragraphs` is the bio
copy (2 paragraphs).

### `skills`

```ts
export const skills: Record<
  "Programming Languages" | "Libraries & Frameworks" | "Tools & Technologies" | "Hardware",
  string[]
>
```

Four categories of skill names. Category keys double as the values of the
`?skills=` deep-link parameter in `Skills.tsx` (which validates an incoming
value with `Object.hasOwn(skills, category)` before treating it as expanded).

### `projectTree` and project types

```ts
export type ProjectType =
  | "Computer Vision" | "NLP" | "Machine Learning" | "Software" | "Hardware";
export type ProjectStatus = "shipped" | "wip" | "archived";

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  tech: string[];
  type: ProjectType;
  repo?: string;
  status?: ProjectStatus;
  todo?: boolean;
}

export interface ProjectDir {
  id: string;
  name: string;
  projects: Project[];
}

export interface ProjectCategory {
  id: "coursework" | "professional" | "personal";
  name: string;
  dirs?: ProjectDir[];
  projects?: Project[];
}

export const projectTree: ProjectCategory[]
```

The explorer hierarchy groups the five real projects under coursework,
professional, and personal categories. `todo` entries render as noninteractive
“coming soon” placeholders and are excluded from deep-link validation.

### `timeline` and the `TimelineEntry` types

A single unified work-and-education history replaces the former separate
`experience` and `education` exports. The shapes are exported explicitly:

```ts
interface TimelineEntryBase {
  title: string;   // job title or degree name
  org: string;     // company or institution
  period: string;  // human-readable range, e.g. "2024 – Present"
}

export interface WorkEntry extends TimelineEntryBase {
  type: "work";
  description: string;
}

export interface EducationEntry extends TimelineEntryBase {
  type: "education";
  major?: string;       // field of study, rendered under the degree
  gpa?: string;
  coursework: string[];
}

export type TimelineEntry = WorkEntry | EducationEntry;

export const timeline: TimelineEntry[]
```

The `type` field discriminates the union: `Timeline.tsx` switches on it to
render a `WorkCard` or an `EducationCard`. Both kinds share the base fields
(`title`, `org`, `period`). `WorkEntry` adds `description`; `EducationEntry`
adds optional `major`/`gpa` and a required `coursework` list (rendered in a
collapsible `Disclosure`).

`timeline` is ordered newest-first by hand (not derived from `period`, to
avoid parsing fuzzy ranges like `"Jun – Dec 2019"`). It currently holds five
entries spanning OSU post-baccalaureate coursework, Wilt Technologies, the
Cornell B.S., and two earlier internships. Because `major`/`gpa` are optional
on the union, consumers must handle `undefined`.

---

## `useInView.ts`

Client hook wrapping `IntersectionObserver` for scroll-reveal animations.

### Options — `UseInViewOptions`

```ts
interface UseInViewOptions {
  threshold?: number;    // default 0.1 — fraction of the element that must be visible
  rootMargin?: string;   // default "0px" — observer root margin
  triggerOnce?: boolean; // default true — latch on first intersection
}
```

### `useInView`

```ts
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: UseInViewOptions
): { ref: RefObject<T | null>; isInView: boolean }
```

| Type parameter | Default | Description |
| --- | --- | --- |
| `T` | `HTMLDivElement` | Element type the ref will be attached to (sections pass `HTMLElement`) |

**Returns:**

| Field | Type | Description |
| --- | --- | --- |
| `ref` | `RefObject<T \| null>` | Attach to the element to observe |
| `isInView` | `boolean` | `false` initially; `true` once the element intersects |

**Behavior:** creates one `IntersectionObserver` per mount (re-created if
`threshold`, `rootMargin`, or `triggerOnce` change). With `triggerOnce`
(the default) the element is unobserved after first intersection, so
`isInView` latches `true`; with `triggerOnce: false` it toggles back to
`false` when the element leaves the viewport. The observer is disconnected
on cleanup. If `ref` is not attached to an element, the effect no-ops.

---

## `useSearchParam.ts`

Client utilities for reading and writing query-string parameters
SSR-safely. The URL query param is the single source of truth for the
deep-linkable expanded state in `Projects` and `Skills`.

### `useSearchParam`

```ts
export function useSearchParam(name: string): string | null
```

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | The query parameter to read |

**Returns:** the parameter's current value, or `null` if absent — and
always `null` during SSR and the hydration render (the server snapshot),
which prevents hydration mismatches for URL-dependent UI.

**Behavior:** implemented with `useSyncExternalStore`, it is **reactive**.
The `subscribe` function listens for the browser `popstate` event
(back/forward navigation) **and** a custom `"app:searchparamchange"` event,
so the hook re-renders whenever the URL changes — including in-app writes via
`setSearchParam`/`setSearchParams`, which `history.replaceState` would otherwise not surface
(replaceState/pushState don't emit `popstate`). The store snapshot reads
`window.location.search` fresh; the server snapshot is always `null`. Because
the hook tracks the live URL, deep links work after the first interaction and
across back/forward, so callers do **not** keep any separate local copy of
the expanded state — they derive it directly from this value (e.g. `Skills`
memoizes a `Set` keyed on the returned string).

An alternative is Next's `useSearchParams`, which requires a `<Suspense>`
boundary; this hook deliberately avoids that while still re-rendering on
navigation.

### `setSearchParam`

```ts
export function setSearchParam(name: string, value: string | null): void
```

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | The query parameter to set or clear |
| `value` | `string \| null` | The new value; `null` (or empty string) deletes the param |

Sets or clears a single query parameter in place via
`history.replaceState` (so it does not spam the history stack), preserving
the rest of the query string and the URL hash. It then dispatches the
`"app:searchparamchange"` event so every `useSearchParam` subscriber
re-renders. This is the write side of the source-of-truth pattern: `Projects`
and `Skills` call it to expand/collapse, and read the result back through
`useSearchParam`.

### `setSearchParams`

```ts
export function setSearchParams(
  updates: Record<string, string | null>
): void
```

Applies several set/delete operations to one `URLSearchParams` snapshot, writes
the URL once with `history.replaceState`, then dispatches one change event.
`ProjectsExplorer` uses it to keep `project` and `dirs` synchronized atomically.
