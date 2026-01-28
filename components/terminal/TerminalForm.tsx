"use client";

import { useActionState, useRef, useEffect } from "react";
import { sendContactEmail, type ContactFormState } from "@/app/actions/contact";

export function TerminalForm() {
  const [state, formAction, isPending] = useActionState<
    ContactFormState,
    FormData
  >(sendContactEmail, null);

  const formRef = useRef<HTMLFormElement>(null);

  // Reset form on successful submission
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="font-mono space-y-4">
      {/* Command prompt */}
      <div className="text-text-secondary">
        <span className="text-accent-green">$</span> send-message
      </div>

      {/* Name field */}
      <div className="flex items-center gap-2">
        <span className="text-accent-green">&gt;</span>
        <span className="text-text-secondary">name:</span>
        <input
          type="text"
          name="name"
          required
          disabled={isPending}
          className="flex-1 bg-transparent border-none outline-none text-accent-cyan placeholder:text-text-secondary/50 caret-accent-cyan"
          placeholder="your name"
          autoComplete="name"
        />
        <span className="cursor-blink text-accent-cyan">_</span>
      </div>

      {/* Email field */}
      <div className="flex items-center gap-2">
        <span className="text-accent-green">&gt;</span>
        <span className="text-text-secondary">email:</span>
        <input
          type="email"
          name="email"
          required
          disabled={isPending}
          className="flex-1 bg-transparent border-none outline-none text-accent-cyan placeholder:text-text-secondary/50 caret-accent-cyan"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <span className="cursor-blink text-accent-cyan">_</span>
      </div>

      {/* Message field */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-accent-green">&gt;</span>
          <span className="text-text-secondary">message:</span>
        </div>
        <div className="pl-4">
          <textarea
            name="message"
            required
            disabled={isPending}
            rows={4}
            className="w-full bg-transparent border border-border rounded px-3 py-2 text-accent-cyan placeholder:text-text-secondary/50 caret-accent-cyan resize-none focus:border-accent-cyan transition-colors"
            placeholder="What's on your mind?"
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="flex items-center gap-2">
        <span className="text-accent-green">$</span>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-1 border border-border rounded bg-bg-primary text-text-primary hover:border-accent-cyan hover:text-accent-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "sending..." : "submit"}
        </button>
      </div>

      {/* Status message */}
      {state && (
        <div className="flex items-center gap-2">
          <span className="text-accent-green">&gt;</span>
          <span className={state.success ? "text-accent-green" : "text-red-400"}>
            {state.message}
          </span>
        </div>
      )}
    </form>
  );
}
