import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SiteImage } from "@/components/site/SiteImage";
import {
  cn,
  cardBase,
  cardInteractive,
  focusRing,
  sectionMuted,
  tapTarget,
} from "@/lib/cn";

type Step = {
  step: number;
  title: string;
  body: string;
  href: string;
};

const steps: Step[] = [
  {
    step: 1,
    title: "Understand real karting",
    body: "Learn what owner-driver KartSport racing means.",
    href: "/start-karting",
  },
  {
    step: 2,
    title: "Understand costs and licences",
    body: "Know what to budget for before buying.",
    href: "/start-karting/costs",
  },
  {
    step: 3,
    title: "Try Pathway to Karting",
    body: "Try one of our karts on the track, and get some guided help before you buy.",
    href: "/start-karting/pathway-to-karting",
  },
  {
    step: 4,
    title: "Become a member and get a licence",
    body: "Join the club and apply for the right KartSport NZ licence.",
    href: "/start-karting/licences",
  },
  {
    step: 5,
    title: "Practice",
    body: "Prepare for your first laps at the track.",
    href: "/practice",
  },
  {
    step: 6,
    title: "Race",
    body: "Enter a club day when you are ready.",
    href: "/race-entries",
  },
];

function PathwayCta({ className }: { className?: string }) {
  return (
    <Link
      href="/start-karting"
      className={cn(
        focusRing,
        tapTarget,
        "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand",
        className,
      )}
    >
      <span className="text-sm leading-none" aria-hidden="true">
        🏁
      </span>
      Start Here
    </Link>
  );
}

export function NewToKartingSteps() {
  return (
    <section className={cn(sectionMuted, "py-7 sm:py-9 lg:py-10")}>
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          New to karting? Start here.
        </h2>

        <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[minmax(0,0.41fr)_minmax(0,0.59fr)] lg:items-stretch lg:gap-6">
          <div className="relative h-[17rem] overflow-hidden rounded-lg border border-border shadow-sm sm:h-[19rem] lg:h-[24rem]">
            <SiteImage
              src="/images/parent-junior.png"
              alt="Parent and junior driver at a KartSport Auckland club day"
              fallbackSrc="/images/junior.jpg"
              fill
              sizes="(max-width: 1024px) 100vw, 41vw"
              imageClassName="object-cover object-[center_35%] lg:object-center"
            />
          </div>

          <div className="flex min-w-0 flex-col lg:h-[24rem]">
            <ol className="relative space-y-0.5 lg:flex lg:flex-1 lg:flex-col lg:justify-between lg:space-y-0">
              {steps.map((item, index) => (
                <li key={item.step} className="relative pl-6">
                  {index < steps.length - 1 ? (
                    <span
                      className="absolute left-[0.4375rem] top-4 bottom-0 w-px bg-brand/20"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span
                    className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand/10 text-[0.5625rem] font-semibold text-brand ring-1 ring-brand/20"
                    aria-hidden="true"
                  >
                    {item.step}
                  </span>
                  <Link
                    href={item.href}
                    className={cn(
                      cardBase,
                      cardInteractive,
                      focusRing,
                      "block px-2 py-1 transition-colors hover:border-brand/25",
                    )}
                  >
                    <h3 className="text-sm font-semibold leading-tight text-ink">{item.title}</h3>
                    <p className="mt-0.5 text-xs leading-snug text-ink-muted">{item.body}</p>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="mt-3 flex justify-center sm:mt-4 lg:mt-2 lg:flex-shrink-0 lg:items-center lg:pb-0.5">
              <PathwayCta className="w-full max-w-sm sm:w-auto" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
