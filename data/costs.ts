import type { CostItem } from "@/types/content";

export const costItems: CostItem[] = [
  {
    id: "kart-purchase",
    title: "Kart purchase",
    category: "kart",
    description:
      "Cost of buying a competition kart suitable for your class. New and used prices vary widely by class and condition.",
    estimate: "to confirm",
    frequency: "one-off",
    sourceType: "to-confirm",
    status: "to-confirm",
    lastReviewed: "to confirm",
    todos: [
      {
        label: "Confirm kart price ranges",
        detail: "Add indicative new and used price ranges per class once approved.",
        priority: "high",
      },
    ],
  },
  {
    id: "safety-gear",
    title: "Safety gear",
    category: "safety-gear",
    description:
      "Helmet, race suit, gloves, boots and other required personal safety equipment.",
    estimate: "to confirm",
    frequency: "one-off",
    sourceType: "to-confirm",
    status: "to-confirm",
    lastReviewed: "to confirm",
    todos: [
      {
        label: "Confirm safety gear costs",
        detail: "Add indicative gear package costs meeting current KartSport NZ standards.",
        priority: "high",
      },
    ],
  },
  {
    id: "club-membership",
    title: "Club membership",
    category: "membership",
    description:
      "KartSport Auckland Mt Wellington membership connects you with the local club. Membership categories and fees must be confirmed.",
    estimate: "to confirm",
    frequency: "annual",
    sourceType: "club",
    status: "to-confirm",
    lastReviewed: "to confirm",
    todos: [
      {
        label: "Confirm membership fees",
        detail: "Add current membership categories and fees once approved by the club.",
        priority: "high",
      },
    ],
  },
  {
    id: "kartsport-nz-licence",
    title: "KartSport NZ licence",
    category: "licence",
    description:
      "National competition licence issued by KartSport New Zealand. Required for racing.",
    estimate: "to confirm",
    frequency: "annual",
    sourceType: "kartsport-nz",
    status: "to-confirm",
    lastReviewed: "to confirm",
    todos: [
      {
        label: "Confirm licence fees",
        detail: "Add current KartSport NZ licence fees and link to official source.",
        priority: "high",
      },
    ],
  },
  {
    id: "practice-fee",
    title: "Practice fee",
    category: "practice",
    description:
      "Per-session or daily fee to practise at Sir Colin Giltrap Raceway. Visitor practice fees may differ.",
    estimate: "to confirm",
    frequency: "per-event",
    sourceType: "club",
    status: "to-confirm",
    lastReviewed: "to confirm",
    todos: [
      {
        label: "Confirm practice fees",
        detail: "Add current member and visitor practice fees.",
        priority: "high",
      },
    ],
  },
  {
    id: "race-entry",
    title: "Race entry",
    category: "race-entry",
    description:
      "Fee to enter a club day or event. May vary by class and event type.",
    estimate: "to confirm",
    frequency: "per-event",
    sourceType: "club",
    status: "to-confirm",
    lastReviewed: "to confirm",
    todos: [
      {
        label: "Confirm race entry fees",
        detail: "Add current entry fees per class and event once approved.",
        priority: "high",
      },
    ],
  },
  {
    id: "running-costs",
    title: "Running costs",
    category: "running-cost",
    description:
      "Ongoing costs including fuel, oil, tyres, chain, sprockets and engine maintenance.",
    estimate: "to confirm",
    frequency: "ongoing",
    sourceType: "to-confirm",
    status: "to-confirm",
    lastReviewed: "to confirm",
    todos: [
      {
        label: "Confirm running cost estimates",
        detail: "Add indicative monthly running costs by class.",
        priority: "medium",
      },
    ],
  },
  {
    id: "tools-spares",
    title: "Tools and spares",
    category: "tools",
    description:
      "Initial tool kit and common spare parts such as chains, sprockets and tyres.",
    estimate: "to confirm",
    frequency: "one-off",
    sourceType: "to-confirm",
    status: "to-confirm",
    lastReviewed: "to confirm",
    todos: [
      {
        label: "Confirm tools and spares budget",
        detail: "Add indicative starter tool kit and spares budget.",
        priority: "medium",
      },
    ],
  },
  {
    id: "transport",
    title: "Transport",
    category: "transport",
    description:
      "Trailer, tie-downs, vehicle costs and travel to club days and away meetings.",
    estimate: "to confirm",
    frequency: "ongoing",
    sourceType: "to-confirm",
    status: "to-confirm",
    lastReviewed: "to confirm",
    todos: [
      {
        label: "Confirm transport costs",
        detail: "Add guidance on trailer hire, purchase and travel costs.",
        priority: "low",
      },
    ],
  },
];
