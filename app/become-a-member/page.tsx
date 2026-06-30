import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, sectionDefault, sectionMuted } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Become a member | KartSport Auckland Mt Wellington",
  description: "Join KartSport Auckland Mt Wellington to practice, race and get involved at Sir Colin Giltrap Raceway.",
});

const steps = [
  { step: 1, title: "Create an account", body: "Register with your email to manage drivers and memberships." },
  { step: 2, title: "Add driver details", body: "Add yourself or junior drivers you manage as guardian." },
  { step: 3, title: "Choose membership type", body: "Select the membership products that apply to you." },
  { step: 4, title: "Accept terms and submit", body: "Review club terms and submit your application." },
  { step: 5, title: "Follow payment instructions", body: "The club will confirm how to pay your membership fees." },
];

export default async function BecomeAMemberPage() {
  const user = await getCurrentUser();
  const primaryHref = user ? "/account/membership/new" : "/register";

  return (
    <>
      <section className={cn(sectionDefault, "py-12 sm:py-16")}>
        <Container className="max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Become a member</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
            Join KartSport Auckland Mt Wellington to practice, race and get involved at Sir Colin Giltrap Raceway.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton label="Start membership application" href={primaryHref} variant="primary" size="lg" />
            <CtaButton label="Member login" href="/login" variant="secondary" size="lg" />
          </div>
          <p className="mt-6 text-sm text-ink-muted">
            Parents and guardians can manage junior drivers from one account.
          </p>
        </Container>
      </section>

      <section className={cn(sectionMuted, "py-12 sm:py-16")}>
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
            <p className="text-sm text-ink-muted">
              Already a member?{" "}
              <Link href="/login" className="font-medium text-brand hover:text-brand-hover">
                Sign in to your account
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
