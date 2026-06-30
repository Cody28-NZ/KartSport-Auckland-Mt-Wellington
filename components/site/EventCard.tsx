import Link from "next/link";

import type { EventItem } from "@/types/content";

import { formatDate, formatEventType } from "@/lib/format";

import { cn, cardBase, cardInteractive, focusRing } from "@/lib/cn";

import { CtaButton } from "@/components/ui/CtaButton";

import { StatusBadge } from "@/components/ui/StatusBadge";

interface EventCardProps {
  event: EventItem;
  className?: string;
}

const entryStatusLabels: Record<EventItem["entryStatus"], string> = {
  open: "Entries open",
  "opening-soon": "Entries opening soon",
  closed: "Entries closed",
  "not-required": "No entry required",
  "to-confirm": "Entry status to confirm",
};

export function EventCard({ event, className }: EventCardProps) {
  return (
    <article className={cn(cardBase, cardInteractive, "flex h-full flex-col p-6", className)}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge status="info" label={formatEventType(event.type)} />
        <StatusBadge
          status={event.entryStatus === "open" ? "success" : event.entryStatus === "to-confirm" ? "to-confirm" : "info"}
          label={entryStatusLabels[event.entryStatus]}
        />
      </div>

      <h3 className="text-lg font-semibold text-ink">
        <Link
          href={`/calendar#${event.slug}`}
          className={cn("hover:text-brand", focusRing)}
        >
          {event.title}
        </Link>
      </h3>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex gap-2 text-ink-muted">
          <dt className="font-medium text-ink">Date:</dt>
          <dd>
            {formatDate(event.date)}
            {event.endDate ? ` – ${formatDate(event.endDate)}` : null}
          </dd>
        </div>
        <div className="flex gap-2 text-ink-muted">
          <dt className="font-medium text-ink">Time:</dt>
          <dd>{event.timeLabel}</dd>
        </div>
        <div className="flex gap-2 text-ink-muted">
          <dt className="font-medium text-ink">Location:</dt>
          <dd>{event.location}</dd>
        </div>
      </dl>

      <p className="mt-4 flex-1 text-sm text-ink-muted">{event.summary}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {event.primaryCta ? (
          <CtaButton
            label={event.primaryCta.label}
            href={event.primaryCta.href}
            variant={event.primaryCta.variant ?? "primary"}
            size="sm"
          />
        ) : null}
        {event.secondaryCta ? (
          <CtaButton
            label={event.secondaryCta.label}
            href={event.secondaryCta.href}
            variant={event.secondaryCta.variant ?? "secondary"}
            size="sm"
          />
        ) : null}
      </div>
    </article>
  );
}
