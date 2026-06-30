import type { DocumentItem } from "@/types/content";

export const officialDocuments: DocumentItem[] = [
  {
    id: "ksnz-licensing",
    title: "KartSport NZ licensing",
    category: "official-link",
    description:
      "Official KartSport New Zealand licensing information and application process.",
    href: "to confirm",
    external: true,
    sourceType: "kartsport-nz",
    lastUpdated: "to confirm",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm KSNZ licensing URL",
        detail: "Link to current KartSport NZ licence pages and forms.",
        priority: "high",
      },
    ],
  },
  {
    id: "ksnz-rules-manual",
    title: "KartSport NZ rules and manual",
    category: "rules",
    description:
      "Official KartSport New Zealand rules, regulations and competition manual.",
    href: "to confirm",
    external: true,
    sourceType: "kartsport-nz",
    lastUpdated: "to confirm",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm official rules link",
        detail: "Link to current year KartSport NZ rules and manual.",
        priority: "high",
      },
    ],
  },
  {
    id: "class-information",
    title: "Class information",
    category: "rules",
    description:
      "Official class definitions, age limits and technical regulations via KartSport NZ.",
    href: "to confirm",
    external: true,
    sourceType: "kartsport-nz",
    lastUpdated: "to confirm",
    status: "to-confirm",
  },
  {
    id: "safety-gear-requirements",
    title: "Safety gear requirements",
    category: "safety",
    description:
      "Official safety equipment standards for competition karting in New Zealand.",
    href: "to confirm",
    external: true,
    sourceType: "kartsport-nz",
    lastUpdated: "to confirm",
    status: "to-confirm",
  },
];

export const clubDocuments: DocumentItem[] = [
  {
    id: "membership-form",
    title: "Membership form",
    category: "membership",
    description:
      "KartSport Auckland Mt Wellington membership application form.",
    href: "to confirm",
    sourceType: "club",
    lastUpdated: "to confirm",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm membership form",
        detail: "Upload or link current club membership form and fees.",
        priority: "high",
      },
    ],
  },
  {
    id: "practice-form",
    title: "Practice form",
    category: "practice",
    description:
      "Club practice sign-in or registration form for members and approved visitors.",
    href: "to confirm",
    sourceType: "club",
    lastUpdated: "to confirm",
    status: "to-confirm",
  },
  {
    id: "race-entry-form",
    title: "Race entry",
    category: "race-entry",
    description:
      "Club day and event entry form or link to online entry system.",
    href: "to confirm",
    sourceType: "club",
    lastUpdated: "to confirm",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm race entry process",
        detail: "Link to current entry platform or downloadable entry form.",
        priority: "high",
      },
    ],
  },
  {
    id: "visitor-practice",
    title: "Visitor practice",
    category: "visitor",
    description:
      "Information and forms for visiting racers wishing to practice at Auckland.",
    href: "to confirm",
    sourceType: "club",
    lastUpdated: "to confirm",
    status: "to-confirm",
  },
];

export const documents: DocumentItem[] = [...officialDocuments, ...clubDocuments];
