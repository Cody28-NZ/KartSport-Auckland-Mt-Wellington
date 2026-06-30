import { createClientIfConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { PracticeRegistration, PracticeSession } from "@/types/database";

export async function getPracticeSessions(): Promise<PracticeSession[]> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("practice_sessions")
    .select("*")
    .eq("active", true)
    .order("starts_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as PracticeSession[];
}

export async function getPracticeRegistrationsForCurrentUser(): Promise<PracticeRegistration[]> {
  const supabase = await createClientIfConfigured();
  const user = await getCurrentUser();
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from("practice_registrations")
    .select("*")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as PracticeRegistration[];
}
