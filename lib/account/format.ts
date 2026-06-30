import type { MembershipApplication, MembershipStatus, PaymentStatus, Person, Profile, RegistrationStatus } from "@/types/database";

export function formatMembershipStatus(status: MembershipStatus | null | undefined): string {
  switch (status) {
    case "active":
      return "Active member";
    case "pending":
      return "Pending";
    case "expired":
      return "Expired";
    case "social":
      return "Social member";
    case "non_member":
      return "Not a member";
    case "life_member":
      return "Life member";
    case "unknown":
    default:
      return "Not set";
  }
}

export function membershipStatusVariant(
  status: MembershipStatus | null | undefined,
): "info" | "success" | "warning" | "draft" {
  switch (status) {
    case "active":
    case "life_member":
      return "success";
    case "pending":
      return "warning";
    case "expired":
    case "non_member":
      return "draft";
    default:
      return "info";
  }
}

export function formatPaymentStatus(status: PaymentStatus): string {
  switch (status) {
    case "pending_external_payment":
      return "Payment pending";
    case "paid_external":
      return "Paid";
    case "not_required":
      return "Not required";
    case "unpaid":
      return "Unpaid";
    case "refunded":
      return "Refunded";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export function formatRegistrationStatus(status: RegistrationStatus): string {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "draft":
      return "Draft";
    case "cancelled":
      return "Cancelled";
    case "withdrawn":
      return "Withdrawn";
    default:
      return status;
  }
}

export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false;
  return Boolean(profile.first_name && profile.last_name && profile.phone);
}

export function hasPeople(people: Person[]): boolean {
  return people.length > 0;
}

/** @deprecated Use hasPeople */
export const hasDrivers = hasPeople;

export function hasSubmittedMembership(applications: MembershipApplication[]): boolean {
  return applications.some((app) => app.status === "submitted");
}

export function currentSeasonLabel(): string {
  return String(new Date().getFullYear());
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(amount);
}
