import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";

export const metadata = createPageMetadata({
  title: "Visiting Racers | KartSport Auckland Mt Wellington",
  description: "Information for visiting racers practising or racing at Sir Colin Giltrap Raceway.",
});

export default function VisitingRacersPage() {
  return (
    <SimplePage
      headline="Visiting Racers"
      subheading="What visiting racers need to check before practising or racing at KartSport Auckland Mt Wellington."
      sections={[
        {
          id: "check-first",
          heading: "What to check first",
          body: [
            "Confirm track availability and the calendar before travelling.",
            "Check whether the event or practice session accepts visitors.",
            "Read supplementary regulations for major events if applicable.",
          ],
        },
        {
          id: "practice",
          heading: "Visitor practice",
          body: [
            "Visiting licenced drivers may practise subject to club rules, capacity and fees.",
            "Sign-in process and fees are to confirm. See Practice for the current registration link.",
          ],
        },
        {
          id: "race-entry",
          heading: "Race entry",
          body: [
            "Enter through the club race entry process for the event you plan to attend.",
            "Confirm class eligibility, licence grade and entry deadlines.",
            "Transponder hire for visitors may be a separate fee.",
          ],
        },
        {
          id: "licence-rules",
          heading: "Licence and rules",
          body: [
            "You must hold a valid KartSport NZ licence and comply with current rules and safety gear standards.",
            "KartSport New Zealand is the source of truth. See Documents and Rules for official links.",
          ],
        },
        {
          id: "venue",
          heading: "At the track",
          body: [
            "Study the venue information before arrival. Pit rules and session procedures may differ from your home club.",
            "Attend drivers briefings and follow local flag signals and grid procedures.",
          ],
        },
      ]}
      relatedLinks={[
        { label: "Practice", href: "/practice" },
        { label: "Race Entries", href: "/race-entries" },
        { label: "Calendar", href: "/calendar" },
        { label: "Venue", href: "/venue" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "Contact", href: "/contact", variant: "primary" }}
      secondaryCta={{ label: "Race Entries", href: "/race-entries", variant: "secondary" }}
    />
  );
}
