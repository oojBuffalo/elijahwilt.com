# `components/terminal/` — Terminal UI Primitives

Reusable pieces of the terminal aesthetic: a blinking cursor, a typewriter
text animator, and the terminal-styled contact form.

---

## `Cursor.tsx`

### `Cursor`

```tsx
export function Cursor(): JSX.Element
```

**Parameters:** none.

**Returns:** an `aria-hidden` inline-block `<span>` styled as a solid
green terminal block cursor (`w-2.5 h-5 bg-accent-green`) blinking via the
global `.cursor-blink` class. Under `prefers-reduced-motion` the blink is
disabled and the cursor stays solid (handled in `globals.css`).

Used by `TypeWriter` (while typing) and `Hero` (after the last line).
A Server-Component-compatible file (no `"use client"` directive), though in
practice it renders inside client trees.

---

## `TypeWriter.tsx`

Client component that types out a string character by character.

### Props — `TypeWriterProps`

```ts
interface TypeWriterProps {
  text: string;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — (required) | The full string to type out |
| `delay` | `number` | `50` | Milliseconds between characters |
| `className` | `string` | `""` | Classes applied to the wrapping `<span>` |
| `showCursor` | `boolean` | `true` | Render a `Cursor` after the text while typing is in progress |
| `onComplete` | `() => void` | `undefined` | Invoked once when the full text has been rendered |

### `TypeWriter`

```tsx
export function TypeWriter(props: TypeWriterProps): JSX.Element
```

**Returns:** a `<span>` containing the typed-so-far prefix of `text`, plus a
`Cursor` while incomplete (if `showCursor`).

**Behavior:**
- The animation effect resets `displayedText` to `""` and `isComplete` to
  `false` at the start, then a `setInterval` (every `delay` ms) extends the
  displayed slice one character at a time; on the final character it clears
  the interval, marks complete, and calls `onComplete`. The slice is built by
  stepping over Unicode code points (`Array.from(text)`), not UTF-16 units, so
  an emoji never renders as a lone surrogate mid-animation.
- **Reduced motion:** if `prefers-reduced-motion: reduce` matches at mount,
  the full text renders immediately and `onComplete` fires synchronously in
  the effect — no animation.
- The animation effect's dependency array is `[text, delay]`. `onComplete` is
  kept in a ref (`onCompleteRef`, refreshed by a separate effect each render)
  and invoked through that ref, so passing a new `onComplete` identity (as
  `Hero` does with inline arrows) does **not** re-run the effect or restart
  typing — only a changed `text` or `delay` restarts the animation from empty.
- The interval is cleared on unmount via the effect cleanup.

---

## `TerminalForm.tsx`

The contact form, styled as an interactive shell session. Client component;
submits through the [`sendContactEmail`](../../app/actions/contact.md)
Server Action.

### Module constants

| Constant | Type | Description |
| --- | --- | --- |
| `FIELD_ORDER` | `readonly ["name", "email", "message"]` | Field precedence used to pick which invalid field receives focus |

### `TerminalForm`

```tsx
export function TerminalForm(): JSX.Element
```

**Parameters:** none.

**Hooks & state:**

| Name | Type | Description |
| --- | --- | --- |
| `state` | `ContactFormState` | Latest action result (`null` before first submit) |
| `formAction` | `(formData: FormData) => void` | Action passed to `<form action={…}>` |
| `isPending` | `boolean` | True while a submission is in flight |
| `formRef` | `RefObject<HTMLFormElement>` | Used for reset and focus management |

`useActionState<ContactFormState, FormData>(sendContactEmail, null)` wires
the form to the Server Action with `null` as initial state.

**Effect (runs on `state` change):**
- On success: `formRef.current?.reset()` clears the fields.
- On validation errors: focuses the first invalid field in `FIELD_ORDER`
  order by querying `#contact-<field>`.

**Internal helpers:**

| Helper | Signature | Purpose |
| --- | --- | --- |
| `fieldError` | `(field: keyof ContactFieldErrors) => JSX.Element \| null` | Renders the field's error `<p id="contact-<field>-error">` or nothing |
| `fieldA11yProps` | `(field: keyof ContactFieldErrors) => { "aria-invalid": true \| undefined; "aria-describedby": string \| undefined }` | Spread onto inputs; links each invalid control to its error text |

**Form structure:**
- Fields `name` (`<input type="text">`), `email` (`<input type="email">`,
  `spellCheck={false}`), `message` (`<textarea rows={4}>`). All are
  `required` (native validation runs before the action), labeled via
  `htmlFor`/`id` (`contact-name`, `contact-email`, `contact-message`), carry
  `autoComplete` where applicable, and are disabled while `isPending`.
- The name/email rows end in a decorative blinking `_` (aria-hidden).
- Submit button shows `sending…` while pending and is disabled.
- Status line: an **always-mounted** `role="status"` / `aria-live="polite"`
  container (`min-h-6` to reserve space) that renders `state.message` in
  green on success, red on failure — always-mounted so screen readers
  announce async results.
