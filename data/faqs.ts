import type { FaqItem } from "@/types/content";

export const faqs: FaqItem[] = [
  {
    id: "how-do-i-start",
    question: "How do I start karting?",
    answer:
      "Read Start Karting for the overall journey into owner-driver KartSport racing. If you want guided help before buying a kart, look at Pathway to Karting. Do not buy equipment until you understand your class and licence pathway.",
    category: "beginner",
    relatedLinks: [
      { label: "Start Karting", href: "/start-karting" },
      { label: "Pathway to Karting", href: "/start-karting/pathway-to-karting" },
    ],
    status: "published",
    lastReviewed: "to confirm",
  },
  {
    id: "is-this-hire-karting",
    question: "Is this hire karting?",
    answer:
      "No. KartSport Auckland Mt Wellington is real club motorsport. Drivers use competition karts, follow KartSport NZ rules, and need appropriate licences and safety gear. Hire kart venues are a fun taster, but they are not the same as owner-driver racing.",
    category: "beginner",
    relatedLinks: [{ label: "Start Karting", href: "/start-karting" }],
    status: "published",
    lastReviewed: "to confirm",
  },
  {
    id: "how-do-race-entries-work",
    question: "How do race entries work?",
    answer:
      "Race entries are submitted through the club's entry process for each club day or event. Check the calendar for upcoming race days, then use the Race Entries page for the current form or link. Enter early when possible.",
    category: "race-day",
    relatedLinks: [
      { label: "Race Entries", href: "/race-entries" },
      { label: "Calendar", href: "/calendar" },
    ],
    status: "to-confirm",
    lastReviewed: "to confirm",
  },
  {
    id: "how-does-practice-work",
    question: "How does practice work?",
    answer:
      "Practice days are scheduled club sessions for licenced drivers with compliant karts and gear. Check track availability and the calendar before travelling. Sign-in process, fees and eligibility are to confirm with the club.",
    category: "practice",
    relatedLinks: [
      { label: "Practice", href: "/practice" },
      { label: "Calendar", href: "/calendar" },
    ],
    status: "to-confirm",
    lastReviewed: "to confirm",
  },
  {
    id: "do-i-need-a-licence",
    question: "Do I need a licence?",
    answer:
      "Most on-track activity requires a KartSport NZ licence. KartSport Auckland Mt Wellington does not issue licences. KartSport New Zealand is the source of truth for licence types, applications and requirements.",
    category: "licence",
    relatedLinks: [
      { label: "Licences", href: "/start-karting/licences" },
      { label: "Documents and Rules", href: "/documents" },
    ],
    status: "published",
    lastReviewed: "to confirm",
  },
  {
    id: "what-does-it-cost",
    question: "What does it cost?",
    answer:
      "Karting costs depend on class, how much you buy new versus second-hand, and how often you practice and race. Expect categories such as kart, safety gear, membership, licence, practice, race entries and running costs. Exact fees are to confirm.",
    category: "beginner",
    relatedLinks: [{ label: "Costs", href: "/start-karting/costs" }],
    status: "to-confirm",
    lastReviewed: "to confirm",
  },
  {
    id: "who-do-i-contact",
    question: "Who do I contact?",
    answer:
      "Use the Contact page to reach the club for beginner enquiries, race entries, practice, membership, sponsors, volunteers or general questions. Email addresses and response times are to confirm.",
    category: "membership",
    relatedLinks: [{ label: "Contact", href: "/contact" }],
    status: "published",
    lastReviewed: "to confirm",
  },
];
