/** Joins class names, omitting falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/* Cards - dealership style: white, soft radius, light border */
export const cardBase =
  "rounded-lg border border-border bg-white shadow-[0_1px_3px_rgb(17_17_17/0.04)]";

export const cardElevated =
  "rounded-lg border border-border bg-white shadow-[0_4px_16px_rgb(17_17_17/0.06)]";

export const cardInteractive =
  "transition-all duration-200 hover:border-divider hover:shadow-[0_6px_20px_rgb(17_17_17/0.08)]";

/* Dark band cards */
export const cardOnDark =
  "rounded-lg border border-white/15 bg-white/10 text-white backdrop-blur-sm";

export const cardOnDarkInteractive =
  "transition-all duration-200 hover:border-white/25 hover:bg-white/15";

/* Buttons - blue-grey primary, white secondary */
export const btnPrimary = "bg-brand text-white hover:bg-brand-hover";

export const btnSecondary =
  "border border-border bg-white text-ink hover:border-divider hover:bg-surface-alt";

export const btnGhost = "border border-transparent text-ink-muted hover:bg-surface-alt hover:text-ink";

export const btnSecondaryDark =
  "border border-white/30 bg-transparent text-white hover:border-white/50 hover:bg-white/10";

export const btnGhostDark =
  "border border-transparent text-white/80 hover:bg-white/10 hover:text-white";

export const btnPill = "rounded-full";

/* Sections - alternating white / pale blue-grey */
export const sectionDefault = "bg-surface text-ink";
export const sectionMuted = "bg-surface-alt border-y border-border text-ink";
export const sectionElevated = "bg-white border-y border-border text-ink";
export const sectionDark = "section-photo-band border-y border-black/20 text-white";
export const sectionFooter = "section-footer text-white";

/* Typography */
export const textEyebrow = "text-xs font-medium tracking-wide text-ink-subtle";
export const textEyebrowDark = "text-xs font-medium tracking-wide text-white/70";
export const textLink = "font-medium text-brand hover:text-brand-hover";
export const textLinkDark = "font-medium text-white/90 hover:text-white";

/** Wide editorial measure for heroes and hub section intros */
export const textMeasureHero = "max-w-4xl lg:max-w-5xl";
/** Section headings and supporting copy on marketing pages */
export const textMeasureSection = "max-w-4xl lg:max-w-5xl";
/** Inner-page hero copy beside an image */
export const textMeasureHeroSplit = "max-w-3xl lg:max-w-none";
/** Long-form article and guide reading columns */
export const textMeasureArticle = "max-w-3xl";

export const accentLine = "border-l-2 border-brand pl-4";

export const tapTarget = "min-h-11 min-w-11";

export const menuPanel =
  "overflow-hidden rounded-lg border border-border bg-white shadow-[0_12px_40px_rgb(17_17_17/0.1)]";

export const filterPanel =
  "rounded-lg border border-border bg-white p-5 shadow-[0_1px_3px_rgb(17_17_17/0.04)] sm:p-6";

/** Homepage section vertical rhythm */
export const sectionHome = "py-10 sm:py-12 lg:py-16 xl:py-20";

export const pillButton =
  "inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:bg-surface-alt hover:text-brand";
