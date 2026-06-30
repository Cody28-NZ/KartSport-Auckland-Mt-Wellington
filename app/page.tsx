import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { Hero } from "@/components/site/Hero";
import { NewsCard } from "@/components/site/NewsCard";
import { MemberQuickLinks } from "@/components/site/home/MemberQuickLinks";
import { NewToKartingSteps } from "@/components/site/home/NewToKartingSteps";
import { VenueSection } from "@/components/site/home/VenueSection";
import { CommunitySection } from "@/components/site/home/CommunitySection";
import { HomeFinalCta } from "@/components/site/home/HomeFinalCta";
import { newsPosts } from "@/data/news";
import type { NewsPost } from "@/types/content";
import { cn, focusRing, sectionHome, textLink } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "KartSport Auckland Mt Wellington | Real Kart Racing at Sir Colin Giltrap Raceway",
  description:
    "Race entries, practice, calendar and track availability for KartSport Auckland Mt Wellington. Start karting guides for parents, juniors and beginners.",
});

const HOME_NEWS_IMAGES = [
  { src: "/images/pack-racing.jpg", alt: "Karts racing at Sir Colin Giltrap Raceway" },
  { src: "/images/race-grid.jpg", alt: "Karts lined up on the grid before a club race day" },
  { src: "/images/junior.jpg", alt: "Junior driver at a KartSport Auckland club day" },
];

function getHomeNewsDisplay(
  post: NewsPost,
): Pick<NewsPost, "id" | "slug" | "title" | "summary" | "category" | "publishedAt" | "featured" | "status"> {
  return { ...post };
}

export default function HomePage() {
  const newsToShow = newsPosts.slice(0, 3).map(getHomeNewsDisplay);

  return (
    <>
      <Hero
        variant="home"
        headline="KartSport Auckland Mt Wellington"
        trustLine="Auckland's home of real kart racing."
        subheading="Compete, practise, or start karting at Sir Colin Giltrap Raceway, Colin Dale Park."
        primaryCta={{ label: "Race Entries", href: "/race-entries", variant: "primary" }}
        secondaryCta={{ label: "Practice", href: "/practice", variant: "secondary" }}
        tertiaryCta={{ label: "Calendar", href: "/calendar", variant: "secondary" }}
      />

      <MemberQuickLinks />

      <NewToKartingSteps />

      <VenueSection />

      <CommunitySection />

      <section className={cn("bg-surface", sectionHome)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-wide text-ink-subtle">News</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Latest from the club
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newsToShow.map((post, index) => (
              <NewsCard
                key={post.id}
                post={post}
                showImage
                imageSrc={HOME_NEWS_IMAGES[index]?.src}
                imageAlt={HOME_NEWS_IMAGES[index]?.alt}
              />
            ))}
          </div>
          <Link href="/news" className={cn("mt-5 inline-flex text-sm", textLink, focusRing)}>
            All club news &rarr;
          </Link>
        </div>
      </section>

      <HomeFinalCta />
    </>
  );
}
