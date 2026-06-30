import { createClientIfConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getCurrentUser() {
  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (error) throw error;
  return data as Profile | null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, redirectTo: "/login" as const };
  }
  return { user, redirectTo: null };
}

export async function requireAdmin() {
  const supabase = await createClientIfConfigured();
  if (!supabase) {
    return { authorized: false as const, reason: "not_configured" as const };
  }

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { authorized: false as const, reason: "unauthenticated" as const };
  }

  const profile = await getCurrentUserProfile();
  if (!profile?.is_admin) {
    const { data: roles } = await supabase
      .from("admin_roles")
      .select("id")
      .eq("user_id", authData.user.id)
      .eq("active", true)
      .limit(1);

    if (!roles?.length) {
      return { authorized: false as const, reason: "forbidden" as const };
    }
  }

  return { authorized: true as const, supabase, user: authData.user };
}
