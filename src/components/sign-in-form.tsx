"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiError, requestMagicLink } from "@/lib/api";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; message: string }
  | { kind: "error"; message: string };

export interface SignInFormProps {
  /** Narrower layout for the dashboard sidebar. */
  compact?: boolean;
}

export function SignInForm({ compact }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState({ kind: "sending" });
    try {
      const result = await requestMagicLink(email.trim());
      setState({ kind: "sent", message: result.message });
    } catch (error) {
      setState({
        kind: "error",
        message:
          error instanceof ApiError
            ? error.message
            : "Could not reach the server. Try again.",
      });
    }
  };

  if (state.kind === "sent") {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-lg)] bg-success-wash px-4 py-3.5"
      >
        <p className="text-[15px] font-semibold text-success-text">
          Check your email
        </p>
        <p className="mt-1 text-[14px] text-text-secondary">{state.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate={false}>
      <label
        htmlFor="signin-email"
        className="block text-[14px] font-semibold text-text-secondary"
      >
        Email address
      </label>
      <div className={compact ? "mt-2" : "mt-2 flex flex-col gap-2.5 sm:flex-row"}>
        <input
          id="signin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@studio.com"
          aria-describedby="signin-help"
          aria-invalid={state.kind === "error"}
          className="h-12 w-full rounded-[var(--radius-md)] bg-white px-3.5 text-[16px] shadow-[inset_0_0_0_1px_var(--border-strong)] transition-shadow placeholder:text-text-tertiary focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--accent)] sm:flex-1"
        />
        <Button
          type="submit"
          size="lg"
          disabled={state.kind === "sending" || email.trim().length === 0}
        >
          {state.kind === "sending" ? "Sending…" : "Send magic link"}
        </Button>
      </div>

      <p id="signin-help" className="mt-2.5 text-[13.5px] text-text-tertiary">
        No password. We email you a one-time sign-in link.
      </p>

      {state.kind === "error" && (
        <p role="alert" className="mt-2.5 text-[14px] text-error">
          {state.message}
        </p>
      )}
    </form>
  );
}
