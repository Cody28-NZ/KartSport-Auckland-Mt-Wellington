import Link from "next/link";
import { cn, cardBase, cardInteractive, focusRing } from "@/lib/cn";

interface QuickActionCardProps {
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
  badge?: string;
}

export function QuickActionCard({ title, description, href, disabled, badge }: QuickActionCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-ink">{title}</h3>
        {badge ? (
          <span className="shrink-0 rounded-full border border-border bg-surface-alt px-2 py-0.5 text-[0.6875rem] font-medium text-ink-muted">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-ink-muted">{description}</p>
    </>
  );

  if (disabled || !href) {
    return (
      <div className={cn(cardBase, "p-5 opacity-60")}>{content}</div>
    );
  }

  return (
    <Link href={href} className={cn(cardBase, cardInteractive, "block p-5", focusRing)}>
      {content}
    </Link>
  );
}
