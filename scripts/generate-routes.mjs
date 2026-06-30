import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.join(__dirname, "..");

const contentPages = [
  ["app/start-karting/page.tsx", "start-karting", "StartKartingPage"],
  ["app/start-karting/new-to-karting/page.tsx", "new-to-karting", "NewToKartingPage"],
  ["app/start-karting/pathway-to-karting/page.tsx", "pathway-to-karting", "PathwayToKartingPage"],
  ["app/start-karting/how-to-join/page.tsx", "how-to-join", "HowToJoinPage"],
  ["app/start-karting/licences-explained/page.tsx", "licences-explained", "LicencesExplainedPage"],
  ["app/start-karting/classes-explained/page.tsx", "classes-explained", "ClassesExplainedPage"],
  ["app/start-karting/costs-explained/page.tsx", "costs-explained", "CostsExplainedPage"],
  ["app/start-karting/safety-gear-guide/page.tsx", "safety-gear-guide", "SafetyGearGuidePage"],
  ["app/start-karting/buy-your-first-kart/page.tsx", "buy-your-first-kart", "BuyYourFirstKartPage"],
  ["app/practice/page.tsx", "practice", "PracticePage"],
  ["app/race-at-auckland/page.tsx", "race-at-auckland", "RaceAtAucklandPage"],
  ["app/race-at-auckland/race-entries/page.tsx", "race-entries", "RaceEntriesPage"],
  ["app/track/page.tsx", "track", "TrackPage"],
  ["app/track/status/page.tsx", "track-status", "TrackStatusPage"],
  ["app/track/guide/page.tsx", "track-guide", "TrackGuidePage"],
  ["app/calendar/page.tsx", "calendar", "CalendarPage"],
  ["app/results/page.tsx", "results", "ResultsPage"],
  ["app/results/track-records/page.tsx", "track-records", "TrackRecordsPage"],
  ["app/sponsors/page.tsx", "sponsors", "SponsorsPage"],
  ["app/volunteers-officials/page.tsx", "volunteers-officials", "VolunteersPage"],
  ["app/documents-rules/page.tsx", "documents-rules", "DocumentsRulesPage"],
  ["app/contact/page.tsx", "contact", "ContactPage"],
  ["app/faq/page.tsx", "faq", "FaqPage"],
  ["app/glossary/page.tsx", "glossary", "GlossaryPage"],
  ["app/search/page.tsx", "search", "SearchPage"],
];

const guidePages = [
  ["app/start-karting/first-practice-day/page.tsx", "first-practice-day", "FirstPracticeDayPage"],
  ["app/start-karting/first-race-day/page.tsx", "first-race-day", "FirstRaceDayPage"],
  ["app/start-karting/flags-track-etiquette/page.tsx", "flags-track-etiquette", "FlagsTrackEtiquettePage"],
  ["app/start-karting/parent-guardian-guide/page.tsx", "parent-guardian-guide", "ParentGuardianGuidePage"],
  ["app/practice/visitor-practice/page.tsx", "visitor-practice", "VisitorPracticePage"],
  ["app/race-at-auckland/race-day-timeline/page.tsx", "race-day-timeline", "RaceDayTimelinePage"],
  ["app/race-at-auckland/visiting-racers/page.tsx", "visiting-racers", "VisitingRacersPage"],
  ["app/race-at-auckland/club-days/page.tsx", "club-days", "ClubDaysPage"],
  ["app/race-at-auckland/major-events/page.tsx", "major-events", "MajorEventsPage"],
  ["app/track/rules/page.tsx", "track-rules", "TrackRulesPage"],
  ["app/track/facilities/page.tsx", "facilities", "FacilitiesPage"],
  ["app/track/getting-here/page.tsx", "getting-here", "GettingHerePage"],
  ["app/track/pit-parking/page.tsx", "pit-parking", "PitParkingPage"],
  ["app/results/archive/page.tsx", "results-archive", "ResultsArchivePage"],
  ["app/sponsors/opportunities/page.tsx", "sponsorship-opportunities", "SponsorshipOpportunitiesPage"],
  ["app/sponsors/current-sponsors/page.tsx", "current-sponsors", "CurrentSponsorsPage"],
  ["app/volunteers-officials/roles/page.tsx", "volunteer-roles", "VolunteerRolesPage"],
  ["app/volunteers-officials/become-an-official/page.tsx", "become-an-official", "BecomeAnOfficialPage"],
  ["app/documents-rules/forms/page.tsx", "forms", "FormsPage"],
  ["app/documents-rules/official-rules/page.tsx", "official-rules", "OfficialRulesPage"],
  ["app/about/page.tsx", "about", "AboutPage"],
  ["app/about/history/page.tsx", "history", "HistoryPage"],
  ["app/about/committee/page.tsx", "committee", "CommitteePage"],
];

function contentPageTemplate(id, name) {
  return `import { notFound } from "next/navigation";
import { ContentPage } from "@/components/layout/ContentPage";
import { getPageById } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

const pageData = getPageById("${id}");

export const metadata = pageData
  ? createPageMetadata(pageData.seo)
  : { title: "Page not found" };

export default function ${name}() {
  const page = getPageById("${id}");
  if (!page) notFound();
  return <ContentPage page={page} />;
}
`;
}

function guidePageTemplate(slug, name) {
  return `import { notFound } from "next/navigation";
import { GuidePage } from "@/components/layout/GuidePage";
import { getGuideBySlug } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

const guideData = getGuideBySlug("${slug}");

export const metadata = guideData
  ? createPageMetadata(guideData.seo)
  : { title: "Page not found" };

export default function ${name}() {
  const guide = getGuideBySlug("${slug}");
  if (!guide) notFound();
  return <GuidePage guide={guide} />;
}
`;
}

for (const [file, id, name] of contentPages) {
  const fullPath = path.join(root, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, contentPageTemplate(id, name));
}

for (const [file, slug, name] of guidePages) {
  const fullPath = path.join(root, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, guidePageTemplate(slug, name));
}

console.log(`Generated ${contentPages.length + guidePages.length} route files`);
