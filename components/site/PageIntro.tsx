import { cn, cardBase, sectionDefault, textEyebrow } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

interface PageIntroProps {
  paragraphs: string[];
  highlights?: string[];
  className?: string;
}

export function PageIntro({ paragraphs, highlights, className }: PageIntroProps) {
  return (
    <section className={cn(sectionDefault, "border-b border-border py-10 sm:py-12", className)}>
      <Container>
        <div className="grid min-w-0 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="min-w-0 space-y-4 text-base leading-relaxed text-ink-muted">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {highlights?.length ? (
            <aside className={cn(cardBase, "p-6")}>
              <h2 className={textEyebrow}>Key points</h2>
              <ul className="mt-4 space-y-3">
                {highlights.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-ink">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
