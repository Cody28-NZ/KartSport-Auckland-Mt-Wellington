"use client";

import { useState } from "react";
import type { AcceptedTerms } from "@/types/database";
import { cn, focusRing } from "@/lib/cn";

interface AcceptedTermsPanelProps {
  acceptedTerms: AcceptedTerms;
}

export function AcceptedTermsPanel({ acceptedTerms }: AcceptedTermsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4 border-t border-border pt-4">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className={cn(
          "text-sm font-medium text-brand hover:text-brand-hover",
          focusRing,
        )}
        aria-expanded={expanded}
      >
        {expanded ? "Hide accepted terms" : "View accepted terms"}
      </button>
      {expanded ? (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-border bg-surface-alt/40 p-4 text-sm">
          <p className="font-medium text-ink">{acceptedTerms.terms_title_snapshot}</p>
          <p className="mt-1 text-ink-muted">Version: {acceptedTerms.terms_version_label_snapshot}</p>
          <p className="mt-1 text-ink-muted">
            Accepted by {acceptedTerms.accepted_by_name_snapshot} on behalf of{" "}
            {acceptedTerms.applicant_name_snapshot}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-ink">{acceptedTerms.terms_body_snapshot}</p>
        </div>
      ) : null}
    </div>
  );
}
