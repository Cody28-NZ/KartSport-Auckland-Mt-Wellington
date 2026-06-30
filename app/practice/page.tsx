import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { MemberActionPanel } from "@/components/site/MemberActionPanel";
import { TrackAvailabilityPanel } from "@/components/site/TrackAvailabilityPanel";
import { Container } from "@/components/ui/Container";
import { memberActions } from "@/data/memberActions";

export const metadata = createPageMetadata({
  title: "Practice | KartSport Auckland Mt Wellington",
  description: "Practice days at Sir Colin Giltrap Raceway. Registration, eligibility and what to bring.",
});

export default function PracticePage() {
  return (
    <>
      <SimplePage
        headline="Practice"
        subheading="Scheduled practice sessions for licenced drivers at Sir Colin Giltrap Raceway."
        eyebrow="Members"
        afterHero={
          <>
            <section className="border-b border-border py-8">
              <Container>
                <MemberActionPanel
                  title="Practice registration"
                  description="Register or sign in for practice using the club process."
                  actionLabel={memberActions.practiceRegistration.label}
                  actionHref={memberActions.practiceRegistration.href}
                  note={memberActions.practiceRegistration.note}
                />
              </Container>
            </section>
            <TrackAvailabilityPanel compact limit={5} className="border-b border-border py-8" />
          </>
        }
        sections={[
          {
            id: "eligibility",
            heading: "Who can practise",
            body: [
              "Practice is for drivers with a valid KartSport NZ licence, compliant kart and safety gear, subject to club rules.",
              "Eligibility, session times and fees are to confirm. Check track availability before travelling.",
            ],
          },
          {
            id: "visitors",
            heading: "Visiting drivers",
            body: [
              "Licenced drivers from other clubs may practise at Auckland subject to club rules, capacity and fees.",
              "See Visiting Racers for what to check before you travel.",
            ],
          },
          {
            id: "what-to-bring",
            heading: "What to bring",
            body: [
              "Kart, safety gear, fuel and basic tools as required for your class.",
              "Licence and membership details for sign-in.",
              "Check track availability and the calendar on the day you plan to visit.",
            ],
          },
        ]}
        relatedLinks={[
          { label: "Calendar", href: "/calendar" },
          { label: "Visiting Racers", href: "/visiting-racers" },
          { label: "Documents and Rules", href: "/documents" },
          { label: "Contact", href: "/contact" },
        ]}
        primaryCta={{ label: "Calendar", href: "/calendar", variant: "primary" }}
        secondaryCta={{ label: "Contact if unsure", href: "/contact", variant: "secondary" }}
      />
    </>
  );
}
