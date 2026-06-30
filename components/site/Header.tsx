"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { desktopNavigation } from "@/data/navigation";
import { cn, focusRing } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { AccountNavLink } from "@/components/auth/AccountNavLink";
import { MobileMenu } from "@/components/site/MobileMenu";
import { TrackAvailabilityIndicator } from "@/components/site/TrackAvailabilityIndicator";

const CLUB_LOGO = {
  src: "/images/club-logo.png",
  alt: "KartSport Auckland Mt Wellington",
};

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/10"
      style={{ backgroundColor: "#121312" }}
    >
      <Container>
        <div className="flex min-h-[3.5rem] items-center justify-between gap-3 py-2 xl:min-h-[4.25rem] xl:gap-4 xl:py-2.5">
          <Link href="/" className={cn("flex shrink-0 items-center rounded-md", focusRing)}>
            <Image
              src={CLUB_LOGO.src}
              alt={CLUB_LOGO.alt}
              width={640}
              height={160}
              priority
              className="h-auto max-h-11 w-[180px] object-contain sm:max-h-12 sm:w-[195px] xl:max-h-[3.75rem] xl:w-[260px]"
            />
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 xl:gap-3">
            <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
              {desktopNavigation.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                      focusRing,
                      active
                        ? "bg-brand/30 text-white ring-1 ring-brand/50"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden shrink-0 lg:block">
              <TrackAvailabilityIndicator className="shadow-sm ring-1 ring-white/15" />
            </div>

            <AccountNavLink className="hidden xl:inline-flex" />

            <button
              type="button"
              className={cn(
                "inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/10 hover:text-white xl:hidden",
                focusRing,
              )}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      <div id="mobile-menu">
        <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>
    </header>
  );
}
