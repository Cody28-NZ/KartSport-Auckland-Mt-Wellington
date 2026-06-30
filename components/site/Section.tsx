import type { ReactNode } from "react";
import { cn, sectionDefault, sectionElevated, sectionMuted, textEyebrow, textEyebrowDark, textMeasureSection } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  body?: string[];
  children?: ReactNode;
  variant?: "default" | "muted" | "elevated" | "dark";
  className?: string;
  tight?: boolean;
}

const variantStyles = {
  default: sectionDefault,
  muted: sectionMuted,
  elevated: sectionElevated,
  dark: "section-photo-band text-white border-y border-black/10",
};

export function Section({
  id,
  eyebrow,
  heading,
  body,
  children,
  variant = "default",
  className,
  tight,
}: SectionProps) {
  const isDark = variant === "dark";

  return (
    <section
      id={id}
      className={cn(
        variantStyles[variant],
        tight ? "py-10 lg:py-12" : "py-12 sm:py-14 lg:py-16",
        className,
      )}
    >
      <Container>
        <div className={textMeasureSection}>
          {eyebrow ? (
            <p className={cn("mb-2", isDark ? textEyebrowDark : textEyebrow)}>{eyebrow}</p>
          ) : null}
          <h2
            className={cn(
              "text-balance text-2xl font-semibold tracking-tight sm:text-3xl",
              isDark ? "text-white" : "text-ink",
            )}
          >
            {heading}
          </h2>
          {body?.length ? (
            <div
              className={cn(
                "mt-3 space-y-3 text-[0.9375rem] leading-relaxed",
                isDark ? "text-white/70" : "text-ink-muted",
              )}
            >
              {body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : null}
        </div>
        {children ? <div className={cn(tight ? "mt-5" : "mt-8")}>{children}</div> : null}
      </Container>
    </section>
  );
}
