"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productsForIntent } from "@/lib/account/membership-intents";
import { currentSeasonLabel } from "@/lib/account/format";
import { ensureAccountHolderFromProfile } from "@/app/account/people/actions";
import { isJuniorPerson } from "@/lib/people/utils";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { MembershipIntent, MembershipProduct, PersonType, RelationshipType } from "@/types/database";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function nullableStr(formData: FormData, key: string): string | null {
  const value = str(formData, key);
  return value || null;
}

export async function submitMembershipApplicationAction(formData: FormData) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/membership/new");

  const intent = str(formData, "membership_intent") as MembershipIntent;
  const termsAccepted = formData.get("terms_accepted") === "on";

  if (!intent) return { error: "Please choose an application type." };
  if (!termsAccepted) return { error: "You must accept the membership terms and conditions." };

  await supabase
    .from("profiles")
    .update({
      first_name: nullableStr(formData, "holder_first_name"),
      last_name: nullableStr(formData, "holder_last_name"),
      phone: nullableStr(formData, "holder_phone"),
      street_address: nullableStr(formData, "holder_street_address"),
      suburb: nullableStr(formData, "holder_suburb"),
      town_city: nullableStr(formData, "holder_town_city"),
      postcode: nullableStr(formData, "holder_postcode"),
      occupation: nullableStr(formData, "holder_occupation"),
    })
    .eq("id", user.id);

  const accountHolderPersonId = await ensureAccountHolderFromProfile(user.id);

  let applicantPersonId = str(formData, "applicant_person_id");
  const sameAsAccountHolder = formData.get("applicant_same_as_holder") === "on";

  if (sameAsAccountHolder && accountHolderPersonId) {
    applicantPersonId = accountHolderPersonId;
    await supabase
      .from("people")
      .update({
        first_name: nullableStr(formData, "holder_first_name") ?? undefined,
        last_name: nullableStr(formData, "holder_last_name") ?? undefined,
        phone: nullableStr(formData, "holder_phone"),
        street_address: nullableStr(formData, "holder_street_address"),
        suburb: nullableStr(formData, "holder_suburb"),
        town_city: nullableStr(formData, "holder_town_city"),
        postcode: nullableStr(formData, "holder_postcode"),
        occupation: nullableStr(formData, "holder_occupation"),
      })
      .eq("id", accountHolderPersonId);
  } else if (!applicantPersonId) {
    const dob = nullableStr(formData, "applicant_date_of_birth");
    const requiresDriving = formData.get("requires_driving") === "on";
    const { data: created, error: personError } = await supabase
      .from("people")
      .insert({
        owner_user_id: user.id,
        first_name: str(formData, "applicant_first_name"),
        last_name: str(formData, "applicant_last_name"),
        date_of_birth: dob,
        email: nullableStr(formData, "applicant_email"),
        phone: nullableStr(formData, "applicant_phone"),
        street_address: nullableStr(formData, "applicant_street_address"),
        suburb: nullableStr(formData, "applicant_suburb"),
        town_city: nullableStr(formData, "applicant_town_city"),
        postcode: nullableStr(formData, "applicant_postcode"),
        occupation: nullableStr(formData, "applicant_occupation"),
        person_type: (nullableStr(formData, "applicant_person_type") ?? "other") as PersonType,
        is_driver: requiresDriving,
        is_account_holder: false,
      })
      .select("id")
      .single();

    if (personError) return { error: personError.message };
    applicantPersonId = created.id;
  }

  if (!applicantPersonId) return { error: "Applicant person is required." };

  const { data: applicant } = await supabase
    .from("people")
    .select("id, date_of_birth, is_driver")
    .eq("id", applicantPersonId)
    .eq("owner_user_id", user.id)
    .single();

  if (!applicant) return { error: "Applicant was not found on your account." };

  const requiresDriving = formData.get("requires_driving") === "on";
  const primaryDriverPersonId: string | null = requiresDriving ? applicantPersonId : null;

  if (requiresDriving) {
    await supabase.from("people").update({ is_driver: true }).eq("id", applicantPersonId);

    const driverPayload = {
      person_id: applicantPersonId,
      default_class_id: nullableStr(formData, "primary_class_id"),
      default_kart_number: nullableStr(formData, "kart_number"),
      default_race_number: nullableStr(formData, "race_number"),
      default_transponder_number: nullableStr(formData, "transponder_number"),
      default_club_id: nullableStr(formData, "issuing_club_id"),
      active: true,
    };

    const { data: existingProfile } = await supabase
      .from("driver_profiles")
      .select("id")
      .eq("person_id", applicantPersonId)
      .maybeSingle();

    if (existingProfile?.id) {
      await supabase.from("driver_profiles").update(driverPayload).eq("id", existingProfile.id);
    } else {
      await supabase.from("driver_profiles").insert(driverPayload);
    }

    const licencePayload = {
      person_id: applicantPersonId,
      licence_number: nullableStr(formData, "licence_number"),
      licence_type_id: nullableStr(formData, "licence_type_id"),
      licence_rating_id: nullableStr(formData, "licence_rating_id"),
      issuing_club_id: nullableStr(formData, "issuing_club_id"),
      licence_confirmed_green: formData.get("licence_confirmed_green") === "on",
    };

    const { data: existingLicence } = await supabase
      .from("driver_licences")
      .select("id")
      .eq("person_id", applicantPersonId)
      .limit(1)
      .maybeSingle();

    if (existingLicence?.id) {
      await supabase.from("driver_licences").update(licencePayload).eq("id", existingLicence.id);
    } else {
      await supabase.from("driver_licences").insert(licencePayload);
    }
  }

  if (applicant.date_of_birth && isJuniorPerson(applicant.date_of_birth) && requiresDriving) {
    const useHolder = formData.get("guardian_same_as_holder") === "on";
    let guardianPersonId = useHolder ? accountHolderPersonId : str(formData, "guardian_person_id");

    if (!guardianPersonId && !useHolder) {
      const guardianFirst = str(formData, "guardian_first_name");
      const guardianLast = str(formData, "guardian_last_name");
      if (!guardianFirst || !guardianLast) {
        return { error: "Guardian details are required for junior members." };
      }

      const { data: createdGuardian, error: guardianError } = await supabase
        .from("people")
        .insert({
          owner_user_id: user.id,
          first_name: guardianFirst,
          last_name: guardianLast,
          email: nullableStr(formData, "guardian_email"),
          phone: nullableStr(formData, "guardian_phone"),
          street_address: nullableStr(formData, "guardian_street_address"),
          occupation: nullableStr(formData, "guardian_occupation"),
          person_type: "parent_guardian",
          is_driver: false,
          is_account_holder: false,
        })
        .select("id")
        .single();

      if (guardianError) return { error: guardianError.message };
      guardianPersonId = createdGuardian.id;
    }

    if (!guardianPersonId) {
      return { error: "Guardian details are required for junior members." };
    }

    const relationshipPayload = {
      owner_user_id: user.id,
      from_person_id: guardianPersonId,
      to_person_id: applicantPersonId,
      relationship_type: (nullableStr(formData, "guardian_relationship_type") ?? "guardian") as RelationshipType,
      is_primary: true,
    };

    const { data: existingRel } = await supabase
      .from("person_relationships")
      .select("id")
      .eq("to_person_id", applicantPersonId)
      .eq("is_primary", true)
      .maybeSingle();

    if (existingRel?.id) {
      await supabase.from("person_relationships").update(relationshipPayload).eq("id", existingRel.id);
    } else {
      await supabase.from("person_relationships").insert(relationshipPayload);
    }
  }

  const familyFirst = nullableStr(formData, "primary_family_member_first_name");
  const familyLast = nullableStr(formData, "primary_family_member_last_name");
  if (intent === "additional_family_racing_member" && (!familyFirst || !familyLast)) {
    return { error: "Primary family member name is required for additional family memberships." };
  }

  const { data: allProducts, error: productsError } = await supabase
    .from("membership_products")
    .select("*")
    .eq("active", true);

  if (productsError) return { error: productsError.message };

  const allowedProducts = productsForIntent(intent, (allProducts ?? []) as MembershipProduct[]);
  const selectedProductId = str(formData, "selected_product_id");

  let amountDue = 0;
  const items: {
    product_id: string;
    product_name_snapshot: string;
    unit_price_snapshot: number;
    quantity: number;
    line_total: number;
  }[] = [];

  if (allowedProducts.length) {
    const product = allowedProducts.find((p) => p.id === selectedProductId) ?? allowedProducts[0];
    if (!product) return { error: "Please select a membership product." };
    const qty = Math.max(1, Number(formData.get("product_quantity") ?? 1));
    const lineTotal = Number(product.price) * qty;
    amountDue = lineTotal;
    items.push({
      product_id: product.id,
      product_name_snapshot: product.name,
      unit_price_snapshot: Number(product.price),
      quantity: qty,
      line_total: lineTotal,
    });
  }

  const paymentStatus = intent === "visiting_driver" || intent === "parent_guardian_only" ? "not_required" : "pending_external_payment";

  const { data: application, error: applicationError } = await supabase
    .from("membership_applications")
    .insert({
      user_id: user.id,
      applicant_person_id: applicantPersonId,
      primary_driver_person_id: primaryDriverPersonId,
      membership_intent: intent,
      season_label: str(formData, "season_label") || currentSeasonLabel(),
      primary_family_member_first_name: familyFirst,
      primary_family_member_last_name: familyLast,
      primary_class_id: nullableStr(formData, "primary_class_id"),
      secondary_class_id: nullableStr(formData, "secondary_class_id"),
      applicant_occupation: nullableStr(formData, "applicant_occupation") ?? nullableStr(formData, "holder_occupation"),
      volunteer_interest: nullableStr(formData, "volunteer_interest"),
      status: "submitted",
      payment_status: paymentStatus,
      amount_due: amountDue,
    })
    .select("id")
    .single();

  if (applicationError) return { error: applicationError.message };

  if (items.length) {
    const { error: itemsError } = await supabase.from("membership_application_items").insert(
      items.map((item) => ({ application_id: application.id, ...item })),
    );
    if (itemsError) return { error: itemsError.message };
  }

  const termsVersionId = str(formData, "terms_version_id");
  if (termsVersionId) {
    await supabase.from("accepted_terms").insert({
      user_id: user.id,
      person_id: applicantPersonId,
      terms_version_id: termsVersionId,
      related_table: "membership_applications",
      related_id: application.id,
    });
  }

  revalidatePath("/account");
  revalidatePath("/account/membership");
  revalidatePath("/account/people");
  revalidatePath("/account/onboarding");
  redirect("/account/membership?submitted=1");
}
