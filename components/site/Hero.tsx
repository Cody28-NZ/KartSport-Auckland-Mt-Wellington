import Image from "next/image";
import type { Cta, ImagePlaceholder } from "@/types/content";
import { cn, textEyebrow, textEyebrowDark, textMeasureHero, textMeasureHeroSplit } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { ImagePlaceholderPanel } from "@/components/site/ImagePlaceholderPanel";
import { MediaImage } from "@/components/site/MediaImage";

interface HeroProps {
  eyebrow?: string;
  headline: string;
  subheading: string;
  trustLine?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  tertiaryCta?: Cta;
  image?: ImagePlaceholder;
  mediaId?: string;
  variant?: "default" | "home";
  className?: string;
}

export function Hero({
  eyebrow,
  headline,
  subheading,
  trustLine,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  image,
  mediaId,
  variant = "default",
  className,
}: HeroProps) {
  const isHome = variant === "home";

  if (isHome) {
    return (
      <section
        className={cn(
          "relative min-h-[24rem] overflow-hidden sm:min-h-[26rem] lg:h-[34rem] lg:max-h-[600px] lg:min-h-[520px]",
          className,
        )}
      >
        <Image
          src="/images/hero.jpg"
          alt="Kart racing at Sir Colin Giltrap Raceway, Colin Dale Park"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_55%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/25"
          aria-hidden="true"
        />
        <Container className="relative z-10 flex h-full min-h-[inherit] flex-col justify-start pb-10 pt-20 sm:pt-24 lg:pb-12 lg:pt-[6.5rem] xl:pt-28">
          <div className="max-w-[45rem] xl:max-w-[50rem]">
            {eyebrow ? (
              <p className={cn(textEyebrowDark, "mb-2 text-white/75")}>{eyebrow}</p>
            ) : null}
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              {headline}
            </h1>
            {trustLine ? (
              <p className="mt-2 text-sm font-medium text-white/85 sm:text-base">{trustLine}</p>
            ) : null}
            <p className="mt-3 max-w-[40rem] text-base leading-relaxed text-white/90 sm:text-lg">
              {subheading}
            </p>
            {(primaryCta || secondaryCta || tertiaryCta) && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {primaryCta ? (
                  <CtaButton
                    label={primaryCta.label}
                    href={primaryCta.href}
                    variant={primaryCta.variant ?? "primary"}
                    external={primaryCta.external}
                    size="md"
                    onDark
                    pill
                    className="sm:w-auto"
                    fullWidth
                  />
                ) : null}
                {secondaryCta ? (
                  <CtaButton
                    label={secondaryCta.label}
                    href={secondaryCta.href}
                    variant={secondaryCta.variant ?? "secondary"}
                    external={secondaryCta.external}
                    size="md"
                    onDark
                    pill
                    className="sm:w-auto"
                    fullWidth
                  />
                ) : null}
                {tertiaryCta ? (
                  <CtaButton
                    label={tertiaryCta.label}
                    href={tertiaryCta.href}
                    variant={tertiaryCta.variant ?? "secondary"}
                    external={tertiaryCta.external}
                    size="md"
                    onDark
                    pill
                    className="sm:w-auto"
                    fullWidth
                  />
                ) : null}
              </div>
            )}
          </div>
        </Container>
      </section>
    );
  }

  const innerMediaId = image?.mediaId ?? mediaId;
  const hasMedia = Boolean(image || innerMediaId);

  return (
    <section className={cn("border-b border-border bg-surface py-12 sm:py-14 lg:py-16", className)}>
      <Container>
        <div
          className={cn(
            "grid items-center gap-10",
            hasMedia && "lg:grid-cols-[1.1fr_0.9fr] lg:gap-14",
          )}
        >
          <div className={cn(hasMedia ? textMeasureHeroSplit : textMeasureHero, "min-w-0")}>
            {eyebrow ? <p className={cn(textEyebrow, "mb-3")}>{eyebrow}</p> : null}
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {headline}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{subheading}</p>
            {trustLine ? <p className="mt-3 text-sm text-ink-subtle">{trustLine}</p> : null}
            {(primaryCta || secondaryCta) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {primaryCta ? (
                  <CtaButton
                    label={primaryCta.label}
                    href={primaryCta.href}
                    variant={primaryCta.variant ?? "primary"}
                    external={primaryCta.external}
                    className="rounded-full sm:w-auto"
                    fullWidth
                  />
                ) : null}
                {secondaryCta ? (
                  <CtaButton
                    label={secondaryCta.label}
                    href={secondaryCta.href}
                    variant={secondaryCta.variant ?? "secondary"}
                    external={secondaryCta.external}
                    className="rounded-full sm:w-auto"
                    fullWidth
                  />
                ) : null}
              </div>
            )}
          </div>
          {image && !image.mediaId ? (
            <ImagePlaceholderPanel image={image} className="min-w-0 lg:mt-0" />
          ) : innerMediaId ? (
            <MediaImage mediaId={innerMediaId} rounded className="min-w-0 w-full shadow-sm" />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
