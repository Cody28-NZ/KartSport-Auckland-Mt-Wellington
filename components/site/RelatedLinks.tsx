import Link from "next/link";

import type { RelatedLink } from "@/types/content";

import { cn, cardBase, focusRing, textLink } from "@/lib/cn";

interface RelatedLinksProps {
  links: RelatedLink[];
  heading?: string;
  className?: string;
}

export function RelatedLinks({
  links,
  heading = "Related links",
  className,
}: RelatedLinksProps) {
  if (!links.length) return null;

  return (
    <aside className={cn(cardBase, "p-6", className)}>
      <h2 className="text-sm font-semibold text-ink">
        {heading}
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className={cn("text-sm transition-colors", textLink, focusRing)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
