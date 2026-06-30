import type { Cta } from "@/types/content";

import { cn, cardElevated, sectionMuted, textEyebrow, textMeasureSection } from "@/lib/cn";

import { Container } from "@/components/ui/Container";

import { CtaButton } from "@/components/ui/CtaButton";

interface CtaPanelProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  className?: string;
}

export function CtaPanel({
  eyebrow,
  heading,
  body,
  primaryCta,
  secondaryCta,
  className,
}: CtaPanelProps) {
  return (
    <section className={cn(sectionMuted, "py-14 lg:py-20", className)}>
      <Container>
        <div className={cn(cardElevated, "p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10")}>
          <div className={cn(textMeasureSection, "min-w-0")}>
            {eyebrow ? <p className={cn(textEyebrow, "mb-2")}>{eyebrow}</p> : null}
            <h2 className="text-balance text-2xl font-semibold text-ink sm:text-3xl">{heading}</h2>
            {body ? (
              <p className="mt-3 text-base leading-relaxed text-ink-muted">{body}</p>
            ) : null}
          </div>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-0 lg:w-auto">
            <CtaButton
              label={primaryCta.label}
              href={primaryCta.href}
              variant={primaryCta.variant ?? "primary"}
              external={primaryCta.external}
              size="lg"
              fullWidth
              className="sm:w-auto"
            />
            {secondaryCta ? (
              <CtaButton
                label={secondaryCta.label}
                href={secondaryCta.href}
                variant={secondaryCta.variant ?? "secondary"}
                external={secondaryCta.external}
                size="lg"
                fullWidth
                className="sm:w-auto"
              />
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
