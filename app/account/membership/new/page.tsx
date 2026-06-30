import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { MembershipWizard } from "@/components/account/MembershipWizard";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { currentSeasonLabel } from "@/lib/account/format";
import { getPeopleForCurrentUser } from "@/lib/data/people";
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

  const [profile, people, products, terms, classOptions, licenceTypeOptions, licenceRatingOptions, clubOptions] =
    await Promise.all([
      getCurrentUserProfile(),
      getPeopleForCurrentUser(),
      getMembershipProducts(),
      getActiveMembershipTerms(),
      getOptionValues("kart_classes"),
      getOptionValues("ksnz_licence_types"),
      getOptionValues("ksnz_licence_ratings"),
      getOptionValues("clubs"),
    ]);

  return (
    <AccountShell
      currentPath="/account/membership"
      title="Membership application"
      description="Register a junior driver, adult driver, social/pit member or visiting driver. Payment is handled separately by the club."
    >
      <MembershipWizard
        profile={profile}
        people={people}
        products={products}
        terms={terms}
        classOptions={classOptions}
        licenceTypeOptions={licenceTypeOptions}
        licenceRatingOptions={licenceRatingOptions}
        clubOptions={clubOptions}
        seasonLabel={currentSeasonLabel()}
      />
    </AccountShell>
  );
}
