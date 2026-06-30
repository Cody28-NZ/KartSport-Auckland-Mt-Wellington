"use client";

import { useId, useState } from "react";
import { faqs } from "@/data/faqs";
import type { FaqItem } from "@/types/content";
import { cn, cardBase, focusRing } from "@/lib/cn";
import { RelatedLinks } from "@/components/site/RelatedLinks";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface FaqAccordionProps {
  faqIds?: string[];
  items?: FaqItem[];
  className?: string;
}

export function FaqAccordion({ faqIds, items, className }: FaqAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  const resolvedItems =
    items ??
    (faqIds
      ? faqIds
          .map((id) => faqs.find((faq) => faq.id === id))
          .filter((faq): faq is FaqItem => Boolean(faq))
      : faqs.filter((faq) => faq.status === "published"));

  if (!resolvedItems.length) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {resolvedItems.map((faq, index) => {
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        const isOpen = openId === faq.id;

        return (
          <article key={faq.id} className={cn(cardBase, "overflow-hidden")}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className={cn(
                  "flex w-full items-start justify-between gap-4 px-5 py-4 text-left text-ink hover:bg-surface-alt",
                  focusRing,
                )}
              >
                <span className="font-medium">{faq.question}</span>
                <span className="flex shrink-0 items-center gap-2">
                  {faq.status !== "published" ? (
                    <StatusBadge status={faq.status} />
                  ) : null}
                  <svg
                    aria-hidden="true"
                    className={cn("h-5 w-5 text-ink-subtle transition-transform", isOpen && "rotate-180")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="border-t border-border px-5 py-4"
            >
              <p className="text-sm leading-relaxed text-ink-muted">{faq.answer}</p>
              {faq.relatedLinks?.length ? (
                <div className="mt-4">
                  <RelatedLinks links={faq.relatedLinks} heading="Related" />
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
