import type { NavigationItem } from "@/types/content";

export interface FooterGroup {
  id: string;
  title: string;
  links: NavigationItem[];
}

export interface MobileNavGroup {
  id: string;
  title: string;
  links: NavigationItem[];
}

/** Desktop top navigation - simple direct links only */
export const desktopNavigation: NavigationItem[] = [
  { id: "race-entries", label: "Race Entries", href: "/race-entries" },
  { id: "practice", label: "Practice", href: "/practice" },
  { id: "calendar", label: "Calendar", href: "/calendar" },
  { id: "results", label: "Results", href: "/results" },
  { id: "start-karting", label: "Start Karting", href: "/start-karting" },
  { id: "venue", label: "Venue", href: "/venue" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export const mobileNavigationGroups: MobileNavGroup[] = [
  {
    id: "member",
    title: "Member links",
    links: [
      { id: "race-entries", label: "Race Entries", href: "/race-entries" },
      { id: "practice", label: "Practice", href: "/practice" },
      { id: "calendar", label: "Calendar", href: "/calendar" },
      { id: "results", label: "Results", href: "/results" },
      { id: "documents", label: "Documents and Rules", href: "/documents" },
    ],
  },
  {
    id: "start-karting",
    title: "Start karting",
    links: [
      { id: "start-karting", label: "Start Karting", href: "/start-karting" },
      {
        id: "pathway-to-karting",
        label: "Pathway to Karting",
        href: "/start-karting/pathway-to-karting",
      },
      { id: "costs", label: "Costs", href: "/start-karting/costs" },
      { id: "licences", label: "Licences", href: "/start-karting/licences" },
      { id: "buying-a-kart", label: "Buying a Kart", href: "/start-karting/buying-a-kart" },
      { id: "parents", label: "Parents", href: "/start-karting/parents" },
    ],
  },
  {
    id: "club",
    title: "Club",
    links: [
      { id: "venue", label: "Venue", href: "/venue" },
      { id: "visiting-racers", label: "Visiting Racers", href: "/visiting-racers" },
      { id: "sponsors", label: "Sponsors", href: "/sponsors" },
      { id: "volunteers", label: "Volunteers", href: "/volunteers" },
      { id: "news", label: "News", href: "/news" },
      { id: "faq", label: "FAQ", href: "/faq" },
      { id: "contact", label: "Contact", href: "/contact" },
    ],
  },
];

export const footerNavigation: FooterGroup[] = [
  {
    id: "footer-member",
    title: "Member Links",
    links: [
      { id: "race-entries", label: "Race Entries", href: "/race-entries" },
      { id: "practice", label: "Practice", href: "/practice" },
      { id: "calendar", label: "Calendar", href: "/calendar" },
      { id: "results", label: "Results", href: "/results" },
      { id: "documents", label: "Documents and Rules", href: "/documents" },
    ],
  },
  {
    id: "footer-start-karting",
    title: "Start Karting",
    links: [
      { id: "start-karting", label: "Start Karting", href: "/start-karting" },
      {
        id: "pathway-to-karting",
        label: "Pathway to Karting",
        href: "/start-karting/pathway-to-karting",
      },
      { id: "costs", label: "Costs", href: "/start-karting/costs" },
      { id: "licences", label: "Licences", href: "/start-karting/licences" },
      { id: "buying-a-kart", label: "Buying a Kart", href: "/start-karting/buying-a-kart" },
      { id: "parents", label: "Parents", href: "/start-karting/parents" },
    ],
  },
  {
    id: "footer-venue",
    title: "Venue and Visitors",
    links: [
      { id: "venue", label: "Venue", href: "/venue" },
      { id: "visiting-racers", label: "Visiting Racers", href: "/visiting-racers" },
      { id: "calendar", label: "Calendar", href: "/calendar" },
      { id: "practice", label: "Practice", href: "/practice" },
    ],
  },
  {
    id: "footer-club",
    title: "Club",
    links: [
      { id: "contact", label: "Contact", href: "/contact" },
      { id: "sponsors", label: "Sponsors", href: "/sponsors" },
      { id: "volunteers", label: "Volunteers", href: "/volunteers" },
      { id: "news", label: "News", href: "/news" },
      { id: "faq", label: "FAQ", href: "/faq" },
    ],
  },
];
