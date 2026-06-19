"use client";

import { useActionState, useRef, useEffect } from "react";
import {
  sendContactEmail,
  type ContactFieldErrors,
  type ContactFormState,
} from "@/app/actions/contact";

const FIELD_ORDER = ["name", "email", "message"] as const;

export function TerminalForm() {
  const [state, formAction, isPending] = useActionState<
    ContactFormState,
    FormData
  >(sendContactEmail, null);

  const formRef = useRef<HTMLFormElement>(null);

  // Reset on success; move focus to the first invalid field on errors
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    } else if (state?.errors) {
      const errors = state.errors;
      const first = FIELD_ORDER.find((field) => errors[field]);
      if (first) {
        formRef.current
          ?.querySelector<HTMLElement>(`#contact-${first}`)
          ?.focus();
      }
    }
  }, [state]);

  const fieldError = (field: keyof ContactFieldErrors) => {
    const error = state?.errors?.[field];
    if (!error) return null;
    return (
      <p id={`contact-${field}-error`} className="pl-6 text-sm text-red-400">
        {error}
      </p>
    );
  };

  const fieldA11yProps = (field: keyof ContactFieldErrors) => ({
    "aria-invalid": state?.errors?.[field] ? true : undefined,
    "aria-describedby": state?.errors?.[field]
      ? `contact-${field}-error`
      : undefined,
  });

  return (
    <form ref={formRef} action={formAction} className="font-mono space-y-4">
      {/* Command prompt */}
      <div className="text-text-secondary">
        <span className="text-accent-green">$</span> send-message
      </div>

      {/* Name field */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-accent-green" aria-hidden="true">
            &gt;
          </span>
          <label htmlFor="contact-name" className="text-text-secondary">
            name:
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            disabled={isPending}
            className="flex-1 bg-transparent border-none text-accent-cyan placeholder:text-text-secondary/50 caret-accent-cyan"
            placeholder="your name…"
            autoComplete="name"
            {...fieldA11yProps("name")}
          />
          <span className="cursor-blink text-accent-cyan" aria-hidden="true">
            _
          </span>
        </div>
        {fieldError("name")}
      </div>

      {/* Email field */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-accent-green" aria-hidden="true">
            &gt;
          </span>
          <label htmlFor="contact-email" className="text-text-secondary">
            email:
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            disabled={isPending}
            spellCheck={false}
            className="flex-1 bg-transparent border-none text-accent-cyan placeholder:text-text-secondary/50 caret-accent-cyan"
            placeholder="your email…"
            autoComplete="email"
            {...fieldA11yProps("email")}
          />
          <span className="cursor-blink text-accent-cyan" aria-hidden="true">
            _
          </span>
        </div>
        {fieldError("email")}
      </div>

      {/* Message field */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-accent-green" aria-hidden="true">
            &gt;
          </span>
          <label htmlFor="contact-message" className="text-text-secondary">
            message:
          </label>
        </div>
        <div className="pl-4">
          <textarea
            id="contact-message"
            name="message"
            required
            disabled={isPending}
            rows={4}
            className="w-full bg-transparent border border-border rounded px-3 py-2 text-accent-cyan placeholder:text-text-secondary/50 caret-accent-cyan resize-none focus:border-accent-cyan transition-colors"
            placeholder="What’s on your mind…"
            {...fieldA11yProps("message")}
          />
        </div>
        {fieldError("message")}
      </div>

      {/* Submit button */}
      <div className="flex items-center gap-2">
        <span className="text-accent-green">$</span>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-1 border border-border rounded bg-bg-primary text-text-primary hover:border-accent-cyan hover:text-accent-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "sending…" : "send message"}
        </button>
      </div>

      {/* Status — always-mounted live region so async results are announced */}
      <div role="status" aria-live="polite" className="min-h-6">
        {state && (
          <div className="flex items-center gap-2">
            <span className="text-accent-green" aria-hidden="true">
              &gt;
            </span>
            <span
              className={state.success ? "text-accent-green" : "text-red-400"}
            >
              {state.message}
            </span>
          </div>
        )}
      </div>
    </form>
  );
}
