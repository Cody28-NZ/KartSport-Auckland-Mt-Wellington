"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";

export async function saveProfileAction(formData: FormData) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/profile");

  const payload = {
    first_name: String(formData.get("first_name") ?? "").trim() || null,
    last_name: String(formData.get("last_name") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    street_address: String(formData.get("street_address") ?? "").trim() || null,
    suburb: String(formData.get("suburb") ?? "").trim() || null,
    town_city: String(formData.get("town_city") ?? "").trim() || null,
    postcode: String(formData.get("postcode") ?? "").trim() || null,
    occupation: String(formData.get("occupation") ?? "").trim() || null,
  };

  const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/account");
  revalidatePath("/account/profile");
  revalidatePath("/account/onboarding");
  return { success: true };
}
