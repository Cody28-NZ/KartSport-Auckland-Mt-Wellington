import { formatMembershipIntent } from "@/lib/account/membership-intents";
import type { MembershipApplication, MembershipApplicationItem, Person, Profile } from "@/types/database";

export interface ApplicationDisplayContext {
  application: MembershipApplication;
  applicant: Person | null;
  managedBy: Person | Profile | null;
  items: MembershipApplicationItem[];
}

export function applicantDisplayName(applicant: Person | null): string {
  if (!applicant) return "Member";
  return `${applicant.first_name} ${applicant.last_name}`.trim();
}

export function managedByDisplayName(managedBy: Person | Profile | null): string | null {
  if (!managedBy) return null;
  const first = "first_name" in managedBy ? managedBy.first_name : null;
  const last = "last_name" in managedBy ? managedBy.last_name : null;
  const name = [first, last].filter(Boolean).join(" ").trim();
  return name || null;
}

export function applicationTypeLabel(ctx: ApplicationDisplayContext): string {
  const { application, applicant } = ctx;
  if (applicant?.person_type === "junior_driver" && application.membership_intent === "racing_practising_member") {
    return "Junior driver";
  }
  if (applicant?.person_type === "visiting_driver") return "Visiting driver";
  if (application.membership_intent === "social_member") return "Social member";
  if (application.membership_intent === "pit_member") return "Pit member";
  return formatMembershipIntent(application.membership_intent);
}

export function primaryProductName(items: MembershipApplicationItem[]): string | null {
  return items[0]?.product_name_snapshot ?? null;
}

export function isJuniorApplication(ctx: ApplicationDisplayContext): boolean {
  return ctx.applicant?.person_type === "junior_driver";
}
