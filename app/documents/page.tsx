import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { DocumentList } from "@/components/site/DocumentList";
import { officialDocuments, clubDocuments } from "@/data/documents";

export const metadata = createPageMetadata({
  title: "Documents and Rules | KartSport Auckland Mt Wellington",
  description: "KartSport NZ rules, club documents and official links for karting at Auckland.",
});

export default function DocumentsPage() {
  return (
    <SimplePage
      headline="Documents and Rules"
      subheading="Official KartSport NZ rules and club documents. KartSport New Zealand is the source of truth for licences, classes and competition rules."
      sections={[
        {
          id: "official",
          heading: "KartSport NZ official documents",
          body: [
            "Licences, classes, safety gear and competition rules are defined by KartSport New Zealand.",
            "Always verify you are using the current version before relying on any document.",
          ],
          children: <DocumentList items={officialDocuments} heading="Official documents" />,
        },
        {
          id: "club",
          heading: "Club documents",
          body: [
            "Membership, practice, race entry and visitor forms published by KartSport Auckland Mt Wellington.",
            "Links and forms marked to confirm will be updated when approved by the committee.",
          ],
          children: <DocumentList items={clubDocuments} heading="Club documents" />,
        },
      ]}
      relatedLinks={[
        { label: "Licences", href: "/start-karting/licences" },
        { label: "Race Entries", href: "/race-entries" },
        { label: "Practice", href: "/practice" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "Start Karting", href: "/start-karting", variant: "primary" }}
    />
  );
}
