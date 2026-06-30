import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { TrackAvailabilityStrip } from "@/components/site/TrackAvailabilityStrip";
import {
  cn,
  cardElevated,
  sectionDefault,
  textMeasureSection,
} from "@/lib/cn";

const memberCards = [
  {
    title: "Race Entries",
    body: "Enter the next club day or race meeting.",
    href: "/race-entries",
    cta: "Enter now",
  },
  {
    title: "Practice",
    body: "Practice information and registration.",
    href: "/practice",
    cta: "Practice info",
  },
  {
    title: "Calendar",
    body: "Upcoming club days, practice and events.",
    href: "/calendar",
    cta: "View calendar",
  },
  {
    title: "Results",
    body: "Latest results and track records.",
    href: "/results",
    cta: "View results",
  },
  {
    title: "Documents and Rules",
    body: "KartSport NZ rules and club documents.",
    href: "/documents",
    cta: "View documents",
  },
];

export function MemberQuickLinks() {
  return (
    <section className={cn(sectionDefault, "border-b border-border pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-14 lg:pb-16")}>
      <Container>
        <div className={cn(cardElevated, "border-brand/10 bg-gradient-to-b from-brand/[0.03] to-white p-6 sm:p-8")}>
          <TrackAvailabilityStrip className="mb-8 sm:mb-10 lg:mb-12" />

          <div className={textMeasureSection}>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Club member quick links
            </h2>
            <p className="mt-2 text-sm text-ink-muted sm:text-base">
              Race entries, practice, calendar, results and documents.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
            {memberCards.map((item) => (
              <article
                key={item.href}
                className={cn(
                  cardElevated,
                  "flex h-full flex-col border-brand/25 bg-white p-5 ring-1 ring-brand/15 sm:p-6",
                )}
              >
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{item.body}</p>
                <CtaButton
                  label={item.cta}
                  href={item.href}
                  variant="primary"
                  size="sm"
                  className="mt-4 w-full"
                  fullWidth
                />
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
