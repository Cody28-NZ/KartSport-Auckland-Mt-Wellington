import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { SponsorGrid } from "@/components/site/SponsorGrid";
import { SponsorLead } from "@/components/site/SponsorLead";
import { sponsors } from "@/data/sponsors";

export const metadata = createPageMetadata({
  title: "Sponsors | KartSport Auckland Mt Wellington",
  description: "Current sponsors and sponsorship opportunities at KartSport Auckland Mt Wellington.",
});

export default function SponsorsPage() {
  return (
    <SimplePage
      headline="Sponsors"
      subheading="KartSport Auckland Mt Wellington is proudly supported by partners in the Auckland motorsport community."
      heroMediaId="sponsor-community"
      sections={[
        {
          id: "current",
          heading: "Current sponsors",
          body: [
            "Thank you to our sponsors for supporting club karting at Sir Colin Giltrap Raceway.",
          ],
          children: <SponsorGrid items={sponsors} />,
        },
        {
          id: "giltrap",
          heading: "Giltrap support",
          body: [
            "Giltrap is a principal supporter of KartSport Auckland Mt Wellington and Sir Colin Giltrap Raceway.",
            "Sponsorship details and approved branding are to confirm with the club.",
          ],
        },
        {
          id: "opportunities",
          heading: "Sponsorship opportunities",
          body: [
            "Businesses can partner with the club through sponsorship packages tailored to event visibility, community engagement and brand alignment.",
            "Packages and deliverables are to confirm with the sponsorship contact.",
          ],
          children: <SponsorLead />,
        },
      ]}
      relatedLinks={[
        { label: "Contact", href: "/contact" },
        { label: "Volunteers", href: "/volunteers" },
        { label: "News", href: "/news" },
      ]}
      primaryCta={{ label: "Sponsorship enquiry", href: "/contact", variant: "primary" }}
    />
  );
}
