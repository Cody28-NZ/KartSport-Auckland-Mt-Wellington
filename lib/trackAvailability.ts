import {
  trackAvailabilityStatusLabels,
  type TrackAvailabilityDay,
  type TrackAvailabilityStatus,
} from "@/data/trackAvailability";

export type PublicAvailabilityStatus = "practice-open" | "race-day" | "closed";

export function getPublicStatus(status: TrackAvailabilityStatus): PublicAvailabilityStatus {
  if (status === "practice-open") return "practice-open";
  if (status === "race-day") return "race-day";
  return "closed";
}

export function getPublicStatusLabel(status: TrackAvailabilityStatus): string {
  switch (getPublicStatus(status)) {
    case "practice-open":
      return "Practice";
    case "race-day":
      return "Race day";
    case "closed":
    default:
      return "Closed";
  }
}

/** Full labels for calendar / practice panel (internal detail). */
export function getStatusLabel(status: TrackAvailabilityStatus): string {
  return trackAvailabilityStatusLabels[status];
}

export function getStatusChipClass(status: TrackAvailabilityStatus): string {
  switch (getPublicStatus(status)) {
    case "practice-open":
      return "border-emerald-300/70 bg-emerald-50 text-emerald-800";
    case "race-day":
      return "border-ink/20 bg-ink/10 text-ink";
    case "closed":
    default:
      return "border-red-200/70 bg-red-50 text-red-800";
  }
}

export function getStripBoxClass(status: TrackAvailabilityStatus): string {
  switch (getPublicStatus(status)) {
    case "practice-open":
      return "border-emerald-200/60 bg-emerald-50/40 hover:border-emerald-300/80";
    case "race-day":
      return "border-border bg-white hover:border-ink/20";
    case "closed":
    default:
      return "border-red-200/50 bg-red-50/30";
  }
}

export function formatIndicatorLabel(day: TrackAvailabilityDay): string {
  return `${day.dayLabel}: ${getPublicStatusLabel(day.status)}`;
}

export function formatStripDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date.toUpperCase();

  const formatted = new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "short",
  }).format(parsed);

  return formatted.replace(".", "").toUpperCase();
}

export function getAvailabilityHref(day: TrackAvailabilityDay): string | undefined {
  const pub = getPublicStatus(day.status);
  if (pub === "practice-open") return day.href ?? "/practice";
  if (pub === "race-day") return day.href ?? "/race-entries";
  return undefined;
}

export function getNextNotableDay(
  days: TrackAvailabilityDay[],
): TrackAvailabilityDay | undefined {
  return days.find((day) => day.status === "race-day") ?? days[1];
}
