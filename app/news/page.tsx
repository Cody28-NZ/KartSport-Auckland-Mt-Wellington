import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/site/Hero";
import { CardGrid } from "@/components/site/CardGrid";
import { NewsCard } from "@/components/site/NewsCard";
import { newsPosts } from "@/data/news";
import { cn, sectionDefault, textLink, focusRing } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "News | KartSport Auckland Mt Wellington",
  description: "Club news and updates from KartSport Auckland Mt Wellington.",
});

export default function NewsPage() {
  return (
    <>
      <Hero
        eyebrow="News"
        headline="Club news and updates"
        subheading="Announcements and updates from KartSport Auckland Mt Wellington."
        mediaId="news-event"
        primaryCta={{ label: "Calendar", href: "/calendar", variant: "primary" }}
        secondaryCta={{ label: "Contact", href: "/contact", variant: "secondary" }}
      />

      <section className={cn(sectionDefault, "py-12")}>
        <Container>
          <CardGrid columns={3} className="mt-2">
            {newsPosts.map((post) => (
              <NewsCard key={post.id} post={post} showImage />
            ))}
          </CardGrid>
          <p className="mt-8 text-sm text-ink-subtle">
            Looking for results? Visit{" "}
            <Link href="/results" className={cn(textLink, focusRing)}>
              Results
            </Link>{" "}
            or the{" "}
            <Link href="/calendar" className={cn(textLink, focusRing)}>
              Calendar
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
