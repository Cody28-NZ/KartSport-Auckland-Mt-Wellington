import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn, focusRing, sectionDefault } from "@/lib/cn";

const links = [
  { href: "/account", label: "Dashboard", exact: true },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/people", label: "People & Drivers" },
  { href: "/account/membership", label: "Membership" },
];

interface AccountShellProps {
  children: React.ReactNode;
  currentPath: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  showBackLink?: boolean;
}

export function AccountShell({
  children,
  currentPath,
  title,
  description,
  actions,
  showBackLink = true,
}: AccountShellProps) {
  return (
    <section className={cn(sectionDefault, "py-8 sm:py-10 lg:py-12")}>
      <Container className="max-w-4xl">
        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {showBackLink ? (
              <Link href="/account" className={cn("text-sm text-brand hover:text-brand-hover", focusRing)}>
                &larr; Account
              </Link>
            ) : null}
            {title ? (
              <h1 className={cn("text-2xl font-semibold tracking-tight text-ink sm:text-3xl", showBackLink && "mt-2")}>
                {title}
              </h1>
            ) : null}
            {description ? <p className="mt-2 text-sm text-ink-muted">{description}</p> : null}
          </div>
          {actions}
        </div>

        <nav className="mt-5 flex gap-1 overflow-x-auto pb-1" aria-label="Account sections">
          {links.map((link) => {
            const active = link.exact ? currentPath === link.href : currentPath.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  focusRing,
                  active ? "bg-brand/10 text-brand" : "text-ink-muted hover:bg-surface-alt hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">{children}</div>
      </Container>
    </section>
  );
}
