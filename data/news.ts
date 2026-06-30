import type { NewsPost } from "@/types/content";

export const newsPosts: NewsPost[] = [
  {
    id: "2026-season-preview",
    slug: "2026-season-preview",
    title: "2026 season preview",
    summary:
      "A look ahead at club days, practice sessions, Pathway to Karting and major meetings. Dates and details to confirm with the committee.",
    category: "club",
    publishedAt: "2026-01-10",
    author: "Club committee",
    featured: true,
    seo: {
      title: "2026 season preview | KartSport Auckland Mt Wellington",
      description: "Upcoming karting season at Sir Colin Giltrap Raceway.",
    },
    sections: [
      {
        id: "season-intro",
        heading: "Looking ahead to 2026",
        body: [
          "The 2026 calendar will include club days, practice sessions, Pathway to Karting events and major meetings.",
          "Refer to the calendar for confirmed dates as they are published.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Calendar", href: "/calendar" },
      { label: "Race Entries", href: "/race-entries" },
    ],
    status: "to-confirm",
    lastReviewed: "to confirm",
  },
  {
    id: "pathway-session-dates",
    slug: "pathway-session-dates",
    title: "Pathway to Karting sessions",
    summary:
      "Pathway to Karting try sessions for beginners and families. Booking details to confirm.",
    category: "announcement",
    publishedAt: "2026-02-05",
    seo: {
      title: "Pathway to Karting sessions | KartSport Auckland Mt Wellington",
      description: "Guided introduction sessions for people new to club karting.",
    },
    sections: [
      {
        id: "pathway-announcement",
        heading: "Try karting before you buy",
        body: [
          "Pathway to Karting helps beginners and parents experience real club karting before committing to a kart.",
          "Session dates, costs and booking links are to confirm.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Pathway to Karting", href: "/start-karting/pathway-to-karting" },
      { label: "Start Karting", href: "/start-karting" },
    ],
    status: "to-confirm",
    lastReviewed: "to confirm",
  },
  {
    id: "volunteers-needed",
    slug: "volunteers-needed",
    title: "Volunteers and officials needed",
    summary: "The club needs volunteers and officials to support race days and events in 2026.",
    category: "club",
    publishedAt: "2026-04-01",
    seo: {
      title: "Volunteers needed | KartSport Auckland Mt Wellington",
      description: "Help keep club karting running at Sir Colin Giltrap Raceway.",
    },
    sections: [
      {
        id: "volunteer-call",
        heading: "Help keep club racing running",
        body: [
          "Clubs rely on volunteers and trained officials for safe, fair racing.",
          "Roles, training and registration details are to confirm.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Volunteers", href: "/volunteers" },
      { label: "Contact", href: "/contact" },
    ],
    status: "to-confirm",
    lastReviewed: "to confirm",
  },
];

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((post) => post.slug === slug);
}
