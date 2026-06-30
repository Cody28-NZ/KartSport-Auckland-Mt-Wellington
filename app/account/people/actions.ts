"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isJuniorPerson } from "@/lib/people/utils";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { PersonType, RelationshipType } from "@/types/database";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function nullableStr(formData: FormData, key: string): string | null {
  const value = str(formData, key);
  return value || null;
}

export async function savePersonAction(formData: FormData) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/people");

  const personId = str(formData, "person_id");
  const firstName = str(formData, "first_name");
  const lastName = str(formData, "last_name");
  const dateOfBirth = nullableStr(formData, "date_of_birth");
  const personType = (str(formData, "person_type") || "other") as PersonType;
  const isDriver = formData.get("is_driver") === "on";
  const isAccountHolder = formData.get("is_account_holder") === "on";

  if (!firstName || !lastName) {
    return { error: "First name and last name are required." };
  }

  if (isDriver && !dateOfBirth) {
    return { error: "Date of birth is required for drivers." };
  }

  const personPayload = {
    owner_user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    date_of_birth: dateOfBirth,
    email: nullableStr(formData, "email"),
    phone: nullableStr(formData, "phone"),
    street_address: nullableStr(formData, "street_address"),
    suburb: nullableStr(formData, "suburb"),
    town_city: nullableStr(formData, "town_city"),
    postcode: nullableStr(formData, "postcode"),
    occupation: nullableStr(formData, "occupation"),
    person_type: personType,
    is_driver: isDriver,
    is_account_holder: isAccountHolder,
  };

  let savedPersonId = personId;

  if (personId) {
    const { error } = await supabase.from("people").update(personPayload).eq("id", personId).eq("owner_user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase.from("people").insert(personPayload).select("id").single();
    if (error) return { error: error.message };
    savedPersonId = data.id;
  }

  if (isDriver) {
    const driverPayload = {
      person_id: savedPersonId,
      default_class_id: nullableStr(formData, "default_class_id"),
      default_kart_number: nullableStr(formData, "kart_number"),
      default_race_number: nullableStr(formData, "race_number"),
      default_transponder_number: nullableStr(formData, "transponder_number"),
      default_club_id: nullableStr(formData, "issuing_club_id"),
      active: true,
    };

    const { data: existingProfile } = await supabase
      .from("driver_profiles")
      .select("id")
      .eq("person_id", savedPersonId)
      .maybeSingle();

    if (existingProfile?.id) {
      await supabase.from("driver_profiles").update(driverPayload).eq("id", existingProfile.id);
    } else {
      await supabase.from("driver_profiles").insert(driverPayload);
    }

    const licencePayload = {
      person_id: savedPersonId,
      licence_number: nullableStr(formData, "licence_number"),
      licence_type_id: nullableStr(formData, "licence_type_id"),
      licence_rating_id: nullableStr(formData, "licence_rating_id"),
      issuing_club_id: nullableStr(formData, "issuing_club_id"),
      licence_confirmed_green: formData.get("licence_confirmed_green") === "on",
    };

    const { data: existingLicence } = await supabase
      .from("driver_licences")
      .select("id")
      .eq("person_id", savedPersonId)
      .limit(1)
      .maybeSingle();

    if (existingLicence?.id) {
      await supabase.from("driver_licences").update(licencePayload).eq("id", existingLicence.id);
    } else if (
      licencePayload.licence_number ||
      licencePayload.licence_type_id ||
      licencePayload.licence_rating_id
    ) {
      await supabase.from("driver_licences").insert(licencePayload);
    }
  }

  if (dateOfBirth && isJuniorPerson(dateOfBirth) && isDriver) {
    const useAccountHolder = formData.get("use_account_holder_as_guardian") === "on";
    let guardianPersonId = str(formData, "guardian_person_id");

    if (useAccountHolder) {
      const { data: holder } = await supabase
        .from("people")
        .select("id")
        .eq("owner_user_id", user.id)
        .eq("is_account_holder", true)
        .maybeSingle();

      if (holder?.id) {
        guardianPersonId = holder.id;
      } else {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        const { data: createdHolder, error: holderError } = await supabase
          .from("people")
          .insert({
            owner_user_id: user.id,
            first_name: profile?.first_name ?? "Account",
            last_name: profile?.last_name ?? "Holder",
            email: profile?.email,
            phone: profile?.phone,
            street_address: profile?.street_address,
            suburb: profile?.suburb,
            town_city: profile?.town_city,
            postcode: profile?.postcode,
            occupation: profile?.occupation,
            person_type: "account_holder",
            is_driver: false,
            is_account_holder: true,
          })
          .select("id")
          .single();
        if (holderError) return { error: holderError.message };
        guardianPersonId = createdHolder.id;
      }
    } else {
      const guardianFirst = str(formData, "guardian_first_name");
      const guardianLast = str(formData, "guardian_last_name");
      if (!guardianFirst || !guardianLast) {
        return { error: "Guardian first and last name are required for people under 18 who drive." };
      }

      const guardianPayload = {
        owner_user_id: user.id,
        first_name: guardianFirst,
        last_name: guardianLast,
        email: nullableStr(formData, "guardian_email"),
        phone: nullableStr(formData, "guardian_phone"),
        street_address: nullableStr(formData, "guardian_street_address"),
        occupation: nullableStr(formData, "guardian_occupation"),
        person_type: "parent_guardian" as PersonType,
        is_driver: false,
        is_account_holder: false,
      };

      if (guardianPersonId) {
        await supabase.from("people").update(guardianPayload).eq("id", guardianPersonId).eq("owner_user_id", user.id);
      } else {
        const { data: createdGuardian, error: guardianError } = await supabase
          .from("people")
          .insert(guardianPayload)
          .select("id")
          .single();
        if (guardianError) return { error: guardianError.message };
        guardianPersonId = createdGuardian.id;
      }
    }

    const relationshipType = (nullableStr(formData, "guardian_relationship_type") ?? "guardian") as RelationshipType;
    const relationshipPayload = {
      owner_user_id: user.id,
      from_person_id: guardianPersonId,
      to_person_id: savedPersonId,
      relationship_type: relationshipType,
      is_primary: true,
    };

    const { data: existingRel } = await supabase
      .from("person_relationships")
      .select("id")
      .eq("to_person_id", savedPersonId)
      .eq("is_primary", true)
      .maybeSingle();

    if (existingRel?.id) {
      await supabase.from("person_relationships").update(relationshipPayload).eq("id", existingRel.id);
    } else {
      await supabase.from("person_relationships").insert(relationshipPayload);
    }
  }

  revalidatePath("/account/people");
  revalidatePath("/account");
  revalidatePath("/account/onboarding");
  return { success: true };
}

export async function ensureAccountHolderFromProfile(userId: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("people")
    .select("id")
    .eq("owner_user_id", userId)
    .eq("is_account_holder", true)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (!profile?.first_name || !profile?.last_name) return null;

  const { data, error } = await supabase
    .from("people")
    .insert({
      owner_user_id: userId,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      street_address: profile.street_address,
      suburb: profile.suburb,
      town_city: profile.town_city,
      postcode: profile.postcode,
      occupation: profile.occupation,
      person_type: "account_holder",
      is_driver: false,
      is_account_holder: true,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}
