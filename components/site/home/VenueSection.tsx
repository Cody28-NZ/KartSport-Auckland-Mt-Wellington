import { Container } from "@/components/ui/Container";
import { InfoCard } from "@/components/site/InfoCard";
import { SiteImage } from "@/components/site/SiteImage";
import { venueName, venuePark } from "@/data/venue";
import { cn, sectionDefault, sectionHome } from "@/lib/cn";

export function VenueSection() {
  return (
    <section className={cn(sectionDefault, sectionHome)}>
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {venueName}
        </h2>
        <p className="mt-2 text-sm text-ink-muted sm:text-base">
          Home of KartSport Auckland Mt Wellington at {venuePark}.
        </p>

        <div className="relative mt-6 min-h-[12rem] overflow-hidden rounded-lg border border-border shadow-sm sm:min-h-[14rem] lg:min-h-[16rem]">
          <SiteImage
            src="/images/track-wide.png"
            alt="Wide view of Sir Colin Giltrap Raceway at Colin Dale Park"
            fallbackSrc="/images/hero.jpg"
            fill
            sizes="100vw"
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard id="venue-page" title="Venue" body="Overview, getting here and facilities." href="/venue" ctaLabel="Venue" />
          <InfoCard id="venue-visiting" title="Visiting Racers" body="Information for visiting drivers." href="/visiting-racers" ctaLabel="Visiting racers" />
          <InfoCard id="venue-practice" title="Practice" body="Practice days and registration." href="/practice" ctaLabel="Practice" />
          <InfoCard id="venue-calendar" title="Calendar" body="Upcoming club activity." href="/calendar" ctaLabel="Calendar" />
        </div>
      </Container>
    </section>
  );
}
