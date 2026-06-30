import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { DriverForm } from "@/components/account/DriverForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { getDriverWithDetails, getDriversForCurrentUser } from "@/lib/data/drivers";
import { getOptionValues } from "@/lib/data/options";
import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, focusRing } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Manage drivers | KartSport Auckland Mt Wellington",
  description: "Manage drivers linked to your KartSport Auckland Mt Wellington account.",
  noIndex: true,
});

interface DriversPageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function DriversPage({ searchParams }: DriversPageProps) {
  if (!isSupabaseConfigured()) {
    return (
      <AccountShell currentPath="/account/drivers" title="Drivers">
        <SupabaseSetupNotice />
      </AccountShell>
    );
  }

  const { redirectTo } = await requireUser();
  if (redirectTo) redirect(redirectTo);

  const params = await searchParams;
  const [drivers, classOptions, licenceTypeOptions, licenceRatingOptions, clubOptions, editing] = await Promise.all([
    getDriversForCurrentUser(),
    getOptionValues("kart_classes"),
    getOptionValues("ksnz_licence_types"),
    getOptionValues("ksnz_licence_ratings"),
    getOptionValues("clubs"),
    params.edit ? getDriverWithDetails(params.edit) : Promise.resolve(null),
  ]);

  return (
    <AccountShell
      currentPath="/account/drivers"
      title="Drivers"
      description="Parents and guardians can manage multiple drivers from one account."
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-ink">{editing ? "Edit driver" : "Add driver"}</h2>
          <div className="mt-3">
            <DriverForm
              driver={editing?.driver}
              guardian={editing?.guardians.find((g) => g.is_primary) ?? editing?.guardians[0]}
              licence={editing?.licences[0]}
              classOptions={classOptions}
              licenceTypeOptions={licenceTypeOptions}
              licenceRatingOptions={licenceRatingOptions}
              clubOptions={clubOptions}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink">Saved drivers</h2>
          {drivers.length ? (
            <ul className="mt-3 space-y-2">
              {drivers.map((driver) => (
                <li key={driver.id} className={cn(cardBase, "flex items-center justify-between gap-4 p-4")}>
                  <div>
                    <p className="font-medium text-ink">
                      {driver.first_name} {driver.last_name}
                    </p>
                    <p className="text-sm text-ink-muted">Born {driver.date_of_birth}</p>
                  </div>
                  <Link
                    href={`/account/drivers?edit=${driver.id}`}
                    className={cn("text-sm font-medium text-brand hover:text-brand-hover", focusRing)}
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">No drivers saved yet. Use the form above to add your first driver.</p>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
