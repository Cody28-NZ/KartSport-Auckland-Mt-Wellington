import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { DocumentList } from "@/components/site/DocumentList";
import { officialDocuments } from "@/data/documents";
import { kartsportNzLicenceUrl } from "@/data/site";
import { cn, cardBase } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Licences | KartSport Auckland Mt Wellington",
  description: "Plain-English guide to KartSport NZ licences and club membership.",
});

const licenceDocs = officialDocuments.filter((d) => d.id === "ksnz-licensing" || d.id === "class-information");

export default function LicencesPage() {
  return (
    <SimplePage
      headline="Licences"
      subheading="Plain-English explanation of club membership and KartSport NZ licences."
      sections={[
        {
          id: "club-vs-licence",
          heading: "Club membership vs KartSport NZ licence",
          body: [
            "Club membership connects you with KartSport Auckland Mt Wellington locally: practice, race days and the paddock community.",
            "A KartSport NZ licence is required for most on-track competition activity and is issued by KartSport New Zealand, not the club.",
            "You may need both to race at Auckland. Requirements are to confirm for your age and class.",
          ],
        },
        {
          id: "who-issues",
          heading: "Who issues licences",
          body: [
            "KartSport Auckland Mt Wellington does not issue KartSport NZ licences.",
            "Apply through KartSport New Zealand using the current official process and forms.",
            "Licence names, grades and upgrade paths change. Always verify against official KartSport NZ documentation.",
          ],
          children: kartsportNzLicenceUrl !== "to confirm" ? null : (
            <div className={cn(cardBase, "mt-4 border-dashed p-4 text-sm text-ink-muted")}>
              Official KartSport NZ licence URL: to confirm. See Documents and Rules for links when published.
            </div>
          ),
        },
        {
          id: "official-links",
          heading: "Official links",
          body: ["Use these KartSport NZ resources as the source of truth."],
          children: <DocumentList items={licenceDocs} heading="Official licence resources" />,
        },
      ]}
      relatedLinks={[
        { label: "Documents and Rules", href: "/documents" },
        { label: "Start Karting", href: "/start-karting" },
        { label: "Practice", href: "/practice" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "Documents and Rules", href: "/documents", variant: "primary" }}
    />
  );
}
