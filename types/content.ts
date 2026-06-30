export type ContentStatus = "published" | "draft" | "to-confirm" | "archived";

export type SourceType =
  | "club"
  | "kartsport-nz"
  | "external"
  | "internal"
  | "to-confirm";

export type CtaVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "external";

export type Audience =
  | "beginner"
  | "parent"
  | "junior"
  | "adult-beginner"
  | "hire-kart-driver"
  | "existing-racer"
  | "visiting-racer"
  | "sponsor"
  | "volunteer"
  | "official"
  | "all";

export const DEFAULT_CLUB_ID = "kartsport-auckland";

export interface SeoMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

export interface Cta {
  label: string;
  href: string;
  variant?: CtaVariant;
  external?: boolean;
  helperText?: string;
}

export interface ImagePlaceholder {
  id: string;
  alt: string;
  brief: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "portrait" | "wide";
  recommendedUse?: string;
  /** When set, renders from /data/media.ts instead of gradient placeholder */
  mediaId?: string;
}

export type MediaStatus = "approved" | "placeholder" | "needs-replacement" | "to-confirm";

export type MediaAspectRatio = "16:9" | "4:3" | "1:1" | "3:4" | "21:9" | "3:2";

export type MediaPriority = "hero" | "high" | "normal" | "low";

export interface MediaImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  credit: string;
  status: MediaStatus;
  usage: string[];
  priority: MediaPriority;
  aspectRatio: MediaAspectRatio;
}

export interface TodoItem {
  label: string;
  detail: string;
  owner?: string;
  priority?: "low" | "medium" | "high";
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface ContentCard {
  id: string;
  title: string;
  body: string;
  href?: string;
  ctaLabel?: string;
  icon?: string;
  badge?: string;
}

export interface PageSection {
  id: string;
  eyebrow?: string;
  heading: string;
  body: string[];
  cards?: ContentCard[];
  checklistId?: string;
  faqs?: string[];
  ctas?: Cta[];
  image?: ImagePlaceholder;
}

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  navLabel?: string;
  audience: Audience[];
  status: ContentStatus;
  seo: SeoMeta;
  hero: {
    eyebrow?: string;
    headline: string;
    subheading: string;
    primaryCta?: Cta;
    secondaryCta?: Cta;
    image?: ImagePlaceholder;
  };
  intro?: string[];
  sections: PageSection[];
  relatedLinks?: RelatedLink[];
  todos?: TodoItem[];
  lastReviewed?: string;
  clubId?: string;
}

export type PathwayLevel =
  | "level-1-curious"
  | "level-2-try"
  | "level-3-join"
  | "level-4-have-kart"
  | "level-5-first-race"
  | "level-6-get-faster"
  | "level-7-serious";

export interface PathwayLevelInfo {
  level: PathwayLevel;
  title: string;
  shortTitle: string;
  purpose: string;
  whoFor: string;
  order: number;
  articleSlugs: string[];
  relatedLinks?: RelatedLink[];
  cta?: Cta;
  clubId?: string;
}

export interface PathwayArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  whoFor: string;
  audience: Audience[];
  level: PathwayLevel;
  readingTime: string;
  seo: SeoMeta;
  heroImage?: ImagePlaceholder;
  mainContent: PageSection[];
  checklist?: string[];
  commonMistakes?: string[];
  relatedLinks: RelatedLink[];
  cta: Cta;
  officialSourceNote?: string;
  status: ContentStatus;
  todos?: TodoItem[];
  lastReviewed?: string;
  clubId?: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  audience: Audience[];
  seo: SeoMeta;
  heroImage?: ImagePlaceholder;
  readingTime?: string;
  sections: PageSection[];
  checklistIds?: string[];
  relatedLinks: RelatedLink[];
  cta: Cta;
  status: ContentStatus;
  todos?: TodoItem[];
  lastReviewed?: string;
  clubId?: string;
}

export type FaqCategory =
  | "beginner"
  | "parent"
  | "membership"
  | "licence"
  | "practice"
  | "race-day"
  | "track"
  | "sponsor"
  | "volunteer"
  | "rules";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  relatedLinks?: RelatedLink[];
  status: ContentStatus;
  lastReviewed?: string;
  clubId?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  shortDefinition: string;
  fullDefinition?: string;
  category?:
    | "driving"
    | "race-day"
    | "kart"
    | "rules"
    | "setup"
    | "licence"
    | "general";
  relatedLinks?: RelatedLink[];
  ruleBased?: boolean;
  status: ContentStatus;
  clubId?: string;
}

export type ChecklistCategory =
  | "beginner"
  | "practice"
  | "race-day"
  | "buying"
  | "tools"
  | "safety"
  | "away-meeting"
  | "parent";

export interface Checklist {
  id: string;
  title: string;
  summary?: string;
  category: ChecklistCategory;
  items: string[];
  note?: string;
  downloadable?: boolean;
  status: ContentStatus;
  lastReviewed?: string;
  clubId?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
  audience?: Audience[];
  isUtility?: boolean;
  external?: boolean;
  futureFeature?: boolean;
  clubId?: string;
}

export interface ClassProfile {
  id: string;
  name: string;
  slug: string;
  summary: string;
  audience: Audience[];
  ageRange: string;
  engineType: string;
  localAvailability: string;
  beginnerSuitability: "to-confirm" | "low" | "medium" | "high";
  officialRulesUrl?: string;
  notes: string[];
  status: ContentStatus;
  todos?: TodoItem[];
  lastReviewed?: string;
  clubId?: string;
}

export interface CostItem {
  id: string;
  title: string;
  category:
    | "kart"
    | "safety-gear"
    | "membership"
    | "licence"
    | "practice"
    | "race-entry"
    | "running-cost"
    | "tools"
    | "transport";
  description: string;
  estimate: string;
  frequency?: "one-off" | "per-event" | "annual" | "ongoing" | "to-confirm";
  sourceType: SourceType;
  status: ContentStatus;
  lastReviewed?: string;
  todos?: TodoItem[];
  clubId?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  slug: string;
  tier: "principal" | "major" | "supporting" | "event" | "community" | "to-confirm";
  logoPlaceholder: ImagePlaceholder;
  websiteUrl?: string;
  description?: string;
  active: boolean;
  displayOrder: number;
  status: ContentStatus;
  todos?: TodoItem[];
  clubId?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category:
    | "membership"
    | "practice"
    | "race-entry"
    | "rules"
    | "safety"
    | "visitor"
    | "sponsor"
    | "volunteer"
    | "policy"
    | "official-link";
  description: string;
  href: string;
  external?: boolean;
  sourceType: SourceType;
  version?: string;
  lastUpdated: string;
  status: ContentStatus;
  todos?: TodoItem[];
  clubId?: string;
}

export type EventType =
  | "club-day"
  | "practice"
  | "major-event"
  | "pathway-session"
  | "working-bee"
  | "closure"
  | "meeting";

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  type: EventType;
  date: string;
  endDate?: string;
  timeLabel: string;
  location: string;
  summary: string;
  entryStatus: "open" | "opening-soon" | "closed" | "not-required" | "to-confirm";
  entryHref?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  status: ContentStatus;
  todos?: TodoItem[];
  clubId?: string;
}

export type NoticeType =
  | "track-open"
  | "track-closed"
  | "practice-unavailable"
  | "entries-open"
  | "entries-closed"
  | "weather"
  | "general";

export interface NoticeItem {
  id: string;
  type: NoticeType;
  title: string;
  message: string;
  severity: "info" | "success" | "warning" | "danger";
  href?: string;
  ctaLabel?: string;
  visible: boolean;
  startsAt?: string;
  endsAt?: string;
  lastUpdated: string;
  status: ContentStatus;
  clubId?: string;
}

export interface TrackStatus {
  status:
    | "open"
    | "closed"
    | "practice-unavailable"
    | "check-before-travelling"
    | "to-confirm";
  label: string;
  message: string;
  lastUpdated: string;
  nextReview?: string;
  reason?: string;
  cta?: Cta;
  showSiteWideAlert: boolean;
  statusNotes?: string[];
  todos?: TodoItem[];
  clubId?: string;
}

export interface VenueFact {
  id: string;
  label: string;
  value: string;
  icon?: string;
  sourceType: SourceType;
  status: ContentStatus;
  lastReviewed?: string;
  clubId?: string;
}

export type ContactType =
  | "beginner"
  | "membership"
  | "practice"
  | "race-entry"
  | "sponsorship"
  | "volunteering"
  | "general";

export interface ContactItem {
  id: string;
  type: ContactType;
  label: string;
  description: string;
  email: string;
  phone?: string;
  formSubject?: string;
  responseNote?: string;
  status: ContentStatus;
  todos?: TodoItem[];
  clubId?: string;
}

export type NewsCategory =
  | "event"
  | "race"
  | "sponsor"
  | "club"
  | "announcement"
  | "general";

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: NewsCategory;
  publishedAt: string;
  author?: string;
  featured?: boolean;
  seo: SeoMeta;
  heroImage?: ImagePlaceholder;
  sections: PageSection[];
  relatedLinks?: RelatedLink[];
  status: ContentStatus;
  lastReviewed?: string;
  clubId?: string;
}

export type CtaCardPlacement =
  | "home"
  | "beginner"
  | "practice"
  | "race"
  | "track"
  | "sponsor"
  | "volunteer"
  | "footer"
  | "article";

export interface CtaCard {
  id: string;
  title: string;
  body: string;
  cta: Cta;
  audience: Audience[];
  placement: CtaCardPlacement;
  icon?: string;
  status: ContentStatus;
  clubId?: string;
}
