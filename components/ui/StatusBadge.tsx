import type { ContentStatus } from "@/types/content";

import { cn } from "@/lib/cn";

type StatusVariant =
  | ContentStatus
  | "open"
  | "closed"
  | "info"
  | "success"
  | "warning"
  | "danger";

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

const statusStyles: Record<StatusVariant, string> = {
  published: "border-emerald-200 bg-emerald-50 text-emerald-800",
  draft: "border-border bg-surface-alt text-ink-muted",
  "to-confirm": "border-amber-200 bg-amber-50 text-amber-900",
  archived: "border-border bg-surface-alt text-ink-subtle",
  open: "border-emerald-200 bg-emerald-50 text-emerald-800",
  closed: "border-brand/20 bg-brand/5 text-brand",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-brand/25 bg-brand/10 text-brand",
};

const defaultLabels: Partial<Record<StatusVariant, string>> = {
  published: "Published",
  draft: "Draft",
  "to-confirm": "To confirm",
  archived: "Archived",
  open: "Open",
  closed: "Closed",
  info: "Info",
  success: "Success",
  warning: "Warning",
  danger: "Important",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {label ?? defaultLabels[status] ?? status}
    </span>
  );
}
