"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveDriverAction } from "@/app/account/drivers/actions";
import { isJuniorDriver } from "@/lib/drivers/utils";
import type { DriverLicence, Guardian, OptionValue } from "@/types/database";
import { cn, btnPrimary, cardBase, focusRing, tapTarget } from "@/lib/cn";
import {
  accountInputClass,
  accountLabelClass,
  accountSectionClass,
  accountSelectClass,
} from "@/components/account/formFields";

interface DriverFormProps {
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    email: string | null;
    phone: string | null;
    street_address: string | null;
    suburb: string | null;
    town_city: string | null;
    postcode: string | null;
    default_class_id: string | null;
    default_kart_number: string | null;
    default_race_number: string | null;
    default_transponder_number: string | null;
  };
  guardian?: Guardian | null;
  licence?: DriverLicence | null;
  classOptions: OptionValue[];
  licenceTypeOptions: OptionValue[];
  licenceRatingOptions: OptionValue[];
  clubOptions: OptionValue[];
}

type DriverFormState = { error?: string; success?: boolean } | null;

async function driverFormAction(_prev: DriverFormState, formData: FormData): Promise<DriverFormState> {
  return saveDriverAction(formData);
}

function OptionSelect({
  id,
  name,
  options,
  defaultValue,
  placeholder = "Select…",
}: {
  id: string;
  name: string;
  options: OptionValue[];
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <select id={id} name={name} defaultValue={defaultValue ?? ""} className={accountSelectClass}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function DriverForm({
  driver,
  guardian,
  licence,
  classOptions,
  licenceTypeOptions,
  licenceRatingOptions,
  clubOptions,
}: DriverFormProps) {
  const [state, formAction, pending] = useActionState(driverFormAction, null);
  const [dob, setDob] = useState(driver?.date_of_birth ?? "");
  const showGuardian = dob ? isJuniorDriver(dob) : true;

  return (
    <form action={formAction} className={cn(cardBase, "space-y-6 p-5 sm:p-6")}>
      {driver?.id ? <input type="hidden" name="driver_id" value={driver.id} /> : null}

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Driver details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={accountLabelClass} htmlFor={`first_name-${driver?.id ?? "new"}`}>
              First name
            </label>
            <input
              id={`first_name-${driver?.id ?? "new"}`}
              name="first_name"
              required
              defaultValue={driver?.first_name ?? ""}
              className={accountInputClass}
            />
          </div>
          <div>
            <label className={accountLabelClass} htmlFor={`last_name-${driver?.id ?? "new"}`}>
              Last name
            </label>
            <input
              id={`last_name-${driver?.id ?? "new"}`}
              name="last_name"
              required
              defaultValue={driver?.last_name ?? ""}
              className={accountInputClass}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={accountLabelClass} htmlFor={`dob-${driver?.id ?? "new"}`}>
              Date of birth
            </label>
            <input
              id={`dob-${driver?.id ?? "new"}`}
              name="date_of_birth"
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={accountInputClass}
            />
          </div>
          <div>
            <label className={accountLabelClass} htmlFor={`phone-${driver?.id ?? "new"}`}>
              Phone
            </label>
            <input
              id={`phone-${driver?.id ?? "new"}`}
              name="phone"
              type="tel"
              defaultValue={driver?.phone ?? ""}
              className={accountInputClass}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={accountLabelClass} htmlFor={`email-${driver?.id ?? "new"}`}>
            Email
          </label>
          <input
            id={`email-${driver?.id ?? "new"}`}
            name="email"
            type="email"
            defaultValue={driver?.email ?? ""}
            className={accountInputClass}
          />
        </div>
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Address</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className={accountLabelClass} htmlFor={`street-${driver?.id ?? "new"}`}>
              Street address
            </label>
            <input
              id={`street-${driver?.id ?? "new"}`}
              name="street_address"
              defaultValue={driver?.street_address ?? ""}
              className={accountInputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={accountLabelClass} htmlFor={`suburb-${driver?.id ?? "new"}`}>
                Suburb
              </label>
              <input
                id={`suburb-${driver?.id ?? "new"}`}
                name="suburb"
                defaultValue={driver?.suburb ?? ""}
                className={accountInputClass}
              />
            </div>
            <div>
              <label className={accountLabelClass} htmlFor={`town-${driver?.id ?? "new"}`}>
                Town / city
              </label>
              <input
                id={`town-${driver?.id ?? "new"}`}
                name="town_city"
                defaultValue={driver?.town_city ?? ""}
                className={accountInputClass}
              />
            </div>
          </div>
          <div className="sm:w-1/3">
            <label className={accountLabelClass} htmlFor={`postcode-${driver?.id ?? "new"}`}>
              Postcode
            </label>
            <input
              id={`postcode-${driver?.id ?? "new"}`}
              name="postcode"
              defaultValue={driver?.postcode ?? ""}
              className={accountInputClass}
            />
          </div>
        </div>
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Kart details</h2>
        <div className="mt-4">
          <label className={accountLabelClass} htmlFor={`class-${driver?.id ?? "new"}`}>
            Default kart class
          </label>
          <OptionSelect
            id={`class-${driver?.id ?? "new"}`}
            name="default_class_id"
            options={classOptions}
            defaultValue={driver?.default_class_id}
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={accountLabelClass} htmlFor={`kart-${driver?.id ?? "new"}`}>
              Kart number
            </label>
            <input
              id={`kart-${driver?.id ?? "new"}`}
              name="kart_number"
              defaultValue={driver?.default_kart_number ?? ""}
              className={accountInputClass}
            />
          </div>
          <div>
            <label className={accountLabelClass} htmlFor={`race-${driver?.id ?? "new"}`}>
              Race number
            </label>
            <input
              id={`race-${driver?.id ?? "new"}`}
              name="race_number"
              defaultValue={driver?.default_race_number ?? ""}
              className={accountInputClass}
            />
          </div>
          <div>
            <label className={accountLabelClass} htmlFor={`transponder-${driver?.id ?? "new"}`}>
              Transponder number
            </label>
            <input
              id={`transponder-${driver?.id ?? "new"}`}
              name="transponder_number"
              defaultValue={driver?.default_transponder_number ?? ""}
              className={accountInputClass}
            />
          </div>
        </div>
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Licence</h2>
        <div className="mt-4">
          <label className={accountLabelClass} htmlFor={`licence-${driver?.id ?? "new"}`}>
            KSNZ licence number
          </label>
          <input
            id={`licence-${driver?.id ?? "new"}`}
            name="licence_number"
            defaultValue={licence?.licence_number ?? ""}
            className={accountInputClass}
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={accountLabelClass} htmlFor={`licence-type-${driver?.id ?? "new"}`}>
              KSNZ licence type
            </label>
            <OptionSelect
              id={`licence-type-${driver?.id ?? "new"}`}
              name="licence_type_id"
              options={licenceTypeOptions}
              defaultValue={licence?.licence_type_id}
            />
          </div>
          <div>
            <label className={accountLabelClass} htmlFor={`licence-rating-${driver?.id ?? "new"}`}>
              KSNZ licence rating
            </label>
            <OptionSelect
              id={`licence-rating-${driver?.id ?? "new"}`}
              name="licence_rating_id"
              options={licenceRatingOptions}
              defaultValue={licence?.licence_rating_id}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={accountLabelClass} htmlFor={`club-${driver?.id ?? "new"}`}>
            Club
          </label>
          <OptionSelect
            id={`club-${driver?.id ?? "new"}`}
            name="issuing_club_id"
            options={clubOptions}
            defaultValue={licence?.issuing_club_id}
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="licence_confirmed_green" defaultChecked={licence?.licence_confirmed_green ?? false} />
          Licence confirmed green
        </label>
      </div>

      {showGuardian ? (
        <div className={accountSectionClass}>
          <h2 className="text-base font-semibold text-ink">Guardian</h2>
          <p className="mt-1 text-sm text-ink-muted">Required if the driver is under 18.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={accountLabelClass}>Guardian first name</label>
              <input name="guardian_first_name" defaultValue={guardian?.first_name ?? ""} className={accountInputClass} />
            </div>
            <div>
              <label className={accountLabelClass}>Guardian last name</label>
              <input name="guardian_last_name" defaultValue={guardian?.last_name ?? ""} className={accountInputClass} />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={accountLabelClass}>Guardian email</label>
              <input name="guardian_email" type="email" defaultValue={guardian?.email ?? ""} className={accountInputClass} />
            </div>
            <div>
              <label className={accountLabelClass}>Guardian phone</label>
              <input name="guardian_phone" type="tel" defaultValue={guardian?.phone ?? ""} className={accountInputClass} />
            </div>
          </div>
          <div className="mt-4">
            <label className={accountLabelClass}>Street address</label>
            <input name="guardian_street_address" defaultValue={guardian?.street_address ?? ""} className={accountInputClass} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={accountLabelClass}>Occupation</label>
              <input name="guardian_occupation" defaultValue={guardian?.occupation ?? ""} className={accountInputClass} />
            </div>
            <div>
              <label className={accountLabelClass}>Relationship</label>
              <input name="guardian_relationship" defaultValue={guardian?.relationship ?? ""} className={accountInputClass} />
            </div>
          </div>
        </div>
      ) : null}

      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-emerald-700">Driver saved.</p> : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(btnPrimary, focusRing, tapTarget, "rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60")}
      >
        {pending ? "Saving..." : driver ? "Update driver" : "Add driver"}
      </button>
    </form>
  );
}

export function DriverFormLinkBack() {
  return (
    <Link href="/account/drivers" className={cn("text-sm", focusRing, "text-brand hover:text-brand-hover")}>
      &larr; Back to drivers
    </Link>
  );
}
