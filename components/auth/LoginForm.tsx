"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientIfConfigured } from "@/lib/supabase/client";
import { cn, btnPrimary, focusRing, tapTarget } from "@/lib/cn";

interface LoginFormProps {
  nextPath?: string;
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const destination = nextPath && nextPath.startsWith("/") ? nextPath : "/account";

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
    setLoading(true);

    const supabase = createClientIfConfigured();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(destination);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
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
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-sm text-ink-muted">
        New to the club?{" "}
        <Link href="/become-a-member" className="font-medium text-brand hover:text-brand-hover">
          Become a member
        </Link>
      </p>
    </form>
  );
}
