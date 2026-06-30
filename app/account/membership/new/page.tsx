import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { MembershipApplicationForm } from "@/components/account/MembershipApplicationForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { currentSeasonLabel } from "@/lib/account/format";
import { getDriverWithDetails, getDriversForCurrentUser } from "@/lib/data/drivers";
import { getActiveMembershipTerms, getMembershipProducts } from "@/lib/data/membership";
import { getOptionValues } from "@/lib/data/options";
import { getCurrentUserProfile, requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "New membership application | KartSport Auckland Mt Wellington",
  description: "Submit a KartSport Auckland Mt Wellington membership application.",
  noIndex: true,
});

export default async function NewMembershipPage() {
  if (!isSupabaseConfigured()) {
    return (
      <AccountShell currentPath="/account/membership/new" title="Membership application">
        <SupabaseSetupNotice />
      </AccountShell>
    );
  }

  const { redirectTo } = await requireUser();
  if (redirectTo) redirect(`/login?next=/account/membership/new`);

  const [profile, driversList, products, terms, classOptions, volunteerRoles] = await Promise.all([
    getCurrentUserProfile(),
    getDriversForCurrentUser(),
    getMembershipProducts(),
    getActiveMembershipTerms(),
    getOptionValues("kart_classes"),
    getOptionValues("volunteer_roles"),
  ]);

  const drivers = await Promise.all(
    driversList.map(async (driver) => {
      const details = await getDriverWithDetails(driver.id);
      return {
        driver,
        guardian: details?.guardians.find((g) => g.is_primary) ?? details?.guardians[0] ?? null,
      };
    }),
  );

  return (
    <AccountShell
      currentPath="/account/membership"
      title="Membership application"
      description={`Season ${currentSeasonLabel()}. Select products and submit your application — payment is handled separately by the club.`}
    >
      <MembershipApplicationForm
        drivers={drivers}
        products={products}
        terms={terms}
        classOptions={classOptions}
        volunteerRoles={volunteerRoles}
        profile={profile}
        seasonLabel={currentSeasonLabel()}
      />
    </AccountShell>
  );
}
