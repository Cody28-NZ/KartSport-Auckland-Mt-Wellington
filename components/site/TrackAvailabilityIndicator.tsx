import Link from "next/link";
import { getTodayAvailability, getUpcomingAvailability } from "@/data/trackAvailability";
import {
  formatIndicatorLabel,
  getNextNotableDay,
  getPublicStatusLabel,
  getStatusChipClass,
} from "@/lib/trackAvailability";
import { cn, focusRing } from "@/lib/cn";

interface TrackAvailabilityIndicatorProps {
  className?: string;
  linkToCalendar?: boolean;
}

export function TrackAvailabilityIndicator({
  className,
  linkToCalendar = false,
}: TrackAvailabilityIndicatorProps) {
  const today = getTodayAvailability();
  if (!today) return null;

  const next = getNextNotableDay(getUpcomingAvailability());
  const label =
    today.status === "race-day"
      ? formatIndicatorLabel(today)
      : next?.status === "race-day" && next.dayLabel !== today.dayLabel
        ? `Today: ${getPublicStatusLabel(today.status)}. Next: Race day ${next.dayLabel}`
        : formatIndicatorLabel(today);

  const chip = (
    <span
      className={cn(
        "inline-flex max-w-[14rem] items-center rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium leading-tight sm:max-w-xs sm:text-xs",
        getStatusChipClass(today.status),
        className,
      )}
      title={today.note}
    >
      {label}
    </span>
  );

  if (linkToCalendar) {
    return (
      <Link href="/calendar" className={cn("inline-flex", focusRing)}>
        {chip}
      </Link>
    );
  }

  return chip;
}
