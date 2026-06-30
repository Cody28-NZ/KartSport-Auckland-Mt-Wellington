import { getUpcomingAvailability } from "@/data/trackAvailability";
import { getStatusChipClass, getStatusLabel } from "@/lib/trackAvailability";
import { cn, cardBase, sectionDefault, sectionHome } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

interface TrackAvailabilityPanelProps {
  title?: string;
  limit?: number;
  compact?: boolean;
  className?: string;
}

export function TrackAvailabilityPanel({
  title = "Track availability",
  limit = 7,
  compact = false,
  className,
}: TrackAvailabilityPanelProps) {
  const days = getUpcomingAvailability(limit);

  return (
    <section className={cn(compact ? "" : sectionDefault, !compact && sectionHome, className)}>
      <Container>
        {!compact ? (
          <div className="mb-5">
            <p className="text-xs font-medium tracking-wide text-ink-subtle">Sir Colin Giltrap Raceway</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Next few days at Colin Dale Park. Always check before travelling.
            </p>
          </div>
        ) : (
          <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
        )}

        <ul className={cn(compact ? "space-y-2" : "grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
          {days.map((day) => (
            <li
              key={day.date}
              className={cn(
                cardBase,
                "flex flex-col gap-2 p-4",
                compact && "flex-row items-center justify-between gap-3 p-3",
              )}
            >
              <div className={cn(compact && "min-w-0 flex-1")}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{day.dayLabel}</span>
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium",
                      getStatusChipClass(day.status),
                    )}
                  >
                    {getStatusLabel(day.status)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink">{day.title}</p>
                {day.note && !compact ? (
                  <p className="mt-1 text-xs text-ink-muted">{day.note}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
