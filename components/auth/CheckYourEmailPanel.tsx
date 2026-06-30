import Link from "next/link";
import { cn, btnPrimary, btnSecondary, cardElevated, focusRing, tapTarget } from "@/lib/cn";

interface CheckYourEmailPanelProps {
  loginHref: string;
  backHref?: string;
  backLabel?: string;
}

function MailIcon() {
  return (
    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8.25l8.954 5.545a1.5 1.5 0 001.092 0L22 8.25M4.5 19.5h15a1.5 1.5 0 001.5-1.5V7.5a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 7.5v10.5a1.5 1.5 0 001.5 1.5z"
        />
      </svg>
    </span>
  );
}

export function CheckYourEmailPanel({
  loginHref,
  backHref = "/become-a-member",
  backLabel = "Back to membership page",
}: CheckYourEmailPanelProps) {
  return (
    <div className={cn(cardElevated, "rounded-2xl border-border/80 p-8 text-center shadow-[0_8px_30px_rgb(17_17_17/0.08)] sm:p-10")}>
      <MailIcon />
      <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink">Check your email</h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
        We&apos;ve created your account. Confirm your email, then sign in to continue the membership application.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
        If you do not see the email, check your junk or spam folder.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href={loginHref}
          className={cn(btnPrimary, focusRing, tapTarget, "inline-flex w-full justify-center rounded-xl px-4 py-3 text-sm font-semibold")}
        >
          Member login
        </Link>
        <Link
          href={backHref}
          className={cn(btnSecondary, focusRing, tapTarget, "inline-flex w-full justify-center rounded-xl px-4 py-3 text-sm font-medium")}
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
