import type { MembershipIntent, MembershipProduct, PersonType } from "@/types/database";

export interface MembershipIntentOption {
  value: MembershipIntent;
  label: string;
  description: string;
  requiresDriving: boolean;
  isFullMembership: boolean;
}

export const MEMBERSHIP_INTENT_OPTIONS: MembershipIntentOption[] = [
  {
    value: "racing_practising_member",
    label: "Junior or adult racing/practising member",
    description: "Full club membership for someone who will drive on track.",
    requiresDriving: true,
    isFullMembership: true,
  },
  {
    value: "additional_family_racing_member",
    label: "Additional family racing member",
    description: "Second or further racing member at the same address.",
    requiresDriving: true,
    isFullMembership: true,
  },
  {
    value: "social_member",
    label: "Social membership",
    description: "Non-driving membership for supporters and volunteers.",
    requiresDriving: false,
    isFullMembership: true,
  },
  {
    value: "pit_member",
    label: "Pit membership",
    description: "Non-driving pit crew membership.",
    requiresDriving: false,
    isFullMembership: true,
  },
  {
    value: "life_honorary_member",
    label: "Life / honorary member",
    description: "Life or honorary membership as approved by the club.",
    requiresDriving: false,
    isFullMembership: true,
  },
  {
    value: "visiting_driver",
    label: "Visiting driver from another club",
    description: "Register as a visitor for practice or race entry without full AKL-MTW membership.",
    requiresDriving: true,
    isFullMembership: false,
  },
  {
    value: "parent_guardian_only",
    label: "Parent / guardian only",
    description: "Account holder supporting junior drivers without a separate driving membership.",
    requiresDriving: false,
    isFullMembership: false,
  },
];

const PRODUCT_NAME_HINTS: Record<MembershipIntent, string[]> = {
  racing_practising_member: ["Racing / Practicing Member", "Racing / Practising Member"],
  additional_family_racing_member: ["Additional Racing Member"],
  social_member: ["Social Membership"],
  pit_member: ["Pit"],
  life_honorary_member: ["Life / Honorary Member", "Life / Honorary"],
  visiting_driver: [],
  parent_guardian_only: [],
};

export function productsForIntent(intent: MembershipIntent, products: MembershipProduct[]): MembershipProduct[] {
  const hints = PRODUCT_NAME_HINTS[intent];
  if (!hints.length) return [];
  return products.filter((product) => hints.some((hint) => product.name.includes(hint)));
}

export function intentRequiresGuardian(intent: MembershipIntent, dateOfBirth: string | null): boolean {
  if (intent === "parent_guardian_only") return false;
  if (!dateOfBirth) return intent === "racing_practising_member";
  const dob = new Date(`${dateOfBirth}T12:00:00`);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age < 18;
}

export function defaultPersonTypeForIntent(intent: MembershipIntent, isJunior: boolean): PersonType {
  switch (intent) {
    case "social_member":
      return "social_member";
    case "pit_member":
      return "pit_member";
    case "visiting_driver":
      return "visiting_driver";
    case "parent_guardian_only":
      return "parent_guardian";
    case "additional_family_racing_member":
    case "racing_practising_member":
      return isJunior ? "junior_driver" : "adult_driver";
    default:
      return "other";
  }
}

export function formatPersonType(type: PersonType): string {
  switch (type) {
    case "account_holder":
      return "Account holder";
    case "adult_driver":
      return "Adult driver";
    case "junior_driver":
      return "Junior driver";
    case "parent_guardian":
      return "Parent / guardian";
    case "social_member":
      return "Social member";
    case "pit_member":
      return "Pit member";
    case "visiting_driver":
      return "Visiting driver";
    default:
      return "Other";
  }
}

export function formatMembershipIntent(intent: MembershipIntent): string {
  return MEMBERSHIP_INTENT_OPTIONS.find((option) => option.value === intent)?.label ?? intent;
}
