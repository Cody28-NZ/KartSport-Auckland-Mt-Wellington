import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, sectionDefault, sectionMuted } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Become a member | KartSport Auckland Mt Wellington",
  description: "Join KartSport Auckland Mt Wellington or register as a visiting driver.",
});

const membershipTypes = [
  { title: "Racing / practising member", body: "Full club membership for adult or junior drivers." },
  { title: "Family membership", body: "Additional racing members at the same address." },
  { title: "Social & pit", body: "Non-driving memberships for supporters and pit crew." },
  { title: "Visiting drivers", body: "Drivers from other clubs can register for practice or race entry without full AKL-MTW membership." },
];

const steps = [
  { step: 1, title: "Create an account", body: "Register with your email. Parents/guardians own the login for juniors." },
  { step: 2, title: "Account holder details", body: "Add your contact details as the login owner." },
  { step: 3, title: "Add people", body: "Add juniors, adult drivers, social/pit members or visiting drivers." },
  { step: 4, title: "Submit application", body: "Choose membership or visitor type, accept terms and submit." },
  { step: 5, title: "Payment", body: "The club will confirm payment instructions separately." },
];

export default async function BecomeAMemberPage() {
  const user = await getCurrentUser();
  const primaryHref = user ? "/account/membership/new" : "/register?next=/account/membership/new";

  return (
    <>
      <section className={cn(sectionDefault, "py-12 sm:py-16")}>
        <Container className="max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Become a member</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
            Join KartSport Auckland Mt Wellington or register as a visiting driver. Parents and guardians manage junior drivers from one account.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton label="Start membership application" href={primaryHref} variant="primary" size="lg" />
            <CtaButton label="Member login" href="/login" variant="secondary" size="lg" />
          </div>
          <p className="mt-6 text-sm text-ink-muted">Already have an account? Use member login to continue an application.</p>
        </Container>
      </section>

      <section className={cn(sectionMuted, "py-12 sm:py-16")}>
        <Container className="max-w-4xl">
          <h2 className="text-center text-2xl font-semibold text-ink">Membership options</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {membershipTypes.map((item) => (
              <div key={item.title} className={cn(cardBase, "p-5")}>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className={cn(sectionDefault, "py-12 sm:py-16")}>
        <Container className="max-w-4xl">
          <h2 className="text-center text-2xl font-semibold text-ink">How it works</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((item) => (
              <li key={item.step} className={cn(cardBase, "p-5")}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                  {item.step}
                </span>
                <h3 className="mt-4 font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link href={primaryHref} className="font-medium text-brand hover:text-brand-hover">
              Start membership application &rarr;
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
