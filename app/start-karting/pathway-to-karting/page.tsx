import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { MemberActionPanel } from "@/components/site/MemberActionPanel";
import { Container } from "@/components/ui/Container";
import { memberActions } from "@/data/memberActions";

export const metadata = createPageMetadata({
  title: "Pathway to Karting | KartSport Auckland Mt Wellington",
  description: "Guided introduction to real KartSport racing for beginners who want help before buying a kart.",
});

export default function PathwayToKartingPage() {
  return (
    <SimplePage
      headline="Pathway to Karting"
      subheading="A guided introduction for people who want to understand real KartSport racing before buying a kart."
      heroMediaId="pathway-beginner-briefing"
      afterHero={
        <section className="border-b border-border py-8">
          <Container>
            <MemberActionPanel
              title="Register interest"
              description="Express interest in Pathway to Karting sessions. The club will contact you when sessions are available."
              actionLabel={memberActions.pathwayInterestForm.label}
              actionHref={memberActions.pathwayInterestForm.href}
              note={memberActions.pathwayInterestForm.note}
            />
          </Container>
        </section>
      }
      sections={[
        {
          id: "what-it-is",
          heading: "What it is",
          body: [
            "Pathway to Karting is KartSport Auckland Mt Wellington's introductory programme for people new to owner-driver karting.",
            "It helps you understand how club karting works, what to expect at the track, and what to do before buying equipment.",
          ],
        },
        {
          id: "what-it-is-not",
          heading: "What it is not",
          body: [
            "This is not casual hire karting or an arrive-and-drive entertainment venue.",
            "It is not a shortcut to racing without licences, safety gear or club membership.",
            "It does not replace KartSport NZ rules or official licence requirements.",
          ],
        },
        {
          id: "who-for",
          heading: "Who it is for",
          body: [
            "Parents and juniors considering karting.",
            "Adult beginners who want a structured introduction.",
            "Anyone who enjoyed hire karts but wants to understand real club racing before spending money.",
          ],
        },
        {
          id: "what-happens",
          heading: "What happens",
          body: [
            "Session format, duration and activities are to confirm with the club.",
            "Typically includes an introduction to the paddock, explanation of classes and licences, and answers to your questions.",
            "You should leave with a clear next step: further reading, membership, licence application or another session.",
          ],
        },
        {
          id: "what-to-bring",
          heading: "What to bring",
          body: [
            "Comfortable closed-toe shoes and weather-appropriate clothing.",
            "A notebook and questions. Parent or guardian attendance may be required for juniors.",
            "Do not purchase a kart or major safety gear before confirming your pathway with the club.",
          ],
        },
        {
          id: "after",
          heading: "What happens after",
          body: [
            "Many participants move on to reading Start Karting, applying for membership and a KartSport NZ licence, and attending practice when ready.",
            "The club can point you to experienced members and class mentors. Contact details are on the Contact page.",
          ],
        },
      ]}
      relatedLinks={[
        { label: "Start Karting", href: "/start-karting" },
        { label: "Costs", href: "/start-karting/costs" },
        { label: "Licences", href: "/start-karting/licences" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "Contact the club", href: "/contact", variant: "primary" }}
      secondaryCta={{ label: "Start Karting guide", href: "/start-karting", variant: "secondary" }}
    />
  );
}
