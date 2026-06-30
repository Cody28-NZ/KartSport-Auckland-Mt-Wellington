import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { CtaButton } from "@/components/ui/CtaButton";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, focusRing, sectionDefault, sectionMuted } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Become a member | KartSport Auckland Mt Wellington",
  description: "Join KartSport Auckland Mt Wellington or register as a visiting driver.",
});

const membershipTypes = [
  { title: "Racing / practising member", body: "Full club membership for adult or junior drivers." },
  { title: "Family membership", body: "Additional racing members at the same address." },
  { title: "Social & pit", body: "Non-driving memberships for supporters and pit crew." },
  {
    title: "Visiting drivers",
    body: "Drivers from other clubs can register for practice or race entry without full AKL-MTW membership.",
  },
];

const steps = [
  { step: 1, title: "Create an account" },
  { step: 2, title: "Add account holder details" },
  { step: 3, title: "Add people and drivers" },
  { step: 4, title: "Submit membership application" },
  { step: 5, title: "Payment is handled separately by the club" },
];

const MEMBERSHIP_NEXT = "/account/membership/new";
const LOGIN_WITH_NEXT = `/login?next=${encodeURIComponent(MEMBERSHIP_NEXT)}`;

export default async function BecomeAMemberPage() {
  const user = isSupabaseConfigured() ? await getCurrentUser() : null;

  return (
    <>
      <section className={cn(sectionDefault, "py-10 sm:py-14")}>
        <Container className="max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Become a member</h1>
            <p className="mt-4 text-base text-ink-muted sm:text-lg">
              Join KartSport Auckland Mt Wellington or register as a visiting driver. Parents and guardians can manage
              junior drivers from one account.
            </p>
            {!user ? (
              <p className="mt-4 text-sm text-ink-muted">
                Already have an account?{" "}
                <Link href={LOGIN_WITH_NEXT} className={cn("font-medium text-brand hover:text-brand-hover", focusRing)}>
                  Member login
                </Link>
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      <section className={cn(sectionMuted, "py-10 sm:py-14")}>
        <Container className="max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="order-2 space-y-4 lg:order-1">
              <h2 className="text-xl font-semibold text-ink">Membership options</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {membershipTypes.map((item) => (
                  <div key={item.title} className={cn(cardBase, "p-5")}>
                    <h3 className="font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm text-ink-muted">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className={cn(cardBase, "p-6 sm:p-7")}>
                {user ? (
                  <>
                    <h2 className="text-xl font-semibold text-ink">You&apos;re signed in</h2>
                    <p className="mt-2 text-sm text-ink-muted">
                      Continue your membership application or manage your account.
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                      <CtaButton label="Continue membership application" href={MEMBERSHIP_NEXT} variant="primary" fullWidth />
                      <CtaButton label="Go to account" href="/account" variant="secondary" fullWidth />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-ink">Create your account</h2>
                    <p className="mt-2 text-sm text-ink-muted">Start here, then complete your membership application.</p>
                    <div className="mt-6">
                      {isSupabaseConfigured() ? (
                        <RegisterForm
                          nextPath={MEMBERSHIP_NEXT}
                          submitLabel="Create account and continue"
                          loginHref={LOGIN_WITH_NEXT}
                          emailInputId="become-a-member-email"
                          passwordInputId="become-a-member-password"
                        />
                      ) : (
                        <SupabaseSetupNotice />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className={cn(sectionDefault, "py-8 sm:py-10")}>
        <Container className="max-w-6xl">
          <h2 className="text-lg font-semibold text-ink">How it works</h2>
          <ol className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
            {steps.map((item) => (
              <li key={item.step} className="flex items-start gap-3 text-sm sm:max-w-[11rem] sm:flex-col sm:gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                  {item.step}
                </span>
                <span className="text-ink-muted">{item.title}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
