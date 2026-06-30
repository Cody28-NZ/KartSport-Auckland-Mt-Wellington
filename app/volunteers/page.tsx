import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";

export const metadata = createPageMetadata({
  title: "Volunteers | KartSport Auckland Mt Wellington",
  description: "Volunteer and officiate at KartSport Auckland Mt Wellington race days and events.",
});

export default function VolunteersPage() {
  return (
    <SimplePage
      headline="Volunteers"
      subheading="Karting runs on volunteers. Race control, scrutineering, grid and more - find your role."
      heroMediaId="sponsor-community"
      sections={[
        {
          id: "why",
          heading: "Why volunteers matter",
          body: [
            "Club race days need people behind the scenes: registration, paddock support, canteen, setup and more.",
            "Without volunteers and officials, karting does not happen safely or fairly.",
          ],
        },
        {
          id: "roles",
          heading: "Roles",
          body: [
            "Race control, scrutineering, grid marshals, registration, timing support and paddock helpers are common roles.",
            "Time commitments vary. Some roles need a few hours, others a full day.",
            "You do not need racing experience for many volunteer roles. Training is provided on the day.",
          ],
        },
        {
          id: "officials",
          heading: "Officials",
          body: [
            "KartSport officials are trained through KartSport New Zealand pathways.",
            "The club can point you to local opportunities and training. Details are to confirm with KartSport NZ.",
          ],
        },
        {
          id: "help",
          heading: "How to help",
          body: [
            "Contact the club to register interest in volunteering or becoming an official.",
            "Working bees and pre-season setup also need helpers. Watch club news and the calendar.",
          ],
        },
      ]}
      relatedLinks={[
        { label: "Contact", href: "/contact" },
        { label: "Sponsors", href: "/sponsors" },
        { label: "News", href: "/news" },
      ]}
      primaryCta={{ label: "Volunteer enquiry", href: "/contact", variant: "primary" }}
    />
  );
}
