"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientIfConfigured } from "@/lib/supabase/client";
import { cn, btnPrimary, focusRing, tapTarget } from "@/lib/cn";

interface RegisterFormProps {
  nextPath?: string;
}

export function RegisterForm({ nextPath }: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const destination = nextPath && nextPath.startsWith("/") ? nextPath : "/account/membership/new";

  useEffect(() => {
    const supabase = createClientIfConfigured();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/account");
    });
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
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

    setMessage("Account created. Check your email if confirmation is required, then sign in.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink"
        />
      </div>
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="register-password"
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
      {message ? <p className="text-sm text-ink-muted">{message}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className={cn(btnPrimary, focusRing, tapTarget, "w-full rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-60")}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
      <p className="text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:text-brand-hover">
          Member login
        </Link>
      </p>
    </form>
  );
}
