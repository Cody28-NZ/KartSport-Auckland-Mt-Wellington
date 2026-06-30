"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  applicantPersonTypeForPath,
  formatMembershipIntent,
  formatRegistrationPath,
  productsForIntent,
  productsForRegistrationPath,
  registrationPathRequiresGuardian,
  resolveMembershipIntent,
  type RegistrationPath,
} from "@/lib/account/membership-intents";
import { currentSeasonLabel } from "@/lib/account/format";
import {
  ACCOUNT_HOLDER_GUARDIAN_INCOMPLETE_MESSAGE,
  MANUAL_GUARDIAN_INCOMPLETE_MESSAGE,
  isAccountHolderGuardianComplete,
  isManualGuardianComplete,
  readAccountHolderGuardianFromFormData,
  readManualGuardianFromFormData,
} from "@/lib/account/guardian-validation";
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

function applicantAddressFromForm(formData: FormData) {
  const sameAsHolder = formData.get("applicant_address_same_as_holder") === "on";
  if (sameAsHolder) {
    return {
      street_address: nullableStr(formData, "holder_street_address"),
      suburb: nullableStr(formData, "holder_suburb"),
      town_city: nullableStr(formData, "holder_town_city"),
      postcode: nullableStr(formData, "holder_postcode"),
    };
  }
  return {
    street_address: nullableStr(formData, "applicant_street_address"),
    suburb: nullableStr(formData, "applicant_suburb"),
    town_city: nullableStr(formData, "applicant_town_city"),
    postcode: nullableStr(formData, "applicant_postcode"),
  };
}

export async function submitMembershipApplicationAction(formData: FormData) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/membership/new");

  const registrationPath = str(formData, "registration_path") as RegistrationPath;
  const termsAccepted = formData.get("terms_accepted") === "on";

  if (!registrationPath) return { error: "Please choose who you are registering." };
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

  const isJuniorPath = registrationPath === "junior_driver";
  if (accountHolderPersonId && isJuniorPath) {
    await supabase
      .from("people")
      .update({ person_type: "parent_guardian", is_driver: false })
      .eq("id", accountHolderPersonId);
  }

  let applicantPersonId = str(formData, "applicant_person_id");
  let sameAsAccountHolder = formData.get("applicant_same_as_holder") === "on";
  if (isJuniorPath) sameAsAccountHolder = false;

  const applicantAddress = applicantAddressFromForm(formData);
  const requiresDriving = formData.get("requires_driving") === "on";
  const dob = nullableStr(formData, "applicant_date_of_birth");

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
        person_type: "adult_driver",
        is_driver: requiresDriving,
      })
      .eq("id", accountHolderPersonId);
  } else if (!applicantPersonId) {
    const { data: allProducts } = await supabase.from("membership_products").select("*").eq("active", true);
    const pathProducts = productsForRegistrationPath(registrationPath, (allProducts ?? []) as MembershipProduct[]);
    const selectedProductId = str(formData, "selected_product_id");
    const selectedProduct = pathProducts.find((p) => p.id === selectedProductId) ?? pathProducts[0] ?? null;
    const intent = resolveMembershipIntent(registrationPath, selectedProduct);
    const personType = (
      nullableStr(formData, "applicant_person_type") ??
      applicantPersonTypeForPath(registrationPath, dob, intent)
    ) as PersonType;

    const { data: created, error: personError } = await supabase
      .from("people")
      .insert({
        owner_user_id: user.id,
        first_name: str(formData, "applicant_first_name"),
        last_name: str(formData, "applicant_last_name"),
        date_of_birth: dob,
        email: nullableStr(formData, "applicant_email"),
        phone: nullableStr(formData, "applicant_phone"),
        street_address: applicantAddress.street_address,
        suburb: applicantAddress.suburb,
        town_city: applicantAddress.town_city,
        postcode: applicantAddress.postcode,
        occupation: nullableStr(formData, "applicant_occupation"),
        person_type: personType,
        is_driver: requiresDriving,
        is_account_holder: false,
      })
      .select("id")
      .single();

    if (personError) return { error: personError.message };
    applicantPersonId = created.id;
  } else {
    await supabase
      .from("people")
      .update({
        date_of_birth: dob,
        ...applicantAddress,
        is_driver: requiresDriving,
        person_type: nullableStr(formData, "applicant_person_type") as PersonType,
      })
      .eq("id", applicantPersonId)
      .eq("owner_user_id", user.id);
  }

  if (!applicantPersonId) return { error: "Applicant person is required." };

  const { data: applicant } = await supabase
    .from("people")
    .select("id, date_of_birth, is_driver, person_type")
    .eq("id", applicantPersonId)
    .eq("owner_user_id", user.id)
    .single();

  if (!applicant) return { error: "Applicant was not found on your account." };

  const primaryDriverPersonId: string | null = requiresDriving ? applicantPersonId : null;

  if (requiresDriving) {
    await supabase.from("people").update({ is_driver: true }).eq("id", applicantPersonId);

    const driverPayload = {
      person_id: applicantPersonId,
      default_class_id: nullableStr(formData, "primary_class_id"),
      default_kart_number: nullableStr(formData, "kart_number"),
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

  const needsGuardian =
    registrationPathRequiresGuardian(registrationPath, applicant.date_of_birth) ||
    (applicant.date_of_birth && isJuniorPerson(applicant.date_of_birth) && requiresDriving);

  if (needsGuardian && requiresDriving) {
    const useHolder = formData.get("guardian_same_as_holder") === "on";
    const holderEmail = user.email ?? "";
    let guardianPersonId: string | null = null;

    if (useHolder) {
      const holderFields = readAccountHolderGuardianFromFormData(formData, holderEmail);
      if (!isAccountHolderGuardianComplete(holderFields)) {
        return { error: ACCOUNT_HOLDER_GUARDIAN_INCOMPLETE_MESSAGE };
      }

      const personPayload = {
        first_name: holderFields.firstName,
        last_name: holderFields.lastName,
        email: holderFields.email,
        phone: holderFields.phone,
        street_address: nullableStr(formData, "holder_street_address"),
        suburb: nullableStr(formData, "holder_suburb"),
        town_city: nullableStr(formData, "holder_town_city"),
        postcode: nullableStr(formData, "holder_postcode"),
        occupation: nullableStr(formData, "holder_occupation"),
        person_type: "parent_guardian" as PersonType,
        is_driver: false,
        is_account_holder: true,
      };

      if (accountHolderPersonId) {
        await supabase.from("people").update(personPayload).eq("id", accountHolderPersonId);
        guardianPersonId = accountHolderPersonId;
      } else {
        const { data: createdHolder, error: holderError } = await supabase
          .from("people")
          .insert({
            owner_user_id: user.id,
            ...personPayload,
          })
          .select("id")
          .single();

        if (holderError) return { error: holderError.message };
        guardianPersonId = createdHolder.id;
      }
    } else {
      const manualGuardian = readManualGuardianFromFormData(formData);
      if (!isManualGuardianComplete(manualGuardian)) {
        return { error: MANUAL_GUARDIAN_INCOMPLETE_MESSAGE };
      }

      guardianPersonId = str(formData, "guardian_person_id") || null;

      if (!guardianPersonId) {
        const { data: createdGuardian, error: guardianError } = await supabase
          .from("people")
          .insert({
            owner_user_id: user.id,
            first_name: manualGuardian.firstName,
            last_name: manualGuardian.lastName,
            email: manualGuardian.email,
            phone: manualGuardian.phone,
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
    }

    if (!guardianPersonId) {
      return { error: ACCOUNT_HOLDER_GUARDIAN_INCOMPLETE_MESSAGE };
    }

    const relationshipPayload = {
      owner_user_id: user.id,
      from_person_id: guardianPersonId,
      to_person_id: applicantPersonId,
      relationship_type: (nullableStr(formData, "guardian_relationship_type") ?? "parent") as RelationshipType,
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
  if (registrationPath === "additional_family_driver" && (!familyFirst || !familyLast)) {
    return { error: "Primary family member name is required for additional family memberships." };
  }

  const { data: allProducts, error: productsError } = await supabase
    .from("membership_products")
    .select("*")
    .eq("active", true);

  if (productsError) return { error: productsError.message };

  const selectedProductId = str(formData, "selected_product_id");
  const pathProducts = productsForRegistrationPath(registrationPath, (allProducts ?? []) as MembershipProduct[]);
  const selectedProduct = pathProducts.find((p) => p.id === selectedProductId) ?? pathProducts[0] ?? null;
  const intent = resolveMembershipIntent(registrationPath, selectedProduct) as MembershipIntent;

  const allowedProducts = productsForIntent(intent, (allProducts ?? []) as MembershipProduct[]);

  let amountDue = 0;
  const items: {
    product_id: string;
    product_name_snapshot: string;
    unit_price_snapshot: number;
    quantity: number;
    line_total: number;
  }[] = [];

  if (allowedProducts.length && selectedProduct) {
    const product = allowedProducts.find((p) => p.id === selectedProduct.id) ?? selectedProduct;
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
  } else if (allowedProducts.length && registrationPath !== "visiting_driver") {
    return { error: "Please select a membership product." };
  }

  const paymentStatus =
    intent === "visiting_driver" || intent === "parent_guardian_only" || amountDue === 0
      ? "not_required"
      : "pending_external_payment";

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

  const { data: activeTerms, error: termsError } = await supabase
    .from("terms_versions")
    .select("*")
    .eq("context", "membership")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (termsError) return { error: termsError.message };
  if (!activeTerms) return { error: "Membership terms have not been configured yet." };

  const { data: applicantPerson } = await supabase
    .from("people")
    .select("first_name, last_name")
    .eq("id", applicantPersonId)
    .single();

  const acceptedByName =
    [str(formData, "holder_first_name"), str(formData, "holder_last_name")].filter(Boolean).join(" ").trim() ||
    "Account holder";
  const applicantName = applicantPerson
    ? [applicantPerson.first_name, applicantPerson.last_name].filter(Boolean).join(" ").trim()
    : "Applicant";
  const applicationTypeSnapshot =
    formatRegistrationPath(registrationPath) || formatMembershipIntent(intent);

  const { error: acceptedTermsError } = await supabase.from("accepted_terms").insert({
    user_id: user.id,
    person_id: applicantPersonId,
    terms_version_id: activeTerms.id,
    terms_context_snapshot: activeTerms.context,
    terms_version_label_snapshot: activeTerms.version_label,
    terms_title_snapshot: activeTerms.title,
    terms_body_snapshot: activeTerms.body,
    accepted_by_name_snapshot: acceptedByName,
    applicant_name_snapshot: applicantName || "Applicant",
    application_type_snapshot: applicationTypeSnapshot,
    related_application_id: application.id,
    related_application_table: "membership_applications",
  });

  if (acceptedTermsError) return { error: acceptedTermsError.message };

  // TODO: notifyMembershipApplicationSubmitted(application.id) — email club secretary/admin (not built yet)

  revalidatePath("/account");
  revalidatePath("/account/membership");
  revalidatePath("/account/people");
  revalidatePath("/account/onboarding");
  redirect("/account/membership?submitted=1");
}
