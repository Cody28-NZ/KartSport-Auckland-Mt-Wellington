import { getMediaById, mediaAspectClass } from "@/lib/media";
import { cn } from "@/lib/cn";
import { SiteImage } from "@/components/site/SiteImage";

interface MediaImageProps {
  mediaId?: string;
  src?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  aspect?: boolean;
  rounded?: boolean;
  fallbackSrc?: string;
  minHeight?: string;
}

export function MediaImage({
  mediaId,
  src: srcProp,
  alt: altProp,
  className,
  imageClassName,
  fill = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  aspect = true,
  rounded = false,
  fallbackSrc,
  minHeight = "min-h-[10rem]",
}: MediaImageProps) {
  const media = mediaId ? getMediaById(mediaId) : undefined;
  const src = srcProp ?? media?.src;
  const alt = altProp ?? media?.alt;

  if (!src || !alt) return null;

  const aspectClass = aspect && !fill ? mediaAspectClass(media?.aspectRatio ?? "16:9") : undefined;

  if (fill) {
    return (
      <div className={cn("relative", minHeight, className)}>
        <SiteImage
          src={src}
          alt={alt}
          fallbackSrc={fallbackSrc}
          fill
          priority={priority}
          sizes={sizes}
          imageClassName={cn(rounded && "rounded-lg", imageClassName)}
        />
      </div>
    );
  }

  return (
    <SiteImage
      src={src}
      alt={alt}
      fallbackSrc={fallbackSrc}
      priority={priority}
      sizes={sizes}
      className={cn("relative overflow-hidden", minHeight, aspectClass, rounded && "rounded-lg", className)}
      imageClassName={imageClassName}
    />
  );
}
