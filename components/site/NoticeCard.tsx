import Link from "next/link";
import type { NoticeItem } from "@/types/content";
import { formatDate } from "@/lib/format";
import { cn, cardBase, focusRing, textLink } from "@/lib/cn";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface NoticeCardProps {
  notice: NoticeItem;
  className?: string;
}

const severityBorder: Record<NoticeItem["severity"], string> = {
  info: "border-l-sky-500",
  success: "border-l-emerald-500",
  warning: "border-l-amber-500",
  danger: "border-l-brand",
};

export function NoticeCard({ notice, className }: NoticeCardProps) {
  if (!notice.visible) return null;

  return (
    <article
      className={cn(
        cardBase,
        "border-l-4 p-5",
        severityBorder[notice.severity],
        className,
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <StatusBadge status={notice.severity} />
        {notice.status === "to-confirm" ? (
          <StatusBadge status="to-confirm" />
        ) : null}
      </div>
      <h3 className="font-semibold text-ink">{notice.title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{notice.message}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {notice.href && notice.ctaLabel ? (
          <Link
            href={notice.href}
            className={cn("text-sm", textLink, focusRing)}
          >
            {notice.ctaLabel} &rarr;
          </Link>
        ) : null}
        <span className="text-xs text-ink-subtle">
          Updated {formatDate(notice.lastUpdated)}
        </span>
      </div>
    </article>
  );
}
