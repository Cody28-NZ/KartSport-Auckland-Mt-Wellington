import Link from "next/link";

import type { ContentCard } from "@/types/content";

import { cn, cardBase, cardElevated, cardInteractive, focusRing, textLink } from "@/lib/cn";

import { StatusBadge } from "@/components/ui/StatusBadge";

interface InfoCardProps extends ContentCard {
  className?: string;
  featured?: boolean;
}

export function InfoCard({
  title,
  body,
  href,
  ctaLabel,
  badge,
  className,
  featured,
}: InfoCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        {badge ? <StatusBadge status="info" label={badge} /> : null}
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{body}</p>
      {(href || ctaLabel) && (
        <div className="mt-5">
          {href && ctaLabel ? (
            <span className={cn(textLink, "text-sm group-hover:text-brand-hover")}>
              {ctaLabel} &rarr;
            </span>
          ) : href ? (
            <span className={cn(textLink, "text-sm")}>Learn more &rarr;</span>
          ) : null}
        </div>
      )}
    </>
  );

  const classes = cn(
    featured ? cardElevated : cardBase,
    cardInteractive,
    "group flex h-full flex-col p-6",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(classes, focusRing)}>
        {content}
      </Link>
    );
  }

  return <article className={classes}>{content}</article>;
}
