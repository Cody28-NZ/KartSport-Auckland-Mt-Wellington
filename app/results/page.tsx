import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { CardGrid } from "@/components/site/CardGrid";
import { InfoCard } from "@/components/site/InfoCard";
import { memberActions } from "@/data/memberActions";
import { cn, cardBase } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Results | KartSport Auckland Mt Wellington",
  description: "Latest results, club points and track records from KartSport Auckland Mt Wellington.",
});

function ResultsLinkCard({
  title,
  body,
  href,
  note,
}: {
  title: string;
  body: string;
  href: string;
  note?: string;
}) {
  const isConfirmed = href !== "to confirm" && href.startsWith("http");

  if (isConfirmed) {
    return (
      <InfoCard id={title} title={title} body={body} href={href} ctaLabel={`View ${title.toLowerCase()}`} featured />
    );
  }

  return (
    <article className={cn(cardBase, "p-5")}>
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{body}</p>
      <p className="mt-3 text-xs text-ink-subtle">{note ?? "Link to confirm."}</p>
    </article>
  );
}

export default function ResultsPage() {
  return (
    <SimplePage
      headline="Results"
      subheading="Latest results, club points and track records from KartSport Auckland Mt Wellington."
      sections={[
        {
          id: "results-hub",
          heading: "Results hub",
          body: [
            "Results are published after each race day when available.",
            "For official championship points, refer to KartSport New Zealand.",
          ],
          children: (
            <CardGrid columns={3}>
              <ResultsLinkCard
                title="Latest results"
                body="Recent club day and event results."
                href={memberActions.resultsUrl.href}
                note={memberActions.resultsUrl.note}
              />
              <ResultsLinkCard
                title="Club points"
                body="Season points for club championships."
                href={memberActions.clubPointsUrl.href}
                note={memberActions.clubPointsUrl.note}
              />
              <ResultsLinkCard
                title="Track records"
                body="Fastest laps at Sir Colin Giltrap Raceway by class."
                href={memberActions.trackRecordsUrl.href}
                note={memberActions.trackRecordsUrl.note}
              />
            </CardGrid>
          ),
        },
      ]}
      relatedLinks={[
        { label: "Calendar", href: "/calendar" },
        { label: "Race Entries", href: "/race-entries" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "Calendar", href: "/calendar", variant: "primary" }}
    />
  );
}
