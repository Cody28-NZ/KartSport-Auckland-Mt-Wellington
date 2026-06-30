import { cn } from "@/lib/cn";

interface ToConfirmNoticeProps {
  compact?: boolean;
  className?: string;
  variant?: "light" | "dark";
}

export function ToConfirmNotice({ compact, className, variant = "light" }: ToConfirmNoticeProps) {
  const isDark = variant === "dark";

  return (
    <div
      role="note"
      className={cn(
        "rounded-lg border",
        isDark
          ? "border-white/15 bg-white/5 text-white/70"
          : "border-amber-200 bg-amber-50 text-ink-muted",
        compact ? "p-3 text-xs" : "p-4 text-sm",
        className,
      )}
    >
      <p className={cn("font-semibold", isDark ? "text-white/90" : "text-ink")}>
        {compact ? "To confirm with the club" : "Confirmation required"}
      </p>
      <p className={cn(compact ? "mt-1" : "mt-2")}>
        {compact
          ? "Some details on this page are marked to confirm with the club or KartSport NZ before relying on them."
          : "Information marked to confirm has not yet been verified with the KartSport Auckland Mt Wellington committee or KartSport New Zealand. Always check official sources and contact the club before making decisions based on this content."}
      </p>
    </div>
  );
}
