import Link from "next/link";
import type { NewsPost } from "@/types/content";
import { newsArticleRoute } from "@/lib/routes";
import { formatDate } from "@/lib/format";
import { getNewsMediaId } from "@/lib/media";
import { MediaImage } from "@/components/site/MediaImage";
import { SiteImage } from "@/components/site/SiteImage";
import { cn, cardBase, cardInteractive, focusRing, textLink } from "@/lib/cn";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface NewsCardProps {
  post: Pick<
    NewsPost,
    "slug" | "title" | "summary" | "category" | "publishedAt" | "featured" | "status"
  >;
  className?: string;
  showImage?: boolean;
  mediaId?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function NewsCard({ post, className, showImage, mediaId, imageSrc, imageAlt }: NewsCardProps) {
  const href = newsArticleRoute(post.slug);
  const imageId = mediaId ?? getNewsMediaId(post.slug);

  return (
    <article className={cn(cardBase, cardInteractive, "flex h-full flex-col overflow-hidden", className)}>
      {showImage ? (
        <div className="relative min-h-[10rem] border-b border-border">
          {imageSrc ? (
            <SiteImage
              src={imageSrc}
              alt={imageAlt ?? post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <MediaImage mediaId={imageId} aspect={false} minHeight="min-h-[10rem]" className="aspect-[16/9] w-full" />
          )}
          <div className="absolute left-4 top-4 z-10">
            <StatusBadge status="info" label={post.category} />
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        {!showImage ? (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status="info" label={post.category} />
            {post.featured ? <StatusBadge status="success" label="Featured" /> : null}
            {post.status !== "published" ? <StatusBadge status={post.status} /> : null}
          </div>
        ) : (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {post.featured ? <StatusBadge status="success" label="Featured" /> : null}
            {post.status !== "published" ? <StatusBadge status={post.status} /> : null}
          </div>
        )}

        <h3 className="text-lg font-semibold text-ink">
          <Link href={href} className={cn("hover:text-brand", focusRing)}>
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm text-ink-muted">{post.summary}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <time dateTime={post.publishedAt} className="text-xs text-ink-subtle">
            {formatDate(post.publishedAt)}
          </time>
          <Link href={href} className={cn("text-sm", textLink, focusRing)}>
            Read more &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
