"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientIfConfigured } from "@/lib/supabase/client";
import { cn, btnPrimary, focusRing, tapTarget } from "@/lib/cn";

interface RegisterFormProps {
  nextPath?: string;
  submitLabel?: string;
  loginHref?: string;
  emailInputId?: string;
  passwordInputId?: string;
}

export function RegisterForm({
  nextPath,
  submitLabel = "Create account",
  loginHref = "/login",
  emailInputId = "register-email",
  passwordInputId = "register-password",
}: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const destination = nextPath && nextPath.startsWith("/") ? nextPath : "/account/membership/new";

  useEffect(() => {
    const supabase = createClientIfConfigured();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(destination);
    });
  }, [router, destination]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setAwaitingConfirmation(false);
    setLoading(true);

    const supabase = createClientIfConfigured();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push(destination);
      router.refresh();
      return;
    }

    setAwaitingConfirmation(true);
  }

  if (awaitingConfirmation) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-ink-muted">
          Account created. Please check your email to confirm your account, then log in to continue your membership
          application.
        </p>
        <Link
          href={loginHref}
          className={cn(btnPrimary, focusRing, tapTarget, "inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium")}
        >
          Member login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={emailInputId} className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id={emailInputId}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink"
        />
      </div>
      <div>
        <label htmlFor={passwordInputId} className="block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id={passwordInputId}
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink"
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className={cn(btnPrimary, focusRing, tapTarget, "w-full rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-60")}
      >
        {loading ? "Creating account..." : submitLabel}
      </button>
      <p className="text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href={loginHref} className={cn("font-medium text-brand hover:text-brand-hover", focusRing)}>
          Member login
        </Link>
      </p>
    </form>
  );
}
