import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { CtaButton } from "@/components/ui/CtaButton";

export const metadata = createPageMetadata({
  title: "Start Karting | KartSport Auckland Mt Wellington",
  description: "Beginner guide to owner-driver KartSport racing at Sir Colin Giltrap Raceway.",
});

export default function StartKartingPage() {
  return (
    <SimplePage
      headline="Start Karting"
      subheading="Your guide to owner-driver KartSport racing at KartSport Auckland Mt Wellington."
      heroMediaId="parent-junior"
      primaryCta={{ label: "Pathway to Karting", href: "/start-karting/pathway-to-karting", variant: "primary" }}
      secondaryCta={{ label: "Contact", href: "/contact", variant: "secondary" }}
      sections={[
        {
          id: "real-karting",
          heading: "What is real karting?",
          body: [
            "Competition karting is organised motorsport. Drivers use purpose-built racing karts, wear approved safety gear, hold KartSport NZ licences, and race under officials and rules.",
            "It is different from hire kart venues, which are a fun taster but do not prepare you for owning, maintaining or scrutineering a competition kart.",
          ],
        },
        {
          id: "start-vs-pathway",
          heading: "Start Karting vs Pathway to Karting",
          body: [
            "Start Karting is this beginner guide. It explains the overall journey into club racing: what to understand, what to buy, and when.",
            "Pathway to Karting is the club's guided introduction programme for people who want help before buying a kart. It is a practical first step, not casual hire karting.",
          ],
          children: (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CtaButton label="Pathway to Karting" href="/start-karting/pathway-to-karting" variant="primary" className="sm:w-auto" fullWidth />
              <CtaButton label="Register interest" href="/start-karting/pathway-to-karting" variant="secondary" className="sm:w-auto" fullWidth />
            </div>
          ),
        },
        {
          id: "four-steps",
          heading: "Four steps into the sport",
          body: [
            "1. Understand real karting - read this guide and the FAQ.",
            "2. Try Pathway to Karting if you want guided help before buying.",
            "3. Understand costs and licences before spending money.",
            "4. Practise, then enter your first club race day.",
          ],
        },
        {
          id: "do-not-buy-early",
          heading: "Do not buy too early",
          body: [
            "Confirm your class, licence pathway and local grid before purchasing a kart or major safety gear.",
            "Ask the club and experienced members. Wrong class or non-compliant gear is an expensive mistake.",
            "Class choice depends on age, weight, budget and what runs locally at Auckland. Brief guidance is here; KartSport NZ rules are the source of truth.",
          ],
        },
        {
          id: "safety-gear",
          heading: "Safety gear",
          body: [
            "Helmets, suits, gloves, boots and other items must meet current KartSport NZ safety standards.",
            "Requirements vary by class and age. Verify every item against official regulations before purchase.",
            "See Documents and Rules for official safety gear links.",
          ],
        },
        {
          id: "learn-more",
          heading: "Learn more",
          body: [
            "Use the dedicated pages below for costs, licences, buying a kart and parent information.",
          ],
          children: (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CtaButton label="Costs" href="/start-karting/costs" variant="secondary" className="sm:w-auto" fullWidth />
              <CtaButton label="Licences" href="/start-karting/licences" variant="secondary" className="sm:w-auto" fullWidth />
              <CtaButton label="Buying a Kart" href="/start-karting/buying-a-kart" variant="secondary" className="sm:w-auto" fullWidth />
              <CtaButton label="Parents" href="/start-karting/parents" variant="secondary" className="sm:w-auto" fullWidth />
            </div>
          ),
        },
      ]}
    />
  );
}
