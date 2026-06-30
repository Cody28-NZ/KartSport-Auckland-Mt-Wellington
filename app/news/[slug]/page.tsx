import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/metadata";
import { getNewsBySlug } from "@/lib/content";
import { newsPosts } from "@/data/news";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { RelatedLinks } from "@/components/site/RelatedLinks";
import { ToConfirmNotice } from "@/components/site/ToConfirmNotice";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Container } from "@/components/ui/Container";
import { formatDate } from "@/lib/format";
import { getNewsMediaId } from "@/lib/media";

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return newsPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) return { title: "News not found" };
  return createPageMetadata(post.seo);
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <Hero
        eyebrow={`News · ${formatDate(post.publishedAt)}`}
        headline={post.title}
        subheading={post.summary}
        mediaId={getNewsMediaId(post.slug)}
      />

      <div className="border-b border-border bg-surface-alt py-4">
        <Container className="flex flex-wrap items-center gap-3">
          <StatusBadge status={post.status} />
          {post.author ? <span className="text-sm text-ink-subtle">{post.author}</span> : null}
          {post.status === "to-confirm" ? <ToConfirmNotice compact /> : null}
        </Container>
      </div>

      {post.sections.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          eyebrow={section.eyebrow}
          heading={section.heading}
          body={section.body}
        />
      ))}

      {post.relatedLinks?.length ? (
        <section className="pb-12">
          <Container>
            <RelatedLinks links={post.relatedLinks} />
          </Container>
        </section>
      ) : null}
    </article>
  );
}
