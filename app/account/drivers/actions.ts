"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isJuniorDriver } from "@/lib/drivers/utils";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";

export async function saveDriverAction(formData: FormData) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const driverId = String(formData.get("driver_id") ?? "");
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const dateOfBirth = String(formData.get("date_of_birth") ?? "");
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (!firstName || !lastName || !dateOfBirth) {
    return { error: "First name, last name and date of birth are required." };
  }

  const payload = {
    owner_user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    date_of_birth: dateOfBirth,
    email,
    phone,
    street_address: String(formData.get("street_address") ?? "").trim() || null,
    suburb: String(formData.get("suburb") ?? "").trim() || null,
    town_city: String(formData.get("town_city") ?? "").trim() || null,
    postcode: String(formData.get("postcode") ?? "").trim() || null,
    default_class_id: String(formData.get("default_class_id") ?? "").trim() || null,
    default_kart_number: String(formData.get("kart_number") ?? "").trim() || null,
    default_race_number: String(formData.get("race_number") ?? "").trim() || null,
    default_transponder_number: String(formData.get("transponder_number") ?? "").trim() || null,
  };

  let savedDriverId = driverId;

  if (driverId) {
    const { error } = await supabase.from("drivers").update(payload).eq("id", driverId).eq("owner_user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase.from("drivers").insert(payload).select("id").single();
    if (error) return { error: error.message };
    savedDriverId = data.id;
  }

  if (isJuniorDriver(dateOfBirth)) {
    const guardianFirstName = String(formData.get("guardian_first_name") ?? "").trim();
    const guardianLastName = String(formData.get("guardian_last_name") ?? "").trim();
    const guardianEmail = String(formData.get("guardian_email") ?? "").trim() || null;
    const guardianPhone = String(formData.get("guardian_phone") ?? "").trim() || null;
    const relationship = String(formData.get("guardian_relationship") ?? "").trim() || null;

    if (!guardianFirstName || !guardianLastName) {
      return { error: "Guardian first and last name are required for drivers under 18." };
    }

    const guardianPayload = {
      driver_id: savedDriverId,
      guardian_number: 1,
      first_name: guardianFirstName,
      last_name: guardianLastName,
      email: guardianEmail,
      phone: guardianPhone,
      street_address: String(formData.get("guardian_street_address") ?? "").trim() || null,
      occupation: String(formData.get("guardian_occupation") ?? "").trim() || null,
      relationship,
      is_primary: true,
    };

    const { data: existingGuardian } = await supabase
      .from("guardians")
      .select("id")
      .eq("driver_id", savedDriverId)
      .eq("is_primary", true)
      .maybeSingle();

    if (existingGuardian?.id) {
      const { error } = await supabase.from("guardians").update(guardianPayload).eq("id", existingGuardian.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("guardians").insert(guardianPayload);
      if (error) return { error: error.message };
    }
  }

  const licenceNumber = String(formData.get("licence_number") ?? "").trim();
  const licencePayload = {
    driver_id: savedDriverId,
    licence_number: licenceNumber || null,
    licence_type_id: String(formData.get("licence_type_id") ?? "").trim() || null,
    licence_rating_id: String(formData.get("licence_rating_id") ?? "").trim() || null,
    issuing_club_id: String(formData.get("issuing_club_id") ?? "").trim() || null,
    licence_confirmed_green: formData.get("licence_confirmed_green") === "on",
  };

  const { data: existingLicence } = await supabase
    .from("driver_licences")
    .select("id")
    .eq("driver_id", savedDriverId)
    .limit(1)
    .maybeSingle();

  if (existingLicence?.id) {
    await supabase.from("driver_licences").update(licencePayload).eq("id", existingLicence.id);
  } else if (licenceNumber || licencePayload.licence_type_id || licencePayload.licence_rating_id) {
    await supabase.from("driver_licences").insert(licencePayload);
  }

  revalidatePath("/account/drivers");
  revalidatePath("/account");
  revalidatePath("/account/onboarding");
  return { success: true };
}
