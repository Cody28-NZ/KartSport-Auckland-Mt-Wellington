import Image from "next/image";
import Link from "next/link";
import { footerNavigation } from "@/data/navigation";
import { SITE_NAME, VENUE_NAME, VENUE_PARK } from "@/data/site";
import { cn, focusRing, sectionFooter, textLinkDark } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { SourceOfTruthNotice } from "@/components/site/SourceOfTruthNotice";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={sectionFooter}>
      <Container className="py-12 lg:py-14">
        <div className="mb-10 flex max-w-md items-start gap-4">
          <Image
            src="/images/club-logo.png"
            alt="KartSport Auckland Mt Wellington"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 object-contain"
          />
          <div>
            <p className="text-base font-semibold text-white">{SITE_NAME}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Real competition karting at {VENUE_NAME}, {VENUE_PARK}, Auckland.
            </p>
          </div>
        </div>

        <div className="grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {footerNavigation.map((group) => (
            <div key={group.id}>
              <h2 className="text-xs font-semibold tracking-wide text-white/90">{group.title}</h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className={cn(
                        "inline-flex min-h-9 items-center text-sm text-white/55 transition-colors hover:text-white",
                        focusRing,
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <SourceOfTruthNotice compact variant="dark" />
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {SITE_NAME}. All rights reserved.</p>
          <Link href="/venue" className={cn(textLinkDark, focusRing, "text-xs font-normal text-white/55")}>
            {VENUE_NAME}, {VENUE_PARK}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
