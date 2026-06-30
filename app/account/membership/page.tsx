import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { MembershipStatusBadge } from "@/components/account/MembershipStatusBadge";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { CtaButton } from "@/components/ui/CtaButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  currentSeasonLabel,
  formatCurrency,
  formatPaymentStatus,
  formatRegistrationStatus,
} from "@/lib/account/format";
import { formatMembershipIntent } from "@/lib/account/membership-intents";
import { getMembershipApplicationsForCurrentUser } from "@/lib/data/membership";
import { getCurrentUserProfile, requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, focusRing } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Membership | KartSport Auckland Mt Wellington",
  description: "View your KartSport Auckland Mt Wellington membership applications.",
  noIndex: true,
});

interface MembershipPageProps {
  searchParams: Promise<{ submitted?: string }>;
}

export default async function MembershipPage({ searchParams }: MembershipPageProps) {
  if (!isSupabaseConfigured()) {
    return (
      <AccountShell currentPath="/account/membership" title="Membership">
        <SupabaseSetupNotice />
      </AccountShell>
    );
  }

  const { redirectTo } = await requireUser();
  if (redirectTo) redirect(redirectTo);

  const params = await searchParams;
  const [profile, applications] = await Promise.all([getCurrentUserProfile(), getMembershipApplicationsForCurrentUser()]);

  return (
    <AccountShell
      currentPath="/account/membership"
      title="Membership"
      description="View your membership status and submitted applications."
      actions={<CtaButton label="Start new application" href="/account/membership/new" variant="primary" size="sm" />}
    >
      {params.submitted ? (
        <div className={cn(cardBase, "mb-6 border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900")}>
          Application submitted. Payment is handled separately by the club.
        </div>
      ) : null}

      <div className={cn(cardBase, "p-5")}>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Current status</h2>
        <div className="mt-3">
          <MembershipStatusBadge status={profile?.membership_status} />
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          Season {currentSeasonLabel()}. Payment is handled separately by the club after you submit an application.
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-ink">Submitted applications</h2>
        {applications.length ? (
          <ul className="mt-4 space-y-3">
            {applications.map((application) => (
              <li key={application.id} className={cn(cardBase, "p-5")}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{formatMembershipIntent(application.membership_intent)}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      Season {application.season_label} · Submitted {new Date(application.submitted_at).toLocaleDateString("en-NZ")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status="info" label={formatRegistrationStatus(application.status)} />
                    <StatusBadge status="warning" label={formatPaymentStatus(application.payment_status)} />
                  </div>
                </div>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex justify-between gap-4 sm:block">
                    <dt className="text-ink-muted">Amount due</dt>
                    <dd className="font-medium text-ink">{formatCurrency(Number(application.amount_due))}</dd>
                  </div>
                  {application.primary_driver_person_id ? (
                    <div className="flex justify-between gap-4 sm:block">
                      <dt className="text-ink-muted">Driver linked</dt>
                      <dd className="font-medium text-ink">Yes</dd>
                    </div>
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>
        ) : (
          <div className={cn(cardBase, "mt-4 p-6 text-center")}>
            <p className="text-sm text-ink-muted">No membership applications yet.</p>
            <Link
              href="/account/membership/new"
              className={cn("mt-3 inline-block text-sm font-medium text-brand hover:text-brand-hover", focusRing)}
            >
              Start membership application
            </Link>
          </div>
        )}
      </div>
    </AccountShell>
  );
}
