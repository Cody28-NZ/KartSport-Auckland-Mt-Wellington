import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { VenueFactsGrid } from "@/components/site/VenueFactsGrid";
import { MediaImage } from "@/components/site/MediaImage";
import { venueFacts, venueName, venuePark } from "@/data/venue";

export const metadata = createPageMetadata({
  title: "Venue | KartSport Auckland Mt Wellington",
  description: "Sir Colin Giltrap Raceway at Colin Dale Park. Venue overview, getting here, facilities and spectators.",
});

export default function VenuePage() {
  return (
    <SimplePage
      headline={venueName}
      subheading={`Home of KartSport Auckland Mt Wellington at ${venuePark}, Auckland.`}
      heroMediaId="track-wide"
      sections={[
        {
          id: "overview",
          heading: "Venue overview",
          body: [
            "Sir Colin Giltrap Raceway is Auckland's purpose-built kart circuit at Colin Dale Park, Mt Wellington.",
            "The track hosts club practice, race days and major events run by KartSport Auckland Mt Wellington.",
          ],
          children: (
            <div className="relative mt-4 min-h-[14rem] overflow-hidden rounded-lg border border-border sm:min-h-[18rem]">
              <MediaImage mediaId="track-wide" minHeight="14rem" />
            </div>
          ),
        },
        {
          id: "facts",
          heading: "Venue information",
          body: ["Track details marked to confirm will be updated when verified by the club."],
          children: <VenueFactsGrid facts={venueFacts} />,
        },
        {
          id: "getting-here",
          heading: "Getting here",
          body: [
            "Sir Colin Giltrap Raceway is at Colin Dale Park, Mt Wellington, Auckland.",
            "Full street address, parking areas and arrival instructions are to confirm.",
            "Allow extra time on race mornings. Follow signage to competitor parking when advised.",
          ],
        },
        {
          id: "facilities",
          heading: "Facilities",
          body: [
            "Toilets, food, first aid, timing and spectator areas are to confirm.",
            "Check the calendar and track availability before travelling.",
          ],
        },
        {
          id: "pit-parking",
          heading: "Pit and parking",
          body: [
            "Competitor, official and spectator parking areas are to confirm.",
            "Pit layout, power access and paddock rules are to confirm on site.",
            "Drive slowly in the paddock. Kart trolleys cross pedestrian areas.",
          ],
        },
        {
          id: "spectators",
          heading: "Spectators",
          body: [
            "Spectators are welcome at club events. Viewing areas and access routes are to confirm.",
            "Follow officials' directions and park rules at Colin Dale Park.",
          ],
        },
      ]}
      relatedLinks={[
        { label: "Practice", href: "/practice" },
        { label: "Calendar", href: "/calendar" },
        { label: "Visiting Racers", href: "/visiting-racers" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "Calendar", href: "/calendar", variant: "primary" }}
    />
  );
}
