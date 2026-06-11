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
Types below are the inferred shapes.

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
export const about: { paragraphs: string[] }  // 3 bio paragraphs
```

### `skills`

```ts
export const skills: Record<
  "Programming Languages" | "Libraries & Frameworks" | "Tools & Technologies" | "Hardware",
  string[]
>
```

Four categories of skill names. Category keys double as the values of the
`?skills=` deep-link parameter in `Skills.tsx`.

### `projects`

```ts
export const projects: {
  id: string;          // stable slug; the ?project= deep-link value
  title: string;
  summary: string;     // one-liner shown collapsed
  description: string; // full text shown expanded
  tech: string[];      // badge chips
  type: string;        // category tag: "Computer Vision" | "NLP" | "Software" | "Hardware"
}[]
```

Five entries: `cottonweed`, `twitter-nlp`, `sudoku-sat`, `photogrammetry`,
`cnc-router`.

### `experience`

```ts
export const experience: {
  title: string;       // role
  company: string;
  period: string;      // human-readable range, e.g. "2021 – 2024"
  description: string;
}[]
```

Four entries, most recent first.

### `education`

```ts
export const education: {
  degree: string;
  institution: string;
  period: string;
  gpa?: string;         // OSU entry only
  coursework: string[];
  current?: string[];   // in-progress courses — OSU entry only; not rendered by Education.tsx
}[]
```

Two entries (OSU graduate studies, Cornell B.S.). `gpa` and `current` exist
only on the first entry; TypeScript infers them as optional on the union, so
consumers must handle `undefined`.

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

Client hook for reading a single query-string parameter SSR-safely.

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

**Behavior & caveats:** implemented with `useSyncExternalStore` and a no-op
`subscribe`, so it reads `window.location.search` fresh on every render but
**does not re-render on URL changes** (e.g. `history.replaceState` or
back/forward). Callers that mutate the URL — `Projects` and `Skills` — track
the user's choice in their own state and treat this hook's value only as the
initial deep-link, so staleness after the first interaction is by design.
An alternative is Next's `useSearchParams`, which requires a `<Suspense>`
boundary and re-renders on navigation; this hook deliberately avoids both.
