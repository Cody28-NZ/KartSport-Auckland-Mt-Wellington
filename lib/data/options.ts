import { createClientIfConfigured } from "@/lib/supabase/server";
import type { OptionValue } from "@/types/database";

export async function getOptionValues(setKey: string): Promise<OptionValue[]> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return [];

  const { data: set, error: setError } = await supabase
    .from("option_sets")
    .select("id")
    .eq("key", setKey)
    .maybeSingle();

  if (setError) throw setError;
  if (!set) return [];

  const { data, error } = await supabase
    .from("option_values")
    .select("*")
    .eq("option_set_id", set.id)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as OptionValue[];
}
