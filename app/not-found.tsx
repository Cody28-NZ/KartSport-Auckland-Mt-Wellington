import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { cn, focusRing, textEyebrow, textLink } from "@/lib/cn";

export default function NotFound() {
  return (
    <section className="bg-surface py-24">
      <Container className="max-w-xl text-center">
        <p className={textEyebrow}>404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-ink-muted">
          That page does not exist or may have moved. Try Start Karting, Race Entries, or contact the club if you need help.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <CtaButton label="Start Karting" href="/start-karting" variant="primary" />
          <CtaButton label="Race Entries" href="/race-entries" variant="secondary" />
          <Link href="/" className={cn("self-center text-sm", textLink, focusRing)}>
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}
