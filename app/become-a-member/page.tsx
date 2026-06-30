import { BecomeAMemberPageContent } from "@/components/site/become-a-member/BecomeAMemberPageContent";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Join or register a driver | KartSport Auckland Mt Wellington",
  description: "Register a junior driver, adult driver, social/pit member or visiting driver with KartSport Auckland Mt Wellington.",
});

const MEMBERSHIP_NEXT = "/account/membership/new";
const LOGIN_WITH_NEXT = `/login?next=${encodeURIComponent(MEMBERSHIP_NEXT)}`;

export default async function BecomeAMemberPage() {
  const user = isSupabaseConfigured() ? await getCurrentUser() : null;

  return (
    <BecomeAMemberPageContent
      user={user}
      membershipNext={MEMBERSHIP_NEXT}
      loginWithNext={LOGIN_WITH_NEXT}
    />
  );
}
