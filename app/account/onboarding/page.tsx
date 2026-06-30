import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CtaButton } from "@/components/ui/CtaButton";
import {
  hasPeople,
  hasSubmittedMembership,
  isProfileComplete,
} from "@/lib/account/format";
import { getMembershipApplicationsForCurrentUser } from "@/lib/data/membership";
import { getPeopleForCurrentUser } from "@/lib/data/people";
import { getCurrentUserProfile, requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, cardInteractive, focusRing } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Get started | KartSport Auckland Mt Wellington",
  description: "Complete your account setup for KartSport Auckland Mt Wellington.",
  noIndex: true,
});

interface SetupCardProps {
  step: number;
  title: string;
  description: string;
  complete: boolean;
  href: string;
  cta: string;
}

function SetupCard({ step, title, description, complete, href, cta }: SetupCardProps) {
  return (
    <Link href={href} className={cn(cardBase, cardInteractive, "block p-5", focusRing)}>
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
          {step}
        </span>
        <StatusBadge status={complete ? "success" : "warning"} label={complete ? "Complete" : "Incomplete"} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-ink-muted">{description}</p>
      <span className="mt-4 inline-block text-sm font-medium text-brand">{cta} &rarr;</span>
    </Link>
  );
}

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) {
    return (
      <AccountShell currentPath="/account/onboarding" title="Get started">
        <SupabaseSetupNotice />
      </AccountShell>
    );
  }

  const { redirectTo } = await requireUser();
  if (redirectTo) redirect(redirectTo);

  const [profile, people, applications] = await Promise.all([
    getCurrentUserProfile(),
    getPeopleForCurrentUser(),
    getMembershipApplicationsForCurrentUser(),
  ]);

  const profileComplete = isProfileComplete(profile);
  const peopleComplete = hasPeople(people);
  const membershipComplete = hasSubmittedMembership(applications);
  const allComplete = profileComplete && peopleComplete && membershipComplete;

  return (
    <AccountShell
      currentPath="/account/onboarding"
      title="Welcome"
      description="Register as a member or visiting driver, add people to your account, and submit your application."
    >
      {allComplete ? (
        <div className={cn(cardBase, "p-6 text-center")}>
          <StatusBadge status="success" label="Setup complete" />
          <p className="mt-4 text-sm text-ink-muted">Your account is ready. Manage people and membership from your dashboard.</p>
          <div className="mt-5">
            <CtaButton label="Go to dashboard" href="/account" variant="primary" />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <SetupCard
            step={1}
            title="Account holder profile"
            description="Add login owner contact details."
            complete={profileComplete}
            href="/account/profile"
            cta="Edit profile"
          />
          <SetupCard
            step={2}
            title="People & drivers"
            description="Add juniors, adult drivers, social/pit members or visiting drivers."
            complete={peopleComplete}
            href="/account/people"
            cta={peopleComplete ? "Manage people" : "Add person"}
          />
          <SetupCard
            step={3}
            title="Membership application"
            description="Choose membership or visitor type and submit."
            complete={membershipComplete}
            href={membershipComplete ? "/account/membership" : "/account/membership/new"}
            cta={membershipComplete ? "View membership" : "Start application"}
          />
        </div>
      )}
    </AccountShell>
  );
}
