import Link from "next/link";
import { redirect } from "next/navigation";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { Container } from "@/components/ui/Container";
import { getDriversForCurrentUser } from "@/lib/data/drivers";
import { getCurrentUserProfile, requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, focusRing, sectionDefault, sectionHome, textLink } from "@/lib/cn";
import { signOutAction } from "@/app/account/drivers/actions";

export const metadata = createPageMetadata({
  title: "Account | KartSport Auckland Mt Wellington",
  description: "Manage your KartSport Auckland Mt Wellington account.",
  noIndex: true,
});

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return (
      <section className={cn(sectionDefault, sectionHome)}>
        <Container className="max-w-2xl">
          <h1 className="text-2xl font-semibold text-ink">Account</h1>
          <div className="mt-6">
            <SupabaseSetupNotice />
          </div>
        </Container>
      </section>
    );
  }

  const { user, redirectTo } = await requireUser();
  if (redirectTo) redirect(redirectTo);

  const [profile, drivers] = await Promise.all([getCurrentUserProfile(), getDriversForCurrentUser()]);

  return (
    <section className={cn(sectionDefault, sectionHome)}>
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Account</h1>
            <p className="mt-2 text-sm text-ink-muted">{user?.email}</p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-surface-alt"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4">
          <div className={cn(cardBase, "p-5")}>
            <h2 className="text-lg font-semibold text-ink">Profile</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Membership status</dt>
                <dd className="font-medium text-ink">{profile?.membership_status ?? "unknown"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Name</dt>
                <dd className="font-medium text-ink">
                  {[profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Not set"}
                </dd>
              </div>
            </dl>
          </div>

          <div className={cn(cardBase, "p-5")}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-ink">Drivers</h2>
              <Link href="/account/drivers" className={cn(textLink, "text-sm", focusRing)}>
                Manage drivers &rarr;
              </Link>
            </div>
            {drivers.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {drivers.map((driver) => (
                  <li key={driver.id} className="text-ink">
                    {driver.first_name} {driver.last_name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">No drivers saved yet.</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
