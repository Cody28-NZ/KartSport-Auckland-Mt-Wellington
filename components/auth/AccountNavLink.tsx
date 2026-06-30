"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClientIfConfigured } from "@/lib/supabase/client";
import { cn, focusRing } from "@/lib/cn";

export function AccountNavLink({ className, onDark = true }: { className?: string; onDark?: boolean }) {
  const [label, setLabel] = useState("Member login");
  const [href, setHref] = useState("/login");

  useEffect(() => {
    const supabase = createClientIfConfigured();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setLabel("Account");
        setHref("/account");
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setLabel("Account");
        setHref("/account");
      } else {
        setLabel("Member login");
        setHref("/login");
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
        focusRing,
        onDark ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-ink-muted hover:text-brand",
        className,
      )}
    >
      {label}
    </Link>
  );
}
