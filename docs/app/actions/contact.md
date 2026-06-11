# `app/actions/contact.ts` — Contact-Form Server Action

A React 19 / Next.js Server Action (`"use server"`) that validates the
contact form and relays the message by email via
[Resend](https://resend.com). Consumed by
[`TerminalForm`](../../components/terminal/README.md#terminalformtsx) through
`useActionState`.

## Module-level state

| Constant | Type | Description |
| --- | --- | --- |
| `resend` | `Resend` | Resend client constructed once at module load from `process.env.RESEND_API_KEY` |

**Environment:** `RESEND_API_KEY` must be set at runtime for sends to
succeed. The module still loads without it; sends then fail and surface the
generic error message.

## Exported types

### `ContactFieldErrors`

Per-field validation messages. A field key is present only when that field
failed validation.

```ts
export type ContactFieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};
```

### `ContactFormState`

The action's result state, shaped for `useActionState`. `null` is the
initial state (no submission yet).

```ts
export type ContactFormState = {
  success: boolean;
  message: string;            // human-readable status line shown in the form
  errors?: ContactFieldErrors; // present only on validation failure
} | null;
```

## Functions

### `sendContactEmail`

```ts
export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState>
```

| Parameter | Type | Description |
| --- | --- | --- |
| `_prevState` | `ContactFormState` | Previous action state from `useActionState`; unused (required by the `useActionState` action signature) |
| `formData` | `FormData` | Submitted form data; reads string fields `name`, `email`, `message` |

**Returns:** `Promise<ContactFormState>` — never `null`; always a result
object:

| Outcome | `success` | `message` | `errors` |
| --- | --- | --- | --- |
| Validation failure | `false` | `"Error: fix the highlighted fields and resubmit"` | per-field messages |
| Resend API returned an error | `false` | `"Error: message failed to send — try again or email <personalInfo.email> directly"` | — |
| Thrown exception (network, etc.) | `false` | `"Error: something went wrong — try again or email <personalInfo.email> directly"` | — |
| Sent | `true` | `"Message sent successfully!"` | — |

**Validation rules** (each field is trimmed first; missing fields are
treated as empty strings):

| Field | Rule | Error message |
| --- | --- | --- |
| `name` | non-empty | `"name is required"` |
| `email` | non-empty | `"email is required"` |
| `email` | matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | `"enter a valid email address, e.g. you@example.com"` |
| `message` | non-empty | `"message is required"` |

All failing fields are collected into `errors` in one pass, so the form can
highlight every problem at once.

**Email composition** (on validation pass):

- **From:** `Contact Form <contact@elijahwilt.com>`
- **To:** `elijahwilt@gmail.com`, `wilt.83@osu.edu`, `ew356@cornell.edu`
- **Reply-To:** the submitter's email
- **Subject:** `` `Contact from ${name} via elijahwilt.com` ``
- **Body:** plain-text and HTML variants; the HTML variant converts message
  newlines to `<br>`.

**Side effects:** sends one email via the Resend API; logs Resend errors and
caught exceptions with `console.error`. Failure messages embed
`personalInfo.email` from [`lib/data.ts`](../../lib/README.md#datats) as a
fallback contact route.

> **Note:** submitted `name`/`message` values are interpolated into the HTML
> email body without HTML-escaping. The email is only delivered to the site
> owner's inboxes, but treat this as a known limitation if the recipients or
> template ever change.
