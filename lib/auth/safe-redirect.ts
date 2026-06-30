const ALLOWED_NEXT_PATHS = ["/account", "/account/membership/new", "/account/onboarding"] as const;

export type AllowedNextPath = (typeof ALLOWED_NEXT_PATHS)[number];

export function getSafeNextPath(next: string | null | undefined, fallback: AllowedNextPath | "/account" = "/account"): string {
  if (!next || typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  if (next.includes("://")) return fallback;

  return (ALLOWED_NEXT_PATHS as readonly string[]).includes(next) ? next : fallback;
}

export function buildAuthCallbackUrl(origin: string, nextPath: string): string {
  const safeNext = getSafeNextPath(nextPath, "/account/membership/new");
  return `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
}
