import { createClientIfConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { MembershipApplication, MembershipProduct, TermsVersion } from "@/types/database";

export async function getMembershipProducts(): Promise<MembershipProduct[]> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("membership_products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as MembershipProduct[];
}

export async function getMembershipApplicationsForCurrentUser(): Promise<MembershipApplication[]> {
  const supabase = await createClientIfConfigured();
  const user = await getCurrentUser();
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from("membership_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as MembershipApplication[];
}

export async function getActiveMembershipTerms(): Promise<TermsVersion | null> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("terms_versions")
    .select("*")
    .eq("context", "membership")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as TermsVersion | null;
}
