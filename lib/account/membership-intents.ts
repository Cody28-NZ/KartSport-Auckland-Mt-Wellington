import { isJuniorPerson } from "@/lib/people/utils";
import type { MembershipIntent, MembershipProduct, PersonType } from "@/types/database";

export type RegistrationPath =
  | "junior_driver"
  | "adult_driver"
  | "additional_family_driver"
  | "social_or_pit"
  | "visiting_driver";

export interface RegistrationPathOption {
  value: RegistrationPath;
  label: string;
  description: string;
  requiresDriving: boolean;
  isPrimary?: boolean;
}

export const REGISTRATION_PATH_OPTIONS: RegistrationPathOption[] = [
  {
    value: "junior_driver",
    label: "Junior driver",
    description: "I'm a parent or guardian registering a driver under 18.",
    requiresDriving: true,
    isPrimary: true,
  },
  {
    value: "adult_driver",
    label: "Adult driver",
    description: "I'm registering myself as an adult racing or practising member.",
    requiresDriving: true,
  },
  {
    value: "additional_family_driver",
    label: "Additional family driver",
    description: "I'm registering another racing member at the same address.",
    requiresDriving: true,
  },
  {
    value: "social_or_pit",
    label: "Social or pit member",
    description: "I'm registering a non-driving supporter, pit crew member or helper.",
    requiresDriving: false,
  },
  {
    value: "visiting_driver",
    label: "Visiting driver",
    description:
      "I'm from another club and want to register for practice or race days without full AKL-MTW membership.",
    requiresDriving: true,
  },
];

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
    label: "Racing / practising member",
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
    label: "Visiting driver",
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

export function resolveMembershipIntent(
  path: RegistrationPath,
  selectedProduct: MembershipProduct | null,
): MembershipIntent {
  switch (path) {
    case "junior_driver":
    case "adult_driver":
      return "racing_practising_member";
    case "additional_family_driver":
      return "additional_family_racing_member";
    case "social_or_pit":
      if (selectedProduct?.name.includes("Pit")) return "pit_member";
      if (selectedProduct?.name.includes("Life") || selectedProduct?.name.includes("Honorary")) {
        return "life_honorary_member";
      }
      return "social_member";
    case "visiting_driver":
      return "visiting_driver";
    default:
      return "racing_practising_member";
  }
}

export function productsForRegistrationPath(
  path: RegistrationPath,
  products: MembershipProduct[],
): MembershipProduct[] {
  switch (path) {
    case "junior_driver":
    case "adult_driver":
      return products.filter((p) =>
        ["Racing / Practicing Member", "Racing / Practising Member"].some((hint) => p.name.includes(hint)),
      );
    case "additional_family_driver":
      return products.filter((p) => p.name.includes("Additional Racing Member"));
    case "social_or_pit":
      return products.filter(
        (p) =>
          p.name.includes("Social Membership") ||
          p.name.includes("Pit") ||
          p.name.includes("Life / Honorary"),
      );
    case "visiting_driver":
      return [];
    default:
      return [];
  }
}

export function productsForIntent(intent: MembershipIntent, products: MembershipProduct[]): MembershipProduct[] {
  const hints = PRODUCT_NAME_HINTS[intent];
  if (!hints.length) return [];
  return products.filter((product) => hints.some((hint) => product.name.includes(hint)));
}

export function registrationPathRequiresGuardian(
  path: RegistrationPath,
  dateOfBirth: string | null,
): boolean {
  if (path === "junior_driver") return true;
  if (!dateOfBirth) return false;
  return isJuniorPerson(dateOfBirth);
}

export function intentRequiresGuardian(intent: MembershipIntent, dateOfBirth: string | null): boolean {
  if (intent === "parent_guardian_only") return false;
  if (!dateOfBirth) return false;
  return isJuniorPerson(dateOfBirth);
}

export function applicantPersonTypeForPath(
  path: RegistrationPath,
  dateOfBirth: string | null,
  membershipIntent: MembershipIntent,
): PersonType {
  switch (path) {
    case "junior_driver":
      return "junior_driver";
    case "visiting_driver":
      return "visiting_driver";
    case "social_or_pit":
      if (membershipIntent === "pit_member") return "pit_member";
      if (membershipIntent === "life_honorary_member") return "social_member";
      return "social_member";
    case "adult_driver":
      return "adult_driver";
    case "additional_family_driver":
      return dateOfBirth && isJuniorPerson(dateOfBirth) ? "junior_driver" : "adult_driver";
    default:
      return "other";
  }
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
      return "Member";
  }
}

export function formatMembershipIntent(intent: MembershipIntent): string {
  return MEMBERSHIP_INTENT_OPTIONS.find((option) => option.value === intent)?.label ?? intent;
}

export function formatRegistrationPath(path: RegistrationPath): string {
  return REGISTRATION_PATH_OPTIONS.find((option) => option.value === path)?.label ?? path;
}
