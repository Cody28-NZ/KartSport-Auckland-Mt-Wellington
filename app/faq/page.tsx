import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { faqs } from "@/data/faqs";

export const metadata = createPageMetadata({
  title: "FAQ | KartSport Auckland Mt Wellington",
  description: "Frequently asked questions about starting karting, practice, race entries and licences.",
});

export default function FaqPage() {
  return (
    <SimplePage
      headline="FAQ"
      subheading="Practical answers for beginners, parents and members."
      sections={[
        {
          id: "questions",
          heading: "Common questions",
          body: ["If your question is not answered here, contact the club."],
          children: <FaqAccordion items={faqs} />,
        },
      ]}
      relatedLinks={[
        { label: "Start Karting", href: "/start-karting" },
        { label: "Pathway to Karting", href: "/start-karting/pathway-to-karting" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "Contact", href: "/contact", variant: "primary" }}
    />
  );
}
