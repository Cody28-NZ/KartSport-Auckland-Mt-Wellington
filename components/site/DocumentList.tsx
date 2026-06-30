import Link from "next/link";
import { documents } from "@/data/documents";
import type { DocumentItem } from "@/types/content";
import { formatDate } from "@/lib/format";
import { cn, cardBase, focusRing } from "@/lib/cn";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface DocumentListProps {
  items?: DocumentItem[];
  category?: DocumentItem["category"];
  heading?: string;
  className?: string;
}

export function DocumentList({
  items,
  category,
  heading = "Documents",
  className,
}: DocumentListProps) {
  const filtered = (items ?? documents).filter(
    (doc) => !category || doc.category === category,
  );

  if (!filtered.length) return null;

  return (
    <div className={className}>
      <h2 className="mb-4 text-lg font-semibold text-ink">{heading}</h2>
      <ul className="space-y-3">
        {filtered.map((doc) => {
          const isExternal = doc.external || doc.href.startsWith("http");
          const isPlaceholder = doc.href === "to confirm";

          return (
            <li key={doc.id}>
              <article className={cn(cardBase, "p-4")}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-ink">
                      {isPlaceholder ? (
                        doc.title
                      ) : (
                        <Link
                          href={doc.href}
                          className={cn("hover:text-brand", focusRing)}
                          {...(isExternal
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {doc.title}
                          {isExternal ? " ↗" : null}
                        </Link>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">{doc.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status="info" label={doc.category.replace("-", " ")} />
                    {doc.status !== "published" ? (
                      <StatusBadge status={doc.status} />
                    ) : null}
                  </div>
                </div>
                <p className="mt-2 text-xs text-ink-subtle">
                  Updated {formatDate(doc.lastUpdated)}
                  {doc.version ? ` · v${doc.version}` : null}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
