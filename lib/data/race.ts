import { createClientIfConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { RaceEntry, RaceEvent } from "@/types/database";

export async function getRaceEvents(): Promise<RaceEvent[]> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("race_events")
    .select("*")
    .eq("active", true)
    .order("event_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as RaceEvent[];
}

export async function getRaceEntriesForCurrentUser(): Promise<RaceEntry[]> {
  const supabase = await createClientIfConfigured();
  const user = await getCurrentUser();
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from("race_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as RaceEntry[];
}
