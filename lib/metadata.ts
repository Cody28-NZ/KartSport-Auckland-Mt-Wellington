import type { Metadata } from "next";
import type { SeoMeta } from "@/types/content";

export const SITE_NAME = "KartSport Auckland Mt Wellington";

export const DEFAULT_OG_IMAGE = "/images/hero.jpg";

export const DEFAULT_OG_TYPE = "website" as const;

export function createPageMetadata(seo: SeoMeta): Metadata {
  const ogImage = seo.ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: SITE_NAME,
      type: DEFAULT_OG_TYPE,
      locale: "en_NZ",
      images: [{ url: ogImage, alt: seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
  };
}
