import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { TrackAvailabilityPanel } from "@/components/site/TrackAvailabilityPanel";
import { CardGrid } from "@/components/site/CardGrid";
import { EventCard } from "@/components/site/EventCard";
import { events } from "@/data/events";

export const metadata = createPageMetadata({
  title: "Calendar | KartSport Auckland Mt Wellington",
  description: "Upcoming club days, practice sessions and events at Sir Colin Giltrap Raceway.",
});

export default function CalendarPage() {
  return (
    <SimplePage
      headline="Calendar"
      subheading="Upcoming club days, practice sessions and events at Sir Colin Giltrap Raceway."
      sections={[
        {
          id: "availability",
          heading: "Track availability",
          body: ["Check the next few days before travelling for practice or race days."],
          children: <TrackAvailabilityPanel compact limit={7} />,
        },
        {
          id: "events",
          heading: "Upcoming events",
          body: [
            "Dates and formats are updated as the season is confirmed.",
            "Race days, practice sessions, closures and Pathway to Karting sessions appear below when confirmed.",
          ],
          children: (
            <CardGrid columns={2}>
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </CardGrid>
          ),
        },
      ]}
      relatedLinks={[
        { label: "Race Entries", href: "/race-entries" },
        { label: "Practice", href: "/practice" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "Race Entries", href: "/race-entries", variant: "primary" }}
    />
  );
}
