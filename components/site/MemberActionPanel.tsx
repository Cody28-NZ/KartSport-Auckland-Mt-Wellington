import { cn, cardBase } from "@/lib/cn";
import { CtaButton } from "@/components/ui/CtaButton";

interface MemberActionPanelProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  note?: string;
  className?: string;
}

export function MemberActionPanel({
  title,
  description,
  actionLabel,
  actionHref,
  note,
  className,
}: MemberActionPanelProps) {
  const isConfirmed = actionHref !== "to confirm" && actionHref.startsWith("http");

  return (
    <div className={cn(cardBase, "border-brand/15 bg-gradient-to-b from-brand/[0.04] to-white p-6 sm:p-8", className)}>
      <h2 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">{description}</p>
      <div className="mt-6">
        {isConfirmed ? (
          <CtaButton label={actionLabel} href={actionHref} variant="primary" external className="sm:w-auto" fullWidth />
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-surface-alt px-4 py-3 text-sm text-ink-muted">
            <span className="font-medium text-ink">{actionLabel}:</span> {note ?? "Link to confirm with the club."}
          </div>
        )}
      </div>
    </div>
  );
}
