"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentSeasonLabel } from "@/lib/account/format";
import { isJuniorDriver } from "@/lib/drivers/utils";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { MembershipProduct } from "@/types/database";

export async function submitMembershipApplicationAction(formData: FormData) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/membership/new");

  const driverId = String(formData.get("driver_id") ?? "").trim();
  const termsAccepted = formData.get("terms_accepted") === "on";

  if (!driverId) return { error: "Please select a driver." };
  if (!termsAccepted) return { error: "You must accept the membership terms and conditions." };

  const { data: driver, error: driverError } = await supabase
    .from("drivers")
    .select("id, date_of_birth")
    .eq("id", driverId)
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (driverError) return { error: driverError.message };
  if (!driver) return { error: "Selected driver was not found." };

  const junior = isJuniorDriver(driver.date_of_birth);
  if (junior) {
    const { data: guardian } = await supabase
      .from("guardians")
      .select("id")
      .eq("driver_id", driverId)
      .eq("is_primary", true)
      .maybeSingle();

    if (!guardian) {
      return { error: "Guardian details are required for drivers under 18. Please update the driver profile first." };
    }
  }

  const isFamily = formData.get("is_family_membership") === "on";
  const familyFirstName = isFamily ? String(formData.get("primary_family_member_first_name") ?? "").trim() : "";
  const familyLastName = isFamily ? String(formData.get("primary_family_member_last_name") ?? "").trim() : "";

  if (isFamily && (!familyFirstName || !familyLastName)) {
    return { error: "Primary family member name is required for additional family memberships." };
  }

  const { data: products, error: productsError } = await supabase
    .from("membership_products")
    .select("*")
    .eq("active", true);

  if (productsError) return { error: productsError.message };

  let amountDue = 0;
  const items: {
    product_id: string;
    product_name_snapshot: string;
    unit_price_snapshot: number;
    quantity: number;
    line_total: number;
  }[] = [];

  for (const product of (products ?? []) as MembershipProduct[]) {
    const qty = Number(formData.get(`product_qty_${product.id}`) ?? 0);
    if (qty > 0) {
      const lineTotal = Number(product.price) * qty;
      amountDue += lineTotal;
      items.push({
        product_id: product.id,
        product_name_snapshot: product.name,
        unit_price_snapshot: Number(product.price),
        quantity: qty,
        line_total: lineTotal,
      });
    }
  }

  if (!items.length) return { error: "Please select at least one membership product." };

  const termsVersionId = String(formData.get("terms_version_id") ?? "").trim();

  const { data: application, error: applicationError } = await supabase
    .from("membership_applications")
    .insert({
      user_id: user.id,
      driver_id: driverId,
      season_label: String(formData.get("season_label") ?? currentSeasonLabel()),
      is_junior: junior,
      primary_family_member_first_name: isFamily ? familyFirstName : null,
      primary_family_member_last_name: isFamily ? familyLastName : null,
      primary_class_id: String(formData.get("primary_class_id") ?? "").trim() || null,
      secondary_class_id: String(formData.get("secondary_class_id") ?? "").trim() || null,
      applicant_occupation: String(formData.get("applicant_occupation") ?? "").trim() || null,
      volunteer_interest: String(formData.get("volunteer_interest") ?? "").trim() || null,
      status: "submitted",
      payment_status: "pending_external_payment",
      amount_due: amountDue,
    })
    .select("id")
    .single();

  if (applicationError) return { error: applicationError.message };

  const itemRows = items.map((item) => ({
    application_id: application.id,
    ...item,
  }));

  const { error: itemsError } = await supabase.from("membership_application_items").insert(itemRows);
  if (itemsError) return { error: itemsError.message };

  if (termsVersionId) {
    const { error: termsError } = await supabase.from("accepted_terms").insert({
      user_id: user.id,
      driver_id: driverId,
      terms_version_id: termsVersionId,
      related_table: "membership_applications",
      related_id: application.id,
    });

    if (termsError) return { error: termsError.message };
  }

  revalidatePath("/account");
  revalidatePath("/account/membership");
  revalidatePath("/account/onboarding");
  redirect("/account/membership?submitted=1");
}
