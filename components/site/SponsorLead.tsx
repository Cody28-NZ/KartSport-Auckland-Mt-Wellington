import Image from "next/image";
import { cn } from "@/lib/cn";

interface SponsorLeadProps {
  className?: string;
  variant?: "light" | "dark";
}

export function SponsorLead({ className, variant = "light" }: SponsorLeadProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-lg border px-4 py-2.5",
        isDark
          ? "border-white/15 bg-white/10 text-white/80"
          : "border-border bg-white text-ink-muted",
        className,
      )}
    >
      <span className="relative flex h-8 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
        <Image
          src="/images/giltrap-logo.jpg"
          alt="Giltrap"
          fill
          sizes="64px"
          className="object-contain p-0.5"
        />
      </span>
      <p className="text-sm leading-snug">
        <span className={cn("font-medium", isDark ? "text-white" : "text-ink")}>
          Proudly supported by Giltrap
        </span>
        <span className={cn("block text-xs", isDark ? "text-white/60" : "text-ink-subtle")}>
          Part of Auckland&apos;s motorsport community
        </span>
      </p>
    </div>
  );
}
