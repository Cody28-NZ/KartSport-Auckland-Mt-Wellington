import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { PersonForm } from "@/components/account/PersonForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { formatPersonType } from "@/lib/account/membership-intents";
import { getPersonWithDetails, getPeopleForCurrentUser } from "@/lib/data/people";
import { getOptionValues } from "@/lib/data/options";
import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, focusRing } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "People & Drivers | KartSport Auckland Mt Wellington",
  description: "Manage people and drivers linked to your KartSport Auckland Mt Wellington account.",
  noIndex: true,
});

interface PeoplePageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function PeoplePage({ searchParams }: PeoplePageProps) {
  if (!isSupabaseConfigured()) {
    return (
      <AccountShell currentPath="/account/people" title="People & Drivers">
        <SupabaseSetupNotice />
      </AccountShell>
    );
  }

  const { redirectTo } = await requireUser();
  if (redirectTo) redirect(redirectTo);

  const params = await searchParams;
  const [people, classOptions, licenceTypeOptions, licenceRatingOptions, clubOptions, editing] = await Promise.all([
    getPeopleForCurrentUser(),
    getOptionValues("kart_classes"),
    getOptionValues("ksnz_licence_types"),
    getOptionValues("ksnz_licence_ratings"),
    getOptionValues("clubs"),
    params.edit ? getPersonWithDetails(params.edit) : Promise.resolve(null),
  ]);

  const primaryGuardian = editing?.guardians.find((g) => g.relationship.is_primary) ?? editing?.guardians[0];

  return (
    <AccountShell
      currentPath="/account/people"
      title="People & Drivers"
      description="Manage family members, drivers, social/pit members and visiting drivers on this account."
    >
      <p className="text-sm text-ink-muted">
        People and drivers are usually created through a membership application. You can also manage or update them here.
      </p>
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-ink">{editing ? "Edit person" : "Add person"}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Add adults, juniors, parents/guardians, social or pit members, and visiting drivers. Driver and licence fields appear when someone drives on track.
          </p>
          <div className="mt-3">
            <PersonForm
              person={editing?.person}
              driverProfile={editing?.driverProfile}
              licence={editing?.licences[0]}
              guardianPerson={primaryGuardian?.person}
              classOptions={classOptions}
              licenceTypeOptions={licenceTypeOptions}
              licenceRatingOptions={licenceRatingOptions}
              clubOptions={clubOptions}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink">People on this account</h2>
          {people.length ? (
            <ul className="mt-3 space-y-2">
              {people.map((person) => (
                <li key={person.id} className={cn(cardBase, "flex items-center justify-between gap-4 p-4")}>
                  <div>
                    <p className="font-medium text-ink">
                      {person.first_name} {person.last_name}
                    </p>
                    <p className="text-sm text-ink-muted">
                      {formatPersonType(person.person_type)}
                      {person.is_driver ? " · Driver" : ""}
                      {person.date_of_birth ? ` · DOB ${person.date_of_birth}` : ""}
                    </p>
                  </div>
                  <Link href={`/account/people?edit=${person.id}`} className={cn("text-sm font-medium text-brand hover:text-brand-hover", focusRing)}>
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">No people added yet. Use the form above or start a membership application.</p>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
