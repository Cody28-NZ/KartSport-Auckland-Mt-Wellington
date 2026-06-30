import type { ReactNode } from "react";
import type { Cta, RelatedLink } from "@/types/content";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { RelatedLinks } from "@/components/site/RelatedLinks";
import { SourceOfTruthNotice } from "@/components/site/SourceOfTruthNotice";
import { CtaPanel } from "@/components/site/CtaPanel";
import { Container } from "@/components/ui/Container";
import { cn, sectionDefault } from "@/lib/cn";

export interface SimplePageSection {
  id: string;
  heading: string;
  body: string[];
  eyebrow?: string;
  children?: ReactNode;
}

interface SimplePageProps {
  headline: string;
  subheading: string;
  eyebrow?: string;
  heroMediaId?: string;
  sections: SimplePageSection[];
  afterHero?: ReactNode;
  afterSections?: ReactNode;
  relatedLinks?: RelatedLink[];
  primaryCta?: Cta;
  secondaryCta?: Cta;
}

export function SimplePage({
  headline,
  subheading,
  eyebrow,
  heroMediaId,
  sections,
  afterHero,
  afterSections,
  relatedLinks,
  primaryCta,
  secondaryCta,
}: SimplePageProps) {
  const sectionVariants = ["default", "muted", "elevated"] as const;

  return (
    <>
      <Hero
        eyebrow={eyebrow}
        headline={headline}
        subheading={subheading}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        mediaId={heroMediaId}
      />

      {afterHero}

      {sections.map((section, index) => (
        <Section
          key={section.id}
          id={section.id}
          eyebrow={section.eyebrow}
          heading={section.heading}
          body={section.body}
          variant={sectionVariants[index % sectionVariants.length]}
        >
          {section.children}
        </Section>
      ))}

      {afterSections}

      {relatedLinks?.length ? (
        <section className={cn(sectionDefault, "border-t border-border py-12")}>
          <Container>
            <RelatedLinks links={relatedLinks} />
          </Container>
        </section>
      ) : null}

      {primaryCta ? (
        <CtaPanel
          heading="Next step"
          body="Use the links above or continue below."
          primaryCta={primaryCta}
          secondaryCta={secondaryCta ?? { label: "Contact the club", href: "/contact", variant: "secondary" }}
        />
      ) : null}

      <section className={cn(sectionDefault, "border-t border-border py-10")}>
        <Container>
          <SourceOfTruthNotice />
        </Container>
      </section>
    </>
  );
}
