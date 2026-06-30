"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckYourEmailPanel } from "@/components/auth/CheckYourEmailPanel";
import { buildAuthCallbackUrl, getSafeNextPath } from "@/lib/auth/safe-redirect";
import { createClientIfConfigured } from "@/lib/supabase/client";
import { cn, btnPrimary, focusRing, tapTarget } from "@/lib/cn";

interface RegisterFormProps {
  nextPath?: string;
  submitLabel?: string;
  loginHref?: string;
  emailInputId?: string;
  passwordInputId?: string;
  embedded?: boolean;
  onAwaitingEmailConfirmation?: () => void;
  showInlineSuccess?: boolean;
}

export function RegisterForm({
  nextPath,
  submitLabel = "Create account",
  loginHref = "/login",
  emailInputId = "register-email",
  passwordInputId = "register-password",
  embedded = false,
  onAwaitingEmailConfirmation,
  showInlineSuccess = true,
}: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const destination = getSafeNextPath(nextPath, "/account/membership/new");

  const inputClass = embedded
    ? "mt-1.5 w-full rounded-xl border border-border bg-surface-alt/40 px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-brand/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15"
    : "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink";

  const labelClass = "block text-sm font-medium text-ink";
  const formSpacing = embedded ? "space-y-5" : "space-y-4";
  const buttonClass = embedded
    ? cn(btnPrimary, focusRing, tapTarget, "w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-60")
    : cn(btnPrimary, focusRing, tapTarget, "w-full rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-60");

  useEffect(() => {
    const supabase = createClientIfConfigured();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(destination);
    });
  }, [router, destination]);

  function handleAwaitingConfirmation() {
    setAwaitingConfirmation(true);
    onAwaitingEmailConfirmation?.();
  }

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

    const emailRedirectTo = buildAuthCallbackUrl(window.location.origin, destination);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    });
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

    handleAwaitingConfirmation();
  }

  if (awaitingConfirmation && showInlineSuccess) {
    return <CheckYourEmailPanel loginHref={loginHref} />;
  }

  if (awaitingConfirmation && !showInlineSuccess) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className={formSpacing}>
      <div>
        <label htmlFor={emailInputId} className={labelClass}>
          Email
        </label>
        <input
          id={emailInputId}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={passwordInputId} className={labelClass}>
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
          className={inputClass}
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Creating account..." : submitLabel}
      </button>
      <p className="text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href={loginHref} className={cn("font-medium text-brand hover:text-brand-hover", focusRing)}>
          Member login
        </Link>
      </p>
    </form>
  );
}
