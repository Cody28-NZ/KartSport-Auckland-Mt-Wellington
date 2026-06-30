import { MediaImage } from "@/components/site/MediaImage";
import { cn } from "@/lib/cn";

interface TrackVisualProps {
  className?: string;
  compact?: boolean;
  mediaId?: string;
}

export function TrackVisual({
  className,
  compact,
  mediaId = "track-wide",
}: TrackVisualProps) {
  return (
    <MediaImage
      mediaId={mediaId}
      rounded={!compact}
      className={cn(compact ? "aspect-[21/9] w-full" : "w-full shadow-sm", className)}
    />
  );
}
