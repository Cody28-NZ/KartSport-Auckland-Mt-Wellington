import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { MemberActionPanel } from "@/components/site/MemberActionPanel";
import { CardGrid } from "@/components/site/CardGrid";
import { EventCard } from "@/components/site/EventCard";
import { Container } from "@/components/ui/Container";
import { memberActions } from "@/data/memberActions";
import { events } from "@/data/events";

export const metadata = createPageMetadata({
  title: "Race Entries | KartSport Auckland Mt Wellington",
  description: "Enter club race days and events at Sir Colin Giltrap Raceway.",
});

const upcomingRaces = events.filter((e) => e.type === "club-day" || e.type === "major-event");

export default function RaceEntriesPage() {
  return (
    <SimplePage
      headline="Race Entries"
      subheading="Enter club race days and events at KartSport Auckland Mt Wellington."
      eyebrow="Race at Auckland"
      afterHero={
        <section className="border-b border-border py-8">
          <Container>
            <MemberActionPanel
              title="Race entry form"
              description="Use the club race entry form or system for upcoming club days and events."
              actionLabel={memberActions.raceEntryForm.label}
              actionHref={memberActions.raceEntryForm.href}
              note={memberActions.raceEntryForm.note}
            />
          </Container>
        </section>
      }
      sections={[
        {
          id: "upcoming",
          heading: "Upcoming events",
          body: ["Check the calendar for confirmed dates before entering."],
          children: (
            <CardGrid columns={2}>
              {upcomingRaces.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </CardGrid>
          ),
        },
        {
          id: "before-entering",
          heading: "Before you enter",
          body: [
            "Confirm your KartSport NZ licence, class eligibility and safety gear compliance.",
            "Check supplementary regulations for the event if applicable.",
            "Enter early. Late entries may not be accepted if grids are already planned.",
            "Attend the drivers briefing on race day and follow flag signals and grid procedures.",
            "First-timers: read Start Karting and ask the club if anything is unclear.",
          ],
        },
      ]}
      relatedLinks={[
        { label: "Calendar", href: "/calendar" },
        { label: "Documents and Rules", href: "/documents" },
        { label: "Start Karting", href: "/start-karting" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "View calendar", href: "/calendar", variant: "primary" }}
      secondaryCta={{ label: "Contact if stuck", href: "/contact", variant: "secondary" }}
    />
  );
}
