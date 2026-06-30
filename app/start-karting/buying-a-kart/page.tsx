import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";

export const metadata = createPageMetadata({
  title: "Buying a Kart | KartSport Auckland Mt Wellington",
  description: "Practical advice before buying your first competition kart.",
});

export default function BuyingAKartPage() {
  return (
    <SimplePage
      headline="Buying a Kart"
      subheading="Practical advice before you hand over money. Class, condition and local support matter more than bargains."
      sections={[
        {
          id: "do-not-buy-first",
          heading: "Do not buy first",
          body: [
            "Confirm your class, licence pathway and budget before purchasing.",
            "Consider Pathway to Karting or speaking with the club before committing.",
            "Wrong class or non-compliant equipment is difficult and expensive to fix.",
          ],
        },
        {
          id: "confirm-class",
          heading: "Confirm your class",
          body: [
            "Class choice depends on age, weight, budget and what runs at Auckland.",
            "Check current KartSport NZ class rules and local grid strength before buying.",
          ],
        },
        {
          id: "ask-club",
          heading: "Ask the club",
          body: [
            "Experienced members and class mentors can advise on what to look for locally.",
            "Ask about spares availability, engine support and who can help with setup.",
          ],
        },
        {
          id: "new-vs-used",
          heading: "New vs used",
          body: [
            "New karts offer certainty but higher upfront cost.",
            "Second-hand karts can be good value but may need immediate maintenance, engine work or compliance updates.",
            "Have an experienced person inspect any used kart before you buy.",
          ],
        },
        {
          id: "seller-questions",
          heading: "Questions for sellers",
          body: [
            "Why are they selling? What is the engine history? Any crashes or chassis repairs?",
            "Does it comply with current class rules? What is included (wheels, seat, extras)?",
            "Can you see it running or get a recent scrutineering report?",
          ],
        },
        {
          id: "support-spares",
          heading: "Support and spares",
          body: [
            "Buy into a class with local knowledge and parts availability.",
            "Factor in tyres, chains, sprockets, tools and transport from day one.",
          ],
        },
      ]}
      relatedLinks={[
        { label: "Start Karting", href: "/start-karting" },
        { label: "Costs", href: "/start-karting/costs" },
        { label: "Licences", href: "/start-karting/licences" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "Pathway to Karting", href: "/start-karting/pathway-to-karting", variant: "primary" }}
    />
  );
}
