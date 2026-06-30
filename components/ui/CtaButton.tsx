import Link from "next/link";
import type { CtaVariant } from "@/types/content";
import { cn, btnPrimary, btnSecondary, btnGhost, btnSecondaryDark, btnGhostDark, btnPill, focusRing, tapTarget } from "@/lib/cn";

interface CtaButtonProps {
  label: string;
  href: string;
  variant?: CtaVariant;
  external?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  onDark?: boolean;
  pill?: boolean;
}

const lightVariants: Record<CtaVariant, string> = {
  primary: cn(btnPrimary, "border border-transparent"),
  secondary: btnSecondary,
  ghost: btnGhost,
  danger: "border border-motorsport/30 bg-motorsport/5 text-motorsport hover:bg-motorsport/10",
  external: btnSecondary,
};

const darkVariants: Record<CtaVariant, string> = {
  primary: cn(btnPrimary, "border border-transparent"),
  secondary: btnSecondaryDark,
  ghost: btnGhostDark,
  danger: "border border-motorsport/40 bg-motorsport/20 text-red-200 hover:bg-motorsport/30",
  external: btnSecondaryDark,
};

const sizeStyles = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm font-medium",
  lg: "px-6 py-3 text-[0.9375rem] font-medium",
};

export function CtaButton({
  label,
  href,
  variant = "primary",
  external,
  className,
  size = "md",
  fullWidth,
  onDark = false,
  pill = false,
}: CtaButtonProps) {
  const isExternal =
    external ?? (href.startsWith("http") || href.startsWith("mailto:"));
  const variantStyles = onDark ? darkVariants : lightVariants;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
    pill || variant === "primary" ? cn(btnPill, "rounded-full") : "rounded-lg",
    focusRing,
    tapTarget,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className,
  );

  if (isExternal) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {label}
        <ExternalIcon />
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {label}
      {variant === "external" ? <ExternalIcon /> : null}
    </Link>
  );
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
