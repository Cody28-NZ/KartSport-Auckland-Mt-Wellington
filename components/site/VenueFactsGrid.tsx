import type { VenueFact } from "@/types/content";
import { venueFacts } from "@/data/venue";
import { cn, cardBase, textEyebrow } from "@/lib/cn";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface VenueFactsGridProps {
  facts?: VenueFact[];
  className?: string;
}

export function VenueFactsGrid({ facts = venueFacts, className }: VenueFactsGridProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {facts.map((fact) => (
        <article key={fact.id} className={cn(cardBase, "p-5")}>
          <div className="flex items-start justify-between gap-2">
            <p className={cn(textEyebrow, "normal-case tracking-wide text-ink-subtle")}>{fact.label}</p>
            {fact.status === "to-confirm" ? (
              <StatusBadge status="to-confirm" />
            ) : null}
          </div>
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink">{fact.value}</p>
        </article>
      ))}
    </div>
  );
}
