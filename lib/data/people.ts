import { createClientIfConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { DriverLicence, DriverProfile, Person, PersonRelationship } from "@/types/database";

export async function getPeopleForCurrentUser(): Promise<Person[]> {
  const supabase = await createClientIfConfigured();
  const user = await getCurrentUser();
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("owner_user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Person[];
}

export async function getAccountHolderPerson(): Promise<Person | null> {
  const supabase = await createClientIfConfigured();
  const user = await getCurrentUser();
  if (!supabase || !user) return null;

  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("owner_user_id", user.id)
    .eq("is_account_holder", true)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as Person | null;
}

export async function getPersonWithDetails(personId: string) {
  const supabase = await createClientIfConfigured();
  const user = await getCurrentUser();
  if (!supabase || !user) return null;

  const { data: person, error: personError } = await supabase
    .from("people")
    .select("*")
    .eq("id", personId)
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (personError) throw personError;
  if (!person) return null;

  const [{ data: driverProfile }, { data: licences }, { data: relationshipsTo }] = await Promise.all([
    supabase.from("driver_profiles").select("*").eq("person_id", personId).maybeSingle(),
    supabase.from("driver_licences").select("*").eq("person_id", personId),
    supabase
      .from("person_relationships")
      .select("*")
      .eq("to_person_id", personId)
      .eq("owner_user_id", user.id),
  ]);

  const relationshipRows = (relationshipsTo ?? []) as PersonRelationship[];
  let guardians: { person: Person; relationship: PersonRelationship }[] = [];

  if (relationshipRows.length) {
    const fromIds = relationshipRows.map((row) => row.from_person_id);
    const { data: guardianPeople } = await supabase.from("people").select("*").in("id", fromIds);
    const peopleById = new Map(((guardianPeople ?? []) as Person[]).map((p) => [p.id, p]));
    guardians = relationshipRows
      .map((relationship) => {
        const guardianPerson = peopleById.get(relationship.from_person_id);
        return guardianPerson ? { person: guardianPerson, relationship } : null;
      })
      .filter(Boolean) as { person: Person; relationship: PersonRelationship }[];
  }

  return {
    person: person as Person,
    driverProfile: (driverProfile ?? null) as DriverProfile | null,
    licences: (licences ?? []) as DriverLicence[],
    guardians,
  };
}

export async function getPrimaryGuardianForPerson(personId: string): Promise<Person | null> {
  const details = await getPersonWithDetails(personId);
  if (!details?.guardians.length) return null;
  const primary = details.guardians.find((g) => g.relationship.is_primary) ?? details.guardians[0];
  return primary.person;
}
