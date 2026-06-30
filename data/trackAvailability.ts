export type TrackAvailabilityStatus =
  | "practice-open"
  | "race-day"
  | "closed"
  | "private-hire"
  | "maintenance"
  | "to-confirm";

export interface TrackAvailabilityDay {
  date: string;
  dayLabel: string;
  status: TrackAvailabilityStatus;
  title: string;
  note?: string;
  href?: string;
}

export const trackAvailabilityStatusLabels: Record<TrackAvailabilityStatus, string> = {
  "practice-open": "Open for practice",
  "race-day": "Race day",
  closed: "Closed",
  "private-hire": "Private hire",
  maintenance: "Maintenance",
  "to-confirm": "To confirm",
};

export const trackAvailabilityStatusShortLabels: Record<TrackAvailabilityStatus, string> = {
  "practice-open": "Practice",
  "race-day": "Race day",
  closed: "Closed",
  "private-hire": "Private hire",
  maintenance: "Maintenance",
  "to-confirm": "To confirm",
};

const SHORT_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const STATUS_TITLES: Record<TrackAvailabilityStatus, string> = {
  "practice-open": "Practice session",
  "race-day": "Club race day",
  closed: "No scheduled activity",
  "private-hire": "Private hire",
  maintenance: "Track maintenance",
  "to-confirm": "Schedule to confirm",
};

/** Known overrides for specific dates (YYYY-MM-DD). */
const DATE_OVERRIDES: Record<string, TrackAvailabilityStatus> = {
  "2026-06-30": "practice-open",
  "2026-07-04": "race-day",
  "2026-07-05": "closed",
  "2026-07-06": "maintenance",
  "2026-07-07": "to-confirm",
  "2026-07-08": "practice-open",
  "2026-07-09": "private-hire",
};

function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function inferStatus(date: Date, iso: string): TrackAvailabilityStatus {
  if (DATE_OVERRIDES[iso]) return DATE_OVERRIDES[iso];

  const dayOfWeek = date.getDay();
  if (dayOfWeek === 6) return "race-day";
  if (dayOfWeek === 3) return "practice-open";

  const fallback: TrackAvailabilityStatus[] = [
    "closed",
    "closed",
    "maintenance",
    "private-hire",
    "to-confirm",
  ];
  return fallback[date.getDate() % fallback.length];
}

function buildTrackAvailabilityDay(startDate: Date, dayOffset: number): TrackAvailabilityDay {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + dayOffset);

  const iso = formatIsoDate(date);
  const status = inferStatus(date, iso);
  const dayLabel = dayOffset === 0 ? "Today" : SHORT_DAY_LABELS[date.getDay()];

  const entry: TrackAvailabilityDay = {
    date: iso,
    dayLabel,
    status,
    title: STATUS_TITLES[status],
  };

  if (status === "practice-open") {
    entry.href = "/practice";
    entry.note = "Sign-in and fees to confirm before travelling.";
  } else if (status === "race-day") {
    entry.href = "/race-entries";
    entry.note = "Race entries and timetable to confirm.";
  } else if (status === "closed") {
    entry.note = "Check the calendar for updates.";
  }

  return entry;
}

const AVAILABILITY_START = new Date(2026, 5, 30);
const AVAILABILITY_DAY_COUNT = 30;

/** Next 30 days at Sir Colin Giltrap Raceway. Update when admin system is live. */
export const trackAvailabilityDays: TrackAvailabilityDay[] = Array.from(
  { length: AVAILABILITY_DAY_COUNT },
  (_, index) => buildTrackAvailabilityDay(AVAILABILITY_START, index),
);

export function getTodayAvailability(): TrackAvailabilityDay | undefined {
  return trackAvailabilityDays[0];
}

export function getUpcomingAvailability(limit = 30): TrackAvailabilityDay[] {
  return trackAvailabilityDays.slice(0, limit);
}
