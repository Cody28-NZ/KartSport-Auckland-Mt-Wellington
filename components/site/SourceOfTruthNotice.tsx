import Link from "next/link";
import { cn, focusRing, textLink } from "@/lib/cn";

const KARTSPORT_NZ_URL = "https://www.kartsport.co.nz";

interface SourceOfTruthNoticeProps {
  compact?: boolean;
  className?: string;
  variant?: "light" | "dark";
}

export function SourceOfTruthNotice({ compact, className, variant = "light" }: SourceOfTruthNoticeProps) {
  const isDark = variant === "dark";

  return (
    <div
      role="note"
      className={cn(
        "rounded-lg border",
        isDark
          ? "border-white/15 bg-white/5 text-white/70"
          : "border-border bg-surface-alt text-ink-muted",
        compact ? "p-3 text-xs" : "p-4 text-sm",
        className,
      )}
    >
      <p className={cn("font-semibold", isDark ? "text-white/90" : "text-ink")}>
        {compact ? "Official source" : "Source of truth"}
      </p>
      <p className={cn(compact ? "mt-1" : "mt-2", isDark ? "text-white/70" : "text-ink-muted")}>
        {compact ? (
          <>
            Rules, licences and national regulations are set by{" "}
            <Link
              href={KARTSPORT_NZ_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "font-medium underline",
                isDark ? "text-white/90 hover:text-white" : textLink,
                focusRing,
              )}
            >
              KartSport New Zealand
            </Link>
            . This club website explains local information and links to official sources.
          </>
        ) : (
          <>
            KartSport Auckland Mt Wellington provides local club information, practice details and
            event guidance. National rules, licensing, class definitions and competition regulations
            are governed by{" "}
            <Link
              href={KARTSPORT_NZ_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "font-medium underline",
                isDark ? "text-white/90 hover:text-white" : textLink,
                focusRing,
              )}
            >
              KartSport New Zealand (kartsport.co.nz)
            </Link>
            . When in doubt, refer to the official KartSport NZ website and current year rules.
          </>
        )}
      </p>
    </div>
  );
}
