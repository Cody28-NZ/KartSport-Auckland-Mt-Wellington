import Image from "next/image";
import Link from "next/link";
import { footerNavigation } from "@/data/navigation";
import { SITE_NAME, VENUE_NAME, VENUE_PARK } from "@/data/site";
import { cn, focusRing, sectionFooter } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={sectionFooter}>
      <Container className="py-8 sm:py-9 lg:py-12">
        <Link href="/" className={cn("mb-6 inline-flex items-center gap-3 lg:mb-7", focusRing)}>
          <Image
            src="/images/club-logo.png"
            alt=""
            width={56}
            height={56}
            className="h-11 w-11 shrink-0 object-contain"
          />
          <span className="text-sm font-semibold leading-snug text-white sm:text-base lg:whitespace-nowrap">
            {SITE_NAME}
          </span>
        </Link>

        <div className="grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:pt-7">
          {footerNavigation.map((group) => (
            <div key={group.id}>
              <h2 className="text-xs font-semibold tracking-wide text-white/90">{group.title}</h2>
              <ul className="mt-2.5 space-y-1.5">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className={cn(
                        "inline-flex text-sm leading-snug text-white/55 transition-colors hover:text-white",
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

        <div className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/45 lg:mt-7">
          <p>
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="mt-1">
            {VENUE_NAME}, {VENUE_PARK}.
          </p>
        </div>
      </Container>
    </footer>
  );
}
