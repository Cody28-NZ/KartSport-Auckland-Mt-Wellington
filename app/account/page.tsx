import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { MembershipStatusBadge } from "@/components/account/MembershipStatusBadge";
import { QuickActionCard } from "@/components/account/QuickActionCard";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CtaButton } from "@/components/ui/CtaButton";
import { signOutAction } from "@/app/account/actions";
import {
  applicantDisplayName,
  applicationTypeLabel,
  isJuniorApplication,
  managedByDisplayName,
  primaryProductName,
} from "@/lib/account/application-display";
import {
  formatCurrency,
  formatPaymentStatus,
  hasPeople,
  hasSubmittedMembership,
  isProfileComplete,
} from "@/lib/account/format";
import { getMembershipApplicationsWithDetailsForCurrentUser } from "@/lib/data/membership";
import { getPeopleForCurrentUser } from "@/lib/data/people";
import { getCurrentUserProfile, requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, focusRing } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Account | KartSport Auckland Mt Wellington",
  description: "Manage your KartSport Auckland Mt Wellington account.",
  noIndex: true,
});

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return (
      <AccountShell currentPath="/account" title="Account" showBackLink={false}>
        <SupabaseSetupNotice />
      </AccountShell>
    );
  }

  const { user, redirectTo } = await requireUser();
  if (redirectTo) redirect(redirectTo);

  const [profile, people, applicationDetails] = await Promise.all([
    getCurrentUserProfile(),
    getPeopleForCurrentUser(),
    getMembershipApplicationsWithDetailsForCurrentUser(),
  ]);

  const applications = applicationDetails.map((d) => d.application);
  const profileComplete = isProfileComplete(profile);
  const peopleCount = people.length;
  const latestDetail = applicationDetails[0] ?? null;
  const latestApplication = latestDetail?.application ?? null;
  const hasMembership = hasSubmittedMembership(applications);
  const noApplication = !applications.length;

  return (
    <AccountShell
      currentPath="/account"
      title={noApplication ? "Welcome" : "Dashboard"}
      description={user?.email ?? undefined}
      showBackLink={false}
      actions={
        <form action={signOutAction}>
          <button
            type="submit"
            className={cn(
              "rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-surface-alt",
              focusRing,
            )}
          >
            Sign out
          </button>
        </form>
      }
    >
      {noApplication ? (
        <div className={cn(cardBase, "p-6")}>
          <h2 className="text-lg font-semibold text-ink">Start membership application</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Register a junior driver, adult driver, social/pit member or visiting driver.
          </p>
          <div className="mt-5">
            <CtaButton label="Start membership application" href="/account/membership/new" variant="primary" />
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className={cn(cardBase, "p-5")}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Account holder</h2>
          <p className="mt-2 font-medium text-ink">
            {[profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Name not set"}
          </p>
          <div className="mt-3">
            <StatusBadge
              status={profileComplete ? "success" : "warning"}
              label={profileComplete ? "Profile complete" : "Profile incomplete"}
            />
          </div>
        </div>

        <div className={cn(cardBase, "p-5")}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Membership</h2>
          <div className="mt-3">
            <MembershipStatusBadge status={profile?.membership_status} />
          </div>
          {latestDetail ? (
            <div className="mt-3 space-y-1 text-sm text-ink-muted">
              {isJuniorApplication({ application: latestDetail.application, applicant: latestDetail.applicant, managedBy: latestDetail.managedBy, items: latestDetail.items }) ? (
                <>
                  <p>
                    Member: <span className="font-medium text-ink">{applicantDisplayName(latestDetail.applicant)}</span>
                  </p>
                  <p>
                    Managed by:{" "}
                    <span className="font-medium text-ink">
                      {managedByDisplayName(latestDetail.managedBy) ?? "Account holder"}
                    </span>
                  </p>
                </>
              ) : (
                <p>
                  Latest: {applicationTypeLabel({ application: latestDetail.application, applicant: latestDetail.applicant, managedBy: latestDetail.managedBy, items: latestDetail.items })} ·{" "}
                  {formatPaymentStatus(latestDetail.application.payment_status)}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">No membership application yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className={cn(cardBase, "p-5")}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">People & Drivers</h2>
            <Link href="/account/people" className={cn("text-sm font-medium text-brand hover:text-brand-hover", focusRing)}>
              Manage
            </Link>
          </div>
          {peopleCount ? (
            <ul className="mt-3 space-y-2 text-sm">
              {people.map((person) => (
                <li key={person.id} className="text-ink">
                  {person.first_name} {person.last_name}
                  {person.is_driver ? " (driver)" : ""}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-border bg-surface-alt/50 p-4 text-center">
              <p className="text-sm text-ink-muted">People are usually created through a membership application.</p>
              <Link href="/account/membership/new" className={cn("mt-2 inline-block text-sm font-medium text-brand hover:text-brand-hover", focusRing)}>
                Start membership application
              </Link>
            </div>
          )}
        </div>

        <div className={cn(cardBase, "p-5")}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Membership application</h2>
            <Link href="/account/membership" className={cn("text-sm font-medium text-brand hover:text-brand-hover", focusRing)}>
              View all
            </Link>
          </div>
          {latestDetail ? (
            <dl className="mt-3 space-y-2 text-sm">
              {isJuniorApplication({ application: latestDetail.application, applicant: latestDetail.applicant, managedBy: latestDetail.managedBy, items: latestDetail.items }) ? (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Member</dt>
                    <dd className="text-right font-medium text-ink">{applicantDisplayName(latestDetail.applicant)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Managed by</dt>
                    <dd className="text-right font-medium text-ink">
                      {managedByDisplayName(latestDetail.managedBy) ?? "Account holder"}
                    </dd>
                  </div>
                </>
              ) : (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Type</dt>
                  <dd className="text-right font-medium text-ink">
                    {applicationTypeLabel({ application: latestDetail.application, applicant: latestDetail.applicant, managedBy: latestDetail.managedBy, items: latestDetail.items })}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Product</dt>
                <dd className="text-right font-medium text-ink">
                  {primaryProductName(latestDetail.items) ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Amount due</dt>
                <dd className="font-medium text-ink">{formatCurrency(Number(latestApplication?.amount_due ?? 0))}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Payment</dt>
                <dd className="font-medium text-ink">{formatPaymentStatus(latestApplication?.payment_status ?? "not_required")}</dd>
              </div>
            </dl>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-border bg-surface-alt/50 p-4 text-center">
              <Link href="/account/membership/new" className={cn("text-sm font-medium text-brand hover:text-brand-hover", focusRing)}>
                Start membership application
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-ink">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard title="People & Drivers" description="Manage family, drivers and non-driving members." href="/account/people" badge={peopleCount ? `${peopleCount} saved` : undefined} />
          <QuickActionCard title="Account profile" description="Login owner contact details." href="/account/profile" badge={profileComplete ? "Done" : "Incomplete"} />
          <QuickActionCard title={hasMembership ? "View membership" : "Start membership application"} description="Submit or review membership applications." href={hasMembership ? "/account/membership" : "/account/membership/new"} />
          <QuickActionCard title="Practice registrations" description="Coming soon." disabled badge="Coming soon" />
          <QuickActionCard title="Race entries" description="Coming soon." disabled badge="Coming soon" />
          {!profileComplete || !hasPeople(people) || !hasMembership ? (
            <QuickActionCard title="Setup guide" description="Follow onboarding steps." href="/account/onboarding" />
          ) : null}
        </div>
      </div>
    </AccountShell>
  );
}
