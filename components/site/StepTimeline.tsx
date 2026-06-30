import { cn, cardBase } from "@/lib/cn";

interface StepTimelineProps {
  steps: string[];
  className?: string;
}

export function StepTimeline({ steps, className }: StepTimelineProps) {
  return (
    <ol className={cn("space-y-0", className)}>
      {steps.map((step, index) => (
        <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
          {index < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute left-[1.125rem] top-10 h-[calc(100%-1.5rem)] w-px bg-border"
            />
          ) : null}
          <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand ring-1 ring-brand/15">
            {index + 1}
          </span>
          <div className={cn(cardBase, "flex-1 p-4")}>
            <p className="text-sm leading-relaxed text-ink">{step}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
