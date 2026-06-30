import { cn, cardBase, cardInteractive } from "@/lib/cn";

const paths = [
  {
    number: 1,
    title: "Junior driver",
    text: "For parents or guardians registering a driver under 18. The child becomes the member; the parent manages the account.",
    badge: "Most common",
    primary: true,
  },
  {
    number: 2,
    title: "Adult racing / practising member",
    text: "For adult drivers joining to practise or race with the club.",
    badge: "Adult driver",
  },
  {
    number: 3,
    title: "Additional family driver",
    text: "For another racing member living at the same address.",
    badge: "Family",
  },
  {
    number: 4,
    title: "Social or pit member",
    text: "For non-driving supporters, pit crew and helpers.",
    badge: "Non-driving",
  },
  {
    number: 5,
    title: "Visiting driver",
    text: "For drivers from another club registering for practice or race days without full AKL-MTW membership.",
    badge: "Visitor",
  },
];

export function MembershipPathGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {paths.map((path) => (
        <article
          key={path.title}
          className={cn(
            cardBase,
            cardInteractive,
            "flex h-full flex-col p-5 sm:p-6",
            path.primary && "border-brand/25 bg-brand/[0.02] sm:col-span-2 lg:col-span-1",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                path.primary ? "bg-brand text-white" : "bg-brand/10 text-brand",
              )}
              aria-hidden
            >
              {path.number}
            </span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wide",
                path.primary ? "border-brand/20 bg-brand/10 text-brand" : "border-brand/15 bg-brand/5 text-brand",
              )}
            >
              {path.badge}
            </span>
          </div>
          <h3 className="mt-4 text-base font-semibold text-ink">{path.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{path.text}</p>
        </article>
      ))}
    </div>
  );
}
