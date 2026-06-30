import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { CardGrid } from "@/components/site/CardGrid";
import { InfoCard } from "@/components/site/InfoCard";
import { costItems } from "@/data/costs";

export const metadata = createPageMetadata({
  title: "Costs | KartSport Auckland Mt Wellington",
  description: "Karting cost categories for Auckland beginners. Exact fees to confirm.",
});

export default function CostsPage() {
  return (
    <SimplePage
      headline="Costs"
      subheading="Understand karting cost categories before you spend money. Figures are to confirm unless published by the club or KartSport NZ."
      sections={[
        {
          id: "categories",
          heading: "Main cost categories",
          body: [
            "Karting can be affordable at club level or expensive at the top. It depends on class, how much you buy new, and how many events you do.",
          ],
          children: (
            <CardGrid columns={2}>
              {costItems.map((item) => (
                <InfoCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  body={`${item.description} Estimate: ${item.estimate}.`}
                />
              ))}
            </CardGrid>
          ),
        },
        {
          id: "avoid-waste",
          heading: "Ways to avoid wasting money",
          body: [
            "Do not buy a kart or major gear before confirming class and licence pathway.",
            "Second-hand packages can save money but may need immediate work. Get an experienced opinion.",
            "Buy into a well-supported local class to reduce spares and setup guesswork.",
            "Budget for practice, race entries, tyres, fuel and maintenance, not just the kart purchase.",
          ],
        },
      ]}
      relatedLinks={[
        { label: "Start Karting", href: "/start-karting" },
        { label: "Licences", href: "/start-karting/licences" },
        { label: "Buying a Kart", href: "/start-karting/buying-a-kart" },
        { label: "Pathway to Karting", href: "/start-karting/pathway-to-karting" },
      ]}
      primaryCta={{ label: "Contact", href: "/contact", variant: "primary" }}
    />
  );
}
