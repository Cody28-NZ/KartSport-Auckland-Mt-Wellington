import { cn, cardBase } from "@/lib/cn";

interface SupabaseSetupNoticeProps {
  className?: string;
}

export function SupabaseSetupNotice({ className }: SupabaseSetupNoticeProps) {
  return (
    <div className={cn(cardBase, "border-amber-200 bg-amber-50 p-5 text-sm text-ink", className)}>
      <p className="font-semibold text-ink">Supabase is not configured</p>
      <p className="mt-2 text-ink-muted">
        Add <code className="rounded bg-white px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="rounded bg-white px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
        <code className="rounded bg-white px-1 py-0.5 text-xs">.env.local</code>, then run the SQL migrations in{" "}
        <code className="rounded bg-white px-1 py-0.5 text-xs">supabase/migrations/</code>.
      </p>
      <p className="mt-2 text-ink-muted">See <code className="text-xs">docs/backend-phase-1.md</code> for setup steps.</p>
    </div>
  );
}
