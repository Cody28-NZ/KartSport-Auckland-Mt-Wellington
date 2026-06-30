"use client";

import Link from "next/link";
import { mobileNavigationGroups } from "@/data/navigation";
import { AccountNavLink } from "@/components/auth/AccountNavLink";
import { cn, focusRing } from "@/lib/cn";
import { TrackAvailabilityIndicator } from "@/components/site/TrackAvailabilityIndicator";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-border bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <TrackAvailabilityIndicator linkToCalendar />
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-alt hover:text-ink",
              focusRing,
            )}
            aria-label="Close menu"
          >
            <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Main">
          <div className="mb-4 border-b border-border pb-4 xl:hidden">
            <AccountNavLink onDark={false} />
          </div>
          <ul className="space-y-6">
            {mobileNavigationGroups.map((group) => (
              <li key={group.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">{group.title}</p>
                <ul className="mt-2 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "block min-h-10 rounded-md py-2 text-sm font-medium text-ink hover:text-brand",
                          focusRing,
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
