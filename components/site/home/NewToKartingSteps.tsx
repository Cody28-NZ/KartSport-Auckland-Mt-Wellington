import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { SiteImage } from "@/components/site/SiteImage";
import {
  cn,
  cardBase,
  cardInteractive,
  focusRing,
  sectionMuted,
  sectionHome,
  textLink,
} from "@/lib/cn";

type StepLink = { label: string; href: string };

type Step = {
  step: number;
  title: string;
  body: string;
  links: StepLink[];
};

const steps: Step[] = [
  {
    step: 1,
    title: "Understand real karting",
    body: "Learn how owner-driver KartSport racing works.",
    links: [{ label: "Start here", href: "/start-karting" }],
  },
  {
    step: 2,
    title: "Understand costs and licences",
    body: "Know what to budget for and what KartSport NZ requires.",
    links: [
      { label: "Costs", href: "/start-karting/costs" },
      { label: "Licences", href: "/start-karting/licences" },
    ],
  },
  {
    step: 3,
    title: "Try Pathway to Karting",
    body: "Get guided help before buying a kart.",
    links: [{ label: "Pathway to Karting", href: "/start-karting/pathway-to-karting" }],
  },
  {
    step: 4,
    title: "Practice",
    body: "Prepare for your first laps at the track.",
    links: [{ label: "Practice", href: "/practice" }],
  },
  {
    step: 5,
    title: "Race",
    body: "Enter a club day when you are ready.",
    links: [{ label: "Race Entries", href: "/race-entries" }],
  },
];

export function NewToKartingSteps() {
  return (
    <section className={cn(sectionMuted, sectionHome)}>
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            New to karting? Start here.
          </h2>
          <CtaButton
            label="Learn more"
            href="/start-karting"
            variant="secondary"
            size="sm"
            className="w-full shrink-0 sm:w-auto"
            fullWidth
          />
        </div>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] lg:items-stretch lg:gap-8">
          <div className="relative min-h-[14rem] overflow-hidden rounded-lg border border-border shadow-sm sm:min-h-[16rem] lg:min-h-[22rem]">
            <SiteImage
              src="/images/parent-junior.png"
              alt="Parent and junior driver at a KartSport Auckland club day"
              fallbackSrc="/images/junior.jpg"
              fill
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          </div>

          <ol className="relative min-w-0 space-y-2">
            {steps.map((item, index) => (
              <li key={item.step} className="relative pl-8">
                {index < steps.length - 1 ? (
                  <span
                    className="absolute left-[0.6875rem] top-8 bottom-0 w-px bg-brand/20"
                    aria-hidden="true"
                  />
                ) : null}
                <span
                  className="absolute left-0 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-[0.6875rem] font-semibold text-brand ring-1 ring-brand/20"
                  aria-hidden="true"
                >
                  {item.step}
                </span>
                <article className={cn(cardBase, cardInteractive, "p-3 sm:p-3.5")}>
                  <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-muted sm:text-sm">{item.body}</p>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {item.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn("text-xs sm:text-sm", textLink, focusRing)}
                      >
                        {link.label} &rarr;
                      </Link>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
