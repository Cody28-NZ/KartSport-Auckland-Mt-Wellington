import type { ImagePlaceholder } from "@/types/content";
import { MediaImage } from "@/components/site/MediaImage";
import { cn, cardBase } from "@/lib/cn";

interface ImagePlaceholderPanelProps {
  image: ImagePlaceholder;
  mediaId?: string;
  compact?: boolean;
  className?: string;
  showCaption?: boolean;
}

export function ImagePlaceholderPanel({
  image,
  mediaId,
  compact,
  className,
  showCaption = false,
}: ImagePlaceholderPanelProps) {
  const resolvedMediaId = mediaId ?? image.mediaId;
  if (!resolvedMediaId) return null;

  return (
    <figure className={cn(compact ? "" : cardBase, "overflow-hidden", className)}>
      <MediaImage
        mediaId={resolvedMediaId}
        rounded={!compact}
        className={cn("w-full", compact && "aspect-[16/9] min-h-[80px]")}
      />
      {showCaption && !compact ? (
        <figcaption className="border-t border-border p-4 sm:p-5">
          <p className="text-sm font-medium text-ink">{image.alt}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{image.brief}</p>
        </figcaption>
      ) : null}
    </figure>
  );
}
