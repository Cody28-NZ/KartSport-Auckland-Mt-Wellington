"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { submitMembershipApplicationAction } from "@/app/account/membership/actions";
import { formatCurrency } from "@/lib/account/format";
import { isJuniorDriver } from "@/lib/drivers/utils";
import type { Driver, Guardian, MembershipProduct, OptionValue, Profile, TermsVersion } from "@/types/database";
import { cn, btnPrimary, cardBase, focusRing, tapTarget } from "@/lib/cn";
import {
  accountInputClass,
  accountLabelClass,
  accountSectionClass,
  accountSelectClass,
} from "@/components/account/formFields";

interface DriverOption {
  driver: Driver;
  guardian: Guardian | null;
}

interface MembershipApplicationFormProps {
  drivers: DriverOption[];
  products: MembershipProduct[];
  terms: TermsVersion | null;
  classOptions: OptionValue[];
  volunteerRoles: OptionValue[];
  profile: Profile | null;
  seasonLabel: string;
}

type FormState = { error?: string } | null;

async function formAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return submitMembershipApplicationAction(formData);
}

function OptionSelect({
  id,
  name,
  options,
  defaultValue,
  required,
  placeholder = "Select…",
}: {
  id: string;
  name: string;
  options: OptionValue[];
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <select id={id} name={name} required={required} defaultValue={defaultValue ?? ""} className={accountSelectClass}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function MembershipApplicationForm({
  drivers,
  products,
  terms,
  classOptions,
  volunteerRoles,
  profile,
  seasonLabel,
}: MembershipApplicationFormProps) {
  const [state, action, pending] = useActionState(formAction, null);
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.driver.id ?? "");
  const [isFamily, setIsFamily] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const selectedDriver = useMemo(
    () => drivers.find((item) => item.driver.id === selectedDriverId) ?? null,
    [drivers, selectedDriverId],
  );

  const total = useMemo(() => {
    return products.reduce((sum, product) => {
      const qty = quantities[product.id] ?? 0;
      return sum + Number(product.price) * qty;
    }, 0);
  }, [products, quantities]);

  if (!drivers.length) {
    return (
      <div className={cn(cardBase, "p-6 text-center")}>
        <p className="text-sm text-ink-muted">Add a driver before submitting a membership application.</p>
        <Link href="/account/drivers" className={cn("mt-4 inline-block text-sm font-medium text-brand hover:text-brand-hover", focusRing)}>
          Add a driver &rarr;
        </Link>
      </div>
    );
  }

  const junior = selectedDriver ? isJuniorDriver(selectedDriver.driver.date_of_birth) : false;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="season_label" value={seasonLabel} />
      {terms ? <input type="hidden" name="terms_version_id" value={terms.id} /> : null}

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Applicant / driver</h2>
        <div className="mt-4">
          <label htmlFor="driver_id" className={accountLabelClass}>
            Select driver
          </label>
          <select
            id="driver_id"
            name="driver_id"
            required
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className={accountSelectClass}
          >
            {drivers.map(({ driver }) => (
              <option key={driver.id} value={driver.id}>
                {driver.first_name} {driver.last_name}
              </option>
            ))}
          </select>
        </div>

        {selectedDriver ? (
          <div className="mt-4 rounded-lg border border-border bg-white p-4 text-sm">
            <p className="font-medium text-ink">
              {selectedDriver.driver.first_name} {selectedDriver.driver.last_name}
            </p>
            <p className="mt-1 text-ink-muted">Date of birth: {selectedDriver.driver.date_of_birth}</p>
            {selectedDriver.driver.email ? <p className="text-ink-muted">{selectedDriver.driver.email}</p> : null}
            {junior ? (
              <div className="mt-3 border-t border-border pt-3">
                <p className="font-medium text-ink">Guardian</p>
                {selectedDriver.guardian ? (
                  <p className="mt-1 text-ink-muted">
                    {selectedDriver.guardian.first_name} {selectedDriver.guardian.last_name}
                    {selectedDriver.guardian.relationship ? ` (${selectedDriver.guardian.relationship})` : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-amber-800">
                    Guardian details required.{" "}
                    <Link href={`/account/drivers?edit=${selectedDriver.driver.id}`} className="font-medium text-brand hover:text-brand-hover">
                      Update driver
                    </Link>
                  </p>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Family membership</h2>
        <label className="mt-4 flex items-start gap-2 text-sm text-ink">
          <input type="checkbox" name="is_family_membership" checked={isFamily} onChange={(e) => setIsFamily(e.target.checked)} className="mt-0.5" />
          Is this an additional family membership?
        </label>
        {isFamily ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="primary_family_member_first_name" className={accountLabelClass}>
                Primary family member first name
              </label>
              <input id="primary_family_member_first_name" name="primary_family_member_first_name" required className={accountInputClass} />
            </div>
            <div>
              <label htmlFor="primary_family_member_last_name" className={accountLabelClass}>
                Primary family member last name
              </label>
              <input id="primary_family_member_last_name" name="primary_family_member_last_name" required className={accountInputClass} />
            </div>
          </div>
        ) : null}
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Class</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="primary_class_id" className={accountLabelClass}>
              Primary class driven
            </label>
            <OptionSelect id="primary_class_id" name="primary_class_id" options={classOptions} required />
          </div>
          <div>
            <label htmlFor="secondary_class_id" className={accountLabelClass}>
              Secondary class driven <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <OptionSelect id="secondary_class_id" name="secondary_class_id" options={classOptions} />
          </div>
        </div>
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Volunteers</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="applicant_occupation" className={accountLabelClass}>
              Applicant occupation
            </label>
            <input
              id="applicant_occupation"
              name="applicant_occupation"
              defaultValue={profile?.occupation ?? ""}
              className={accountInputClass}
            />
          </div>
          <div>
            <label htmlFor="volunteer_interest" className={accountLabelClass}>
              Volunteer interest
            </label>
            <input
              id="volunteer_interest"
              name="volunteer_interest"
              list={volunteerRoles.length ? "volunteer-role-suggestions" : undefined}
              className={accountInputClass}
              placeholder="e.g. Flag marshal, grid"
            />
            {volunteerRoles.length ? (
              <datalist id="volunteer-role-suggestions">
                {volunteerRoles.map((role) => (
                  <option key={role.id} value={role.label} />
                ))}
              </datalist>
            ) : null}
          </div>
        </div>
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Membership products</h2>
        <p className="mt-1 text-sm text-ink-muted">Select quantities for each product. Payment is handled separately by the club.</p>
        <ul className="mt-4 space-y-3">
          {products.map((product) => {
            const qty = quantities[product.id] ?? 0;
            return (
              <li key={product.id} className="flex flex-col gap-3 rounded-lg border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-ink">{product.name}</p>
                  {product.description ? <p className="text-sm text-ink-muted">{product.description}</p> : null}
                  <p className="mt-1 text-sm font-medium text-ink">{formatCurrency(Number(product.price))}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor={`qty-${product.id}`} className="sr-only">
                    Quantity for {product.name}
                  </label>
                  <input type="hidden" name={`product_qty_${product.id}`} value={qty} />
                  <button
                    type="button"
                    onClick={() => setQuantities((prev) => ({ ...prev, [product.id]: Math.max(0, (prev[product.id] ?? 0) - 1) }))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink hover:bg-surface-alt"
                    aria-label={`Decrease ${product.name}`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQuantities((prev) => ({ ...prev, [product.id]: (prev[product.id] ?? 0) + 1 }))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink hover:bg-surface-alt"
                    aria-label={`Increase ${product.name}`}
                  >
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-right text-base font-semibold text-ink">Total: {formatCurrency(total)}</p>
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Terms</h2>
        {terms ? (
          <div className="mt-4 max-h-48 overflow-y-auto rounded-lg border border-border bg-white p-4 text-sm text-ink-muted">
            <p className="font-medium text-ink">{terms.title}</p>
            <p className="mt-2 whitespace-pre-wrap">{terms.body}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-muted">
            Membership terms and conditions will be confirmed by the club. By submitting this application you agree to abide by club rules and KartSport NZ regulations.
          </p>
        )}
        <label className="mt-4 flex items-start gap-2 text-sm text-ink">
          <input type="checkbox" name="terms_accepted" required className="mt-0.5" />
          I accept the membership terms and conditions.
        </label>
      </div>

      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending || (junior && !selectedDriver?.guardian)}
        className={cn(btnPrimary, focusRing, tapTarget, "rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60")}
      >
        {pending ? "Submitting..." : "Submit membership application"}
      </button>
    </form>
  );
}
