import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { cn, cardElevated, sectionDefault, sectionHome, textEyebrow } from "@/lib/cn";

export function HomeFinalCta() {
  return (
    <section className={cn(sectionDefault, sectionHome, "border-t border-border")}>
      <Container>
        <div className={cn(cardElevated, "overflow-hidden")}>
          <div className="bg-gradient-to-br from-brand/[0.06] via-white to-white p-6 sm:p-8 lg:p-10">
            <p className={textEyebrow}>Get involved</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Ready to get involved?
            </h2>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
                  For current members
                </h3>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <CtaButton label="Race Entries" href="/race-entries" variant="primary" className="sm:w-auto" fullWidth />
                  <CtaButton label="Practice" href="/practice" variant="secondary" className="sm:w-auto" fullWidth />
                  <CtaButton label="Calendar" href="/calendar" variant="secondary" className="sm:w-auto" fullWidth />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
                  For new starters
                </h3>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <CtaButton label="Start Karting" href="/start-karting" variant="primary" className="sm:w-auto" fullWidth />
                  <CtaButton label="Pathway to Karting" href="/start-karting/pathway-to-karting" variant="secondary" className="sm:w-auto" fullWidth />
                  <CtaButton label="Contact" href="/contact" variant="ghost" className="sm:w-auto" fullWidth />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
