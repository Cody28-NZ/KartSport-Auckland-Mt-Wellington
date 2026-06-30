import Link from "next/link";
import { cn, cardElevated, cardInteractive, focusRing, textLink } from "@/lib/cn";

interface ActionCardProps {
  title: string;
  body: string;
  href: string;
  className?: string;
}

export function ActionCard({ title, body, href, className }: ActionCardProps) {
  return (
    <Link href={href} className={cn(cardElevated, cardInteractive, "group flex h-full flex-col p-5 sm:p-6", focusRing, className)}>
      <h3 className="text-lg font-semibold text-ink group-hover:text-brand">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{body}</p>
      <span className={cn("mt-4 inline-flex text-sm", textLink)}>Go &rarr;</span>
    </Link>
  );
}
