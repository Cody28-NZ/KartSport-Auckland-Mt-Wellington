import Image from "next/image";
import Link from "next/link";
import { sponsors } from "@/data/sponsors";
import type { Sponsor } from "@/types/content";
import { cn, cardBase, cardOnDark, textLink, textLinkDark } from "@/lib/cn";
import { CardGrid } from "@/components/site/CardGrid";
import { MediaImage } from "@/components/site/MediaImage";

interface SponsorGridProps {
  items?: Sponsor[];
  className?: string;
  limit?: number;
  compact?: boolean;
  /** Use when grid sits on a dark photo band section */
  onDark?: boolean;
}

const tierOrder: Record<Sponsor["tier"], number> = {
  principal: 1,
  major: 2,
  supporting: 3,
  event: 4,
  community: 5,
  "to-confirm": 6,
};

function SponsorLogo({
  sponsor,
  compact,
  onDark,
}: {
  sponsor: Sponsor;
  compact?: boolean;
  onDark?: boolean;
}) {
  if (sponsor.id === "sponsor-principal-giltrap") {
    return (
      <div
        className={cn(
          "relative mb-3 flex items-center justify-center overflow-hidden rounded-lg border bg-white",
          onDark ? "border-white/15" : "border-border",
          compact ? "h-16 w-full max-w-[8rem]" : "h-20 w-full",
        )}
      >
        <Image
          src="/images/giltrap-logo.jpg"
          alt="Giltrap - principal sponsor"
          fill
          sizes="128px"
          className="object-contain p-2"
        />
      </div>
    );
  }

  if (sponsor.logoPlaceholder.mediaId) {
    return (
      <MediaImage
        mediaId={sponsor.logoPlaceholder.mediaId}
        aspect={false}
        rounded
        className={cn(
          "relative mb-3 w-full overflow-hidden border bg-white",
          onDark ? "border-white/15" : "border-border",
          compact ? "aspect-[16/9] max-w-[8rem]" : "aspect-[16/9]",
        )}
        imageClassName="object-contain p-2"
      />
    );
  }

  return null;
}

export function SponsorGrid({ items, className, limit, compact, onDark = false }: SponsorGridProps) {
  const activeSponsors = (items ?? sponsors)
    .filter((sponsor) => sponsor.active)
    .sort((a, b) => {
      const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
      return tierDiff !== 0 ? tierDiff : a.displayOrder - b.displayOrder;
    })
    .slice(0, limit);

  if (!activeSponsors.length) return null;

  return (
    <div className={className}>
      <CardGrid columns={compact ? 3 : 3}>
        {activeSponsors.map((sponsor) => (
          <article
            key={sponsor.id}
            className={cn(
              onDark ? cardOnDark : cardBase,
              "flex flex-col p-4",
              compact && "items-center text-center",
            )}
          >
            <SponsorLogo sponsor={sponsor} compact={compact} onDark={onDark} />
            <h3 className={cn("text-sm font-semibold", onDark ? "text-white" : "text-ink")}>
              {sponsor.name}
            </h3>
            {!compact && sponsor.description ? (
              <p className={cn("mt-2 text-sm", onDark ? "text-white/70" : "text-ink-muted")}>
                {sponsor.description}
              </p>
            ) : null}
            {!compact && sponsor.websiteUrl && sponsor.websiteUrl !== "to confirm" ? (
              <Link
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("mt-3 text-sm", onDark ? textLinkDark : textLink)}
              >
                Visit website &rarr;
              </Link>
            ) : null}
          </article>
        ))}
      </CardGrid>
    </div>
  );
}
