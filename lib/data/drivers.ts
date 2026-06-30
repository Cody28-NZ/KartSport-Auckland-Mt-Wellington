import { createClientIfConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isJuniorDriver } from "@/lib/drivers/utils";
import type { Driver, DriverKart, DriverLicence, Guardian } from "@/types/database";

export { isJuniorDriver };

export async function getDriversForCurrentUser(): Promise<Driver[]> {
  const supabase = await createClientIfConfigured();
  const user = await getCurrentUser();
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .eq("owner_user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Driver[];
}

export async function getDriverWithDetails(driverId: string) {
  const supabase = await createClientIfConfigured();
  const user = await getCurrentUser();
  if (!supabase || !user) return null;

  const { data: driver, error: driverError } = await supabase
    .from("drivers")
    .select("*")
    .eq("id", driverId)
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (driverError) throw driverError;
  if (!driver) return null;

  const [{ data: guardians }, { data: licences }, { data: karts }] = await Promise.all([
    supabase.from("guardians").select("*").eq("driver_id", driverId).order("guardian_number"),
    supabase.from("driver_licences").select("*").eq("driver_id", driverId),
    supabase.from("driver_karts").select("*").eq("driver_id", driverId),
  ]);

  return {
    driver: driver as Driver,
    guardians: (guardians ?? []) as Guardian[],
    licences: (licences ?? []) as DriverLicence[],
    karts: (karts ?? []) as DriverKart[],
  };
}

