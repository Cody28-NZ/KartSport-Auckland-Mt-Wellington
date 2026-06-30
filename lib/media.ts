import type { MediaAspectRatio, MediaImage } from "@/types/content";
import { mediaImages } from "@/data/media";

export type MediaId =
  | "home-hero-pack-racing"
  | "club-logo"
  | "giltrap-logo"
  | "track-wide"
  | "pathway-beginner-briefing"
  | "parent-junior-pits"
  | "junior"
  | "kart-on-stand"
  | "pack-racing-corner"
  | "practice-day"
  | "race-day-grid"
  | "marshal-volunteer"
  | "venue-feature"
  | "sponsor-community"
  | "news-event";

export function getMediaById(id: string): MediaImage | undefined {
  return mediaImages.find((item) => item.id === id);
}

export function getMediaByUsage(usage: string): MediaImage[] {
  return mediaImages.filter((item) => item.usage.includes(usage));
}

const aspectClassMap: Record<MediaAspectRatio, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
  "21:9": "aspect-[21/9]",
  "3:2": "aspect-[3/2]",
};

export function mediaAspectClass(aspectRatio: MediaAspectRatio): string {
  return aspectClassMap[aspectRatio];
}

/** Map legacy ImagePlaceholder aspect names to media aspect */
export function legacyAspectToMedia(
  aspect?: "16:9" | "4:3" | "1:1" | "portrait" | "wide",
): MediaAspectRatio {
  if (aspect === "portrait") return "3:4";
  if (aspect === "wide") return "21:9";
  if (aspect === "4:3" || aspect === "1:1") return aspect;
  return "16:9";
}

const newsMediaMap: Record<string, MediaId> = {
  "2026-season-preview": "pack-racing-corner",
  "pathway-session-dates": "pathway-beginner-briefing",
  "volunteers-needed": "sponsor-community",
};

export function getNewsMediaId(slug: string): MediaId {
  return newsMediaMap[slug] ?? "news-event";
}
