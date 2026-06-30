import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { ProfileForm } from "@/components/account/ProfileForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { getCurrentUserProfile, requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Profile | KartSport Auckland Mt Wellington",
  description: "Edit your KartSport Auckland Mt Wellington account profile.",
  noIndex: true,
});

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <AccountShell currentPath="/account/profile" title="Profile">
        <SupabaseSetupNotice />
      </AccountShell>
    );
  }

  const { user, redirectTo } = await requireUser();
  if (redirectTo) redirect(redirectTo);

  const profile = await getCurrentUserProfile();

  return (
    <AccountShell
      currentPath="/account/profile"
      title="Profile"
      description="These are the login/account holder details for this account."
    >
      <ProfileForm profile={profile} email={user?.email ?? ""} />
    </AccountShell>
  );
}
