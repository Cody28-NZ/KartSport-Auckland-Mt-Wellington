import { createClientIfConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import type {
  AcceptedTerms,
  MembershipApplication,
  MembershipApplicationItem,
  MembershipProduct,
  Person,
  TermsVersion,
} from "@/types/database";

export interface MembershipApplicationWithDetails {
  application: MembershipApplication;
  items: MembershipApplicationItem[];
  applicant: Person | null;
  managedBy: Person | null;
  acceptedTerms: AcceptedTerms | null;
}

export async function getMembershipProducts(): Promise<MembershipProduct[]> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("membership_products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as MembershipProduct[];
}

export async function getMembershipApplicationsForCurrentUser(): Promise<MembershipApplication[]> {
  const supabase = await createClientIfConfigured();
  const user = await getCurrentUser();
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from("membership_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as MembershipApplication[];
}

export async function getMembershipApplicationsWithDetailsForCurrentUser(): Promise<MembershipApplicationWithDetails[]> {
  const supabase = await createClientIfConfigured();
  const user = await getCurrentUser();
  if (!supabase || !user) return [];

  const [applicationsResult, peopleResult] = await Promise.all([
    supabase
      .from("membership_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false }),
    supabase.from("people").select("*").eq("owner_user_id", user.id),
  ]);

  if (applicationsResult.error) throw applicationsResult.error;
  if (peopleResult.error) throw peopleResult.error;

  const applications = (applicationsResult.data ?? []) as MembershipApplication[];
  const people = (peopleResult.data ?? []) as Person[];
  const peopleById = new Map(people.map((p) => [p.id, p]));

  const applicationIds = applications.map((a) => a.id);
  let items: MembershipApplicationItem[] = [];
  let acceptedTermsByApplicationId = new Map<string, AcceptedTerms>();
  if (applicationIds.length) {
    const [itemsResult, acceptedTermsResult] = await Promise.all([
      supabase.from("membership_application_items").select("*").in("application_id", applicationIds),
      supabase
        .from("accepted_terms")
        .select("*")
        .eq("user_id", user.id)
        .eq("related_application_table", "membership_applications")
        .in("related_application_id", applicationIds),
    ]);
    if (itemsResult.error) throw itemsResult.error;
    if (acceptedTermsResult.error) throw acceptedTermsResult.error;
    items = (itemsResult.data ?? []) as MembershipApplicationItem[];
    acceptedTermsByApplicationId = new Map(
      ((acceptedTermsResult.data ?? []) as AcceptedTerms[]).map((record) => [
        record.related_application_id ?? "",
        record,
      ]),
    );
  }

  const applicantIds = applications
    .map((a) => a.applicant_person_id)
    .filter((id): id is string => Boolean(id));

  const guardianByApplicantId = new Map<string, Person>();
  if (applicantIds.length) {
    const { data: relationships, error: relError } = await supabase
      .from("person_relationships")
      .select("to_person_id, from_person_id, is_primary")
      .eq("owner_user_id", user.id)
      .in("to_person_id", applicantIds)
      .eq("is_primary", true);
    if (relError) throw relError;

    for (const rel of relationships ?? []) {
      const guardian = peopleById.get(rel.from_person_id);
      if (guardian) guardianByApplicantId.set(rel.to_person_id, guardian);
    }
  }

  const accountHolder = people.find((p) => p.is_account_holder) ?? null;

  return applications.map((application) => {
    const applicant = application.applicant_person_id
      ? (peopleById.get(application.applicant_person_id) ?? null)
      : null;
    const managedBy =
      (application.applicant_person_id
        ? guardianByApplicantId.get(application.applicant_person_id)
        : null) ?? accountHolder;

    return {
      application,
      items: items.filter((item) => item.application_id === application.id),
      applicant,
      managedBy,
      acceptedTerms: acceptedTermsByApplicationId.get(application.id) ?? null,
    };
  });
}

export async function getActiveMembershipTerms(): Promise<TermsVersion | null> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("terms_versions")
    .select("*")
    .eq("context", "membership")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as TermsVersion | null;
}
