import type { EventType } from "@/types/content";

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  "club-day": "Club Day",
  practice: "Practice",
  "major-event": "Major Event",
  "pathway-session": "Pathway Session",
  "working-bee": "Working Bee",
  closure: "Closure",
  meeting: "Meeting",
};

/**
 * Formats a date string for display in New Zealand English.
 * Returns the original string when the value is "to confirm" or unparseable.
 */
export function formatDate(date: string): string {
  if (!date || date.toLowerCase() === "to confirm") {
    return "To confirm";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

/** Returns a human-readable label for an event type. */
export function formatEventType(type: EventType): string {
  return EVENT_TYPE_LABELS[type] ?? type;
}
