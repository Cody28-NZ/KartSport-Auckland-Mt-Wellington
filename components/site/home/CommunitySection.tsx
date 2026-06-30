import { Container } from "@/components/ui/Container";
import { InfoCard } from "@/components/site/InfoCard";
import { SiteImage } from "@/components/site/SiteImage";
import { cn, cardBase, sectionMuted, sectionHome, textEyebrow } from "@/lib/cn";

export function CommunitySection() {
  return (
    <section className={cn(sectionMuted, sectionHome)}>
      <Container>
        <p className={textEyebrow}>Community</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Supported by partners and volunteers
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-ink-muted sm:text-base">
          Club racing depends on volunteers, officials, sponsors and families.
        </p>

        <div className="relative mt-6 min-h-[10rem] overflow-hidden rounded-lg border border-border shadow-sm sm:min-h-[12rem] lg:min-h-[14rem]">
          <SiteImage
            src="/images/community.png"
            alt="Karting community and volunteers at Auckland club events"
            fill
            sizes="100vw"
          />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[12rem_1fr] lg:items-start">
          <div className={cn(cardBase, "relative flex items-center justify-center p-4")}>
            <div className="relative h-14 w-full max-w-[10rem]">
              <SiteImage
                src="/images/giltrap-logo.jpg"
                alt="Giltrap - principal sponsor"
                fill
                sizes="160px"
                imageClassName="object-contain"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <InfoCard
              id="sponsors"
              title="Sponsors"
              body="Partners who support Auckland karting."
              href="/sponsors"
              ctaLabel="View sponsors"
            />
            <InfoCard
              id="volunteers"
              title="Volunteers and officials"
              body="Help run safe, fair club days."
              href="/volunteers"
              ctaLabel="Get involved"
            />
            <InfoCard
              id="contact-club"
              title="Contact the club"
              body="Membership, racing and general enquiries."
              href="/contact"
              ctaLabel="Contact"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
