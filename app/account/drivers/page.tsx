import Link from "next/link";
import { redirect } from "next/navigation";
import { DriverForm, DriverFormLinkBack } from "@/components/account/DriverForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { Container } from "@/components/ui/Container";
import { getDriverWithDetails, getDriversForCurrentUser } from "@/lib/data/drivers";
import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, focusRing, sectionDefault, sectionHome, textLink } from "@/lib/cn";

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
      <section className={cn(sectionDefault, sectionHome)}>
        <Container className="max-w-2xl">
          <h1 className="text-2xl font-semibold text-ink">Drivers</h1>
          <div className="mt-6">
            <SupabaseSetupNotice />
          </div>
        </Container>
      </section>
    );
  }

  const { redirectTo } = await requireUser();
  if (redirectTo) redirect(redirectTo);

  const params = await searchParams;
  const drivers = await getDriversForCurrentUser();
  const editing = params.edit ? await getDriverWithDetails(params.edit) : null;

  return (
    <section className={cn(sectionDefault, sectionHome)}>
      <Container className="max-w-3xl">
        <DriverFormLinkBack />
        <h1 className="mt-4 text-2xl font-semibold text-ink sm:text-3xl">Manage drivers</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Parents and guardians can manage multiple drivers from one login.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-ink">{editing ? "Edit driver" : "Add driver"}</h2>
            <div className="mt-3">
              <DriverForm
                driver={editing?.driver}
                guardian={editing?.guardians.find((g) => g.is_primary) ?? editing?.guardians[0]}
                licenceNumber={editing?.licences[0]?.licence_number}
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
                      <p className="text-sm text-ink-muted">DOB: {driver.date_of_birth}</p>
                    </div>
                    <Link
                      href={`/account/drivers?edit=${driver.id}`}
                      className={cn(textLink, "text-sm", focusRing)}
                    >
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">No drivers saved yet.</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
