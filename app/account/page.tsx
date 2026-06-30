import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { MembershipStatusBadge } from "@/components/account/MembershipStatusBadge";
import { QuickActionCard } from "@/components/account/QuickActionCard";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { signOutAction } from "@/app/account/actions";
import {
  formatCurrency,
  formatPaymentStatus,
  formatRegistrationStatus,
  hasDrivers,
  hasSubmittedMembership,
  isProfileComplete,
} from "@/lib/account/format";
import { getMembershipApplicationsForCurrentUser } from "@/lib/data/membership";
import { getDriversForCurrentUser } from "@/lib/data/drivers";
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

  const [profile, drivers, applications] = await Promise.all([
    getCurrentUserProfile(),
    getDriversForCurrentUser(),
    getMembershipApplicationsForCurrentUser(),
  ]);

  const profileComplete = isProfileComplete(profile);
  const driverCount = drivers.length;
  const submittedApplications = applications.filter((app) => app.status === "submitted");
  const latestApplication = submittedApplications[0] ?? applications[0] ?? null;
  const hasMembership = hasSubmittedMembership(applications);

  return (
    <AccountShell
      currentPath="/account"
      title="Dashboard"
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={cn(cardBase, "p-5")}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Profile</h2>
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
          {latestApplication ? (
            <p className="mt-3 text-sm text-ink-muted">
              Latest application: {formatRegistrationStatus(latestApplication.status)} ·{" "}
              {formatPaymentStatus(latestApplication.payment_status)}
            </p>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">No membership application yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className={cn(cardBase, "p-5")}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Drivers</h2>
            <Link href="/account/drivers" className={cn("text-sm font-medium text-brand hover:text-brand-hover", focusRing)}>
              Manage
            </Link>
          </div>
          {driverCount ? (
            <ul className="mt-3 space-y-2 text-sm">
              {drivers.map((driver) => (
                <li key={driver.id} className="text-ink">
                  {driver.first_name} {driver.last_name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-border bg-surface-alt/50 p-4 text-center">
              <p className="text-sm text-ink-muted">No drivers added yet.</p>
              <Link href="/account/drivers" className={cn("mt-2 inline-block text-sm font-medium text-brand hover:text-brand-hover", focusRing)}>
                Add your first driver
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
          {latestApplication ? (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Season</dt>
                <dd className="font-medium text-ink">{latestApplication.season_label}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Amount due</dt>
                <dd className="font-medium text-ink">{formatCurrency(Number(latestApplication.amount_due))}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Status</dt>
                <dd className="font-medium text-ink">{formatRegistrationStatus(latestApplication.status)}</dd>
              </div>
            </dl>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-border bg-surface-alt/50 p-4 text-center">
              <p className="text-sm text-ink-muted">Start your membership application when you are ready.</p>
              <Link
                href="/account/membership/new"
                className={cn("mt-2 inline-block text-sm font-medium text-brand hover:text-brand-hover", focusRing)}
              >
                Start membership application
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-ink">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Complete profile"
            description="Add your contact details and address."
            href="/account/profile"
            badge={profileComplete ? "Done" : "Incomplete"}
          />
          <QuickActionCard
            title="Manage drivers"
            description="Add or update drivers on your account."
            href="/account/drivers"
            badge={driverCount ? `${driverCount} saved` : undefined}
          />
          <QuickActionCard
            title={hasMembership ? "View membership" : "Become a member"}
            description={hasMembership ? "Review your membership applications." : "Submit your club membership application."}
            href={hasMembership ? "/account/membership" : "/account/membership/new"}
          />
          <QuickActionCard
            title="Register for practice"
            description="Practice registration will be available soon."
            disabled
            badge="Coming soon"
          />
          <QuickActionCard
            title="Enter a race"
            description="Race entry will be available soon."
            disabled
            badge="Coming soon"
          />
          {!profileComplete || !hasDrivers(drivers) || !hasMembership ? (
            <QuickActionCard
              title="Setup guide"
              description="Follow the onboarding steps to get started."
              href="/account/onboarding"
            />
          ) : null}
        </div>
      </div>
    </AccountShell>
  );
}
