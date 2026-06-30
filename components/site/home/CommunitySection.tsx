import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { InfoCard } from "@/components/site/InfoCard";
import { SiteImage } from "@/components/site/SiteImage";
import { cn, cardBase, sectionDefault, sectionHome } from "@/lib/cn";

export function CommunitySection() {
  return (
    <section className={cn(sectionDefault, sectionHome)}>
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
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

        <div className="mt-6 flex justify-center">
          <div
            className={cn(
              cardBase,
              "inline-flex w-full max-w-[20rem] items-center justify-center px-6 py-5 sm:max-w-[18rem] sm:px-8 sm:py-6 lg:max-w-[32rem] lg:px-10 lg:py-7",
            )}
          >
            <Image
              src="/images/giltrap-logo.jpg"
              alt="Giltrap - principal sponsor"
              width={520}
              height={160}
              className="h-auto w-full max-w-[15rem] object-contain sm:max-w-[18rem] lg:max-w-[26rem] xl:max-w-[32rem]"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-3">
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
      </Container>
    </section>
  );
}
