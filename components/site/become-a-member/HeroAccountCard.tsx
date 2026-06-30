import { RegisterForm } from "@/components/auth/RegisterForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { CtaButton } from "@/components/ui/CtaButton";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { cn, cardElevated } from "@/lib/cn";

const heroCardClass = cn(
  cardElevated,
  "rounded-2xl border-border/80 p-6 shadow-[0_8px_30px_rgb(17_17_17/0.08)] sm:p-8",
);

interface HeroAccountCardProps {
  user: { id: string } | null;
  membershipNext: string;
  loginWithNext: string;
  onAwaitingEmailConfirmation?: () => void;
}

export function HeroAccountCard({
  user,
  membershipNext,
  loginWithNext,
  onAwaitingEmailConfirmation,
}: HeroAccountCardProps) {
  if (user) {
    return (
      <div className={heroCardClass}>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Your account</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">You&apos;re signed in</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">Continue the membership application.</p>
        <div className="mt-6 flex flex-col gap-3">
          <CtaButton label="Continue application" href={membershipNext} variant="primary" fullWidth size="lg" />
          <CtaButton label="Go to account" href="/account" variant="secondary" fullWidth size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={heroCardClass}>
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">Get started</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">Start with a parent or guardian account</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Create your login first, then register the junior driver, adult driver, social member or visiting driver.
      </p>
      <div className="mt-6">
        {isSupabaseConfigured() ? (
          <RegisterForm
            nextPath={membershipNext}
            submitLabel="Create account and continue"
            loginHref={loginWithNext}
            emailInputId="become-a-member-email"
            passwordInputId="become-a-member-password"
            embedded
            showInlineSuccess={false}
            onAwaitingEmailConfirmation={onAwaitingEmailConfirmation}
          />
        ) : (
          <SupabaseSetupNotice />
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-brand" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const trustBullets = [
  "Junior drivers registered by parents or guardians",
  "Membership in the driver's name",
  "Family and visiting drivers supported",
  "Payment handled separately by the club",
];

export function BecomeAMemberHeroCopy() {
  return (
    <div className="max-w-xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">Membership</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
        Join or register a driver
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
        Most junior drivers are registered by a parent or guardian. The membership is created in the driver&apos;s name,
        while the parent manages the account.
      </p>
      <ul className="mt-6 space-y-2.5">
        {trustBullets.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
