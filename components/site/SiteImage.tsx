"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface SiteImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}

export function SiteImage({
  src,
  alt,
  fallbackSrc,
  fill = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  imageClassName,
}: SiteImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  if (!currentSrc || failed) return null;

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setFailed(true);
  };

  if (fill) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        onError={handleError}
        className={cn("object-cover", imageClassName)}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={currentSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        onError={handleError}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
