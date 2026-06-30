import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";

export const metadata = createPageMetadata({
  title: "Parents | KartSport Auckland Mt Wellington",
  description: "What parents need to know about junior karting at KartSport Auckland Mt Wellington.",
});

export default function ParentsPage() {
  return (
    <SimplePage
      headline="Parents"
      subheading="What parents and guardians need to know about supporting a junior driver."
      heroMediaId="parent-junior"
      sections={[
        {
          id: "overview",
          heading: "What parents need to know",
          body: [
            "Junior club karting needs active parent or guardian involvement: transport, logistics, budget and paddock support.",
            "You are not just a spectator. Most juniors cannot do club karting without engaged parents.",
          ],
        },
        {
          id: "safety",
          heading: "Safety",
          body: [
            "Safety gear must meet current KartSport NZ standards. Scrutineering checks gear before drivers go on track.",
            "Flags and track rules are enforced by officials. Trust the process and reinforce it with your driver.",
            "See Documents and Rules for official safety requirements.",
          ],
        },
        {
          id: "time-cost",
          heading: "Time and cost commitment",
          body: [
            "Race days are long. Early starts, weather changes and full schedules are normal.",
            "Budget for kart, gear, membership, licence, practice, race entries and running costs. See Costs for categories.",
          ],
        },
        {
          id: "practice-race-days",
          heading: "Helping at practice and race days",
          body: [
            "Parents can usually help with kart preparation in the paddock. On-track access is restricted for safety.",
            "Know where sign-on, scrutineering and grid assembly happen. Ask on your first visit.",
            "Pack food, shade, weather gear and patience.",
          ],
        },
        {
          id: "supporting-driver",
          heading: "Supporting a junior driver",
          body: [
            "First race goal: finish cleanly and learn, not necessarily win.",
            "Encourage respect for officials, fellow drivers and volunteers.",
            "Pathway to Karting is a good first step if you are unsure where to begin.",
          ],
        },
      ]}
      relatedLinks={[
        { label: "Start Karting", href: "/start-karting" },
        { label: "Pathway to Karting", href: "/start-karting/pathway-to-karting" },
        { label: "Costs", href: "/start-karting/costs" },
        { label: "Contact", href: "/contact" },
      ]}
      primaryCta={{ label: "Contact the club", href: "/contact", variant: "primary" }}
    />
  );
}
