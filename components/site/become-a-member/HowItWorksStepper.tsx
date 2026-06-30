import { cn, cardBase } from "@/lib/cn";

const steps = [
  {
    step: 1,
    title: "Create a parent or guardian account",
    body: "Most junior drivers are registered by a parent or guardian who manages the login.",
  },
  {
    step: 2,
    title: "Register the driver or member",
    body: "Add the junior driver, adult driver, social/pit member or visiting driver in the application.",
  },
  {
    step: 3,
    title: "Submit membership application",
    body: "Choose the right membership option and accept the terms on behalf of the member.",
  },
  {
    step: 4,
    title: "Payment is handled separately",
    body: "The club will confirm payment instructions after submission.",
  },
];

export function HowItWorksStepper() {
  return (
    <div className="mx-auto max-w-5xl">
      <ol className="relative hidden gap-0 md:grid md:grid-cols-4">
        <div
          className="pointer-events-none absolute left-[12%] right-[12%] top-5 h-px bg-border"
          aria-hidden
        />
        {steps.map((item) => (
          <li key={item.step} className="relative flex flex-col items-center px-2 text-center">
            <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-brand/20 bg-white text-sm font-semibold text-brand shadow-sm">
              {item.step}
            </span>
            <h3 className="mt-4 text-sm font-semibold text-ink">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{item.body}</p>
          </li>
        ))}
      </ol>

      <ol className="space-y-3 md:hidden">
        {steps.map((item) => (
          <li key={item.step} className={cn(cardBase, "flex gap-4 p-4")}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
              {item.step}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
