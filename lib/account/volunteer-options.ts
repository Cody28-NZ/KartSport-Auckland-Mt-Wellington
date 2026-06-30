export const VOLUNTEER_CANNOT_HELP = "Sorry, I can not help";

export const VOLUNTEER_OPTIONS = [
  "Help in the shop",
  "Come to Working bees",
  "Committee",
  "Officiate",
  "Starter",
  "Sponsorship",
  "Clean the clubrooms",
  "Permanent flag point",
  VOLUNTEER_CANNOT_HELP,
] as const;

export type VolunteerOption = (typeof VOLUNTEER_OPTIONS)[number];

export function formatVolunteerInterest(value: string | null | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) return "Not selected";
  return trimmed;
}

export function serializeVolunteerInterest(selected: string[]): string {
  return selected.join(", ");
}

export function parseVolunteerInterest(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return value.split(",").map((part) => part.trim()).filter(Boolean);
}

export function toggleVolunteerSelection(current: string[], option: string): string[] {
  if (option === VOLUNTEER_CANNOT_HELP) {
    return current.includes(VOLUNTEER_CANNOT_HELP) ? [] : [VOLUNTEER_CANNOT_HELP];
  }

  const withoutCannotHelp = current.filter((item) => item !== VOLUNTEER_CANNOT_HELP);
  if (withoutCannotHelp.includes(option)) {
    return withoutCannotHelp.filter((item) => item !== option);
  }
  return [...withoutCannotHelp, option];
}
