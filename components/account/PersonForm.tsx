"use client";

import { useActionState, useState } from "react";
import { savePersonAction } from "@/app/account/people/actions";
import { formatPersonType } from "@/lib/account/membership-intents";
import { isJuniorPerson } from "@/lib/people/utils";
import type { DriverLicence, DriverProfile, Person, PersonType } from "@/types/database";
import { cn, btnPrimary, cardBase, focusRing, tapTarget } from "@/lib/cn";
import {
  accountHelperTextClass,
  accountInputClass,
  accountLabelClass,
  accountSectionClass,
  accountSelectClass,
} from "@/components/account/formFields";
import type { OptionValue } from "@/types/database";

const PERSON_TYPES: PersonType[] = [
  "adult_driver",
  "junior_driver",
  "parent_guardian",
  "social_member",
  "pit_member",
  "visiting_driver",
  "other",
];

interface PersonFormProps {
  person?: Person;
  driverProfile?: DriverProfile | null;
  licence?: DriverLicence | null;
  guardianPerson?: Person | null;
  classOptions: OptionValue[];
  licenceTypeOptions: OptionValue[];
  licenceRatingOptions: OptionValue[];
  clubOptions: OptionValue[];
}

type FormState = { error?: string; success?: boolean } | null;

async function formAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return savePersonAction(formData);
}

export function PersonForm({
  person,
  driverProfile,
  licence,
  guardianPerson,
  classOptions,
  licenceTypeOptions,
  licenceRatingOptions,
  clubOptions,
}: PersonFormProps) {
  const [state, action, pending] = useActionState(formAction, null);
  const [dob, setDob] = useState(person?.date_of_birth ?? "");
  const [isDriver, setIsDriver] = useState(person?.is_driver ?? false);
  const showGuardian = isDriver && dob && isJuniorPerson(dob);

  return (
    <form action={action} className={cn(cardBase, "space-y-6 p-5 sm:p-6")}>
      {person?.id ? <input type="hidden" name="person_id" value={person.id} /> : null}
      {guardianPerson?.id ? <input type="hidden" name="guardian_person_id" value={guardianPerson.id} /> : null}

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Person details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={accountLabelClass}>First name</label>
            <input name="first_name" required defaultValue={person?.first_name ?? ""} className={accountInputClass} />
          </div>
          <div>
            <label className={accountLabelClass}>Last name</label>
            <input name="last_name" required defaultValue={person?.last_name ?? ""} className={accountInputClass} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={accountLabelClass}>Person type</label>
            <select name="person_type" defaultValue={person?.person_type ?? "other"} className={accountSelectClass}>
              {PERSON_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatPersonType(type)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={accountLabelClass}>Date of birth</label>
            <input
              name="date_of_birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={accountInputClass}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_driver" checked={isDriver} onChange={(e) => setIsDriver(e.target.checked)} />
            This person drives on track
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_account_holder" defaultChecked={person?.is_account_holder ?? false} />
            This person is the account holder
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={accountLabelClass}>Phone</label>
            <input name="phone" type="tel" defaultValue={person?.phone ?? ""} className={accountInputClass} />
          </div>
          <div>
            <label className={accountLabelClass}>Email</label>
            <input name="email" type="email" defaultValue={person?.email ?? ""} className={accountInputClass} />
          </div>
        </div>
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Address</h2>
        <div className="mt-4 space-y-4">
          <input name="street_address" placeholder="Street address" defaultValue={person?.street_address ?? ""} className={accountInputClass} />
          <div className="grid gap-4 sm:grid-cols-3">
            <input name="suburb" placeholder="Suburb" defaultValue={person?.suburb ?? ""} className={accountInputClass} />
            <input name="town_city" placeholder="Town / city" defaultValue={person?.town_city ?? ""} className={accountInputClass} />
            <input name="postcode" placeholder="Postcode" defaultValue={person?.postcode ?? ""} className={accountInputClass} />
          </div>
          <input name="occupation" placeholder="Occupation" defaultValue={person?.occupation ?? ""} className={accountInputClass} />
        </div>
      </div>

      {isDriver ? (
        <>
          <div className={accountSectionClass}>
            <h2 className="text-base font-semibold text-ink">Driver details</h2>
            <div className="mt-4">
              <label className={accountLabelClass}>Default kart class</label>
              <select name="default_class_id" defaultValue={driverProfile?.default_class_id ?? ""} className={accountSelectClass}>
                <option value="">Select…</option>
                {classOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input name="kart_number" placeholder="Kart number" defaultValue={driverProfile?.default_kart_number ?? ""} className={accountInputClass} />
              <div>
                <input name="transponder_number" placeholder="Transponder number" defaultValue={driverProfile?.default_transponder_number ?? ""} className={accountInputClass} />
                <p className={accountHelperTextClass}>Only enter this if you own your own transponder.</p>
              </div>
            </div>
          </div>

          <div className={accountSectionClass}>
            <h2 className="text-base font-semibold text-ink">Licence</h2>
            <input name="licence_number" placeholder="KSNZ licence number" defaultValue={licence?.licence_number ?? ""} className={cn(accountInputClass, "mt-4")} />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <select name="licence_type_id" defaultValue={licence?.licence_type_id ?? ""} className={accountSelectClass}>
                <option value="">Licence type</option>
                {licenceTypeOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
              <select name="licence_rating_id" defaultValue={licence?.licence_rating_id ?? ""} className={accountSelectClass}>
                <option value="">Licence rating</option>
                {licenceRatingOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
            <select name="issuing_club_id" defaultValue={licence?.issuing_club_id ?? driverProfile?.default_club_id ?? ""} className={cn(accountSelectClass, "mt-4")}>
              <option value="">Club</option>
              {clubOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            <label className="mt-4 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" name="licence_confirmed_green" defaultChecked={licence?.licence_confirmed_green ?? false} />
              Licence confirmed green
            </label>
          </div>
        </>
      ) : null}

      {showGuardian ? (
        <div className={accountSectionClass}>
          <h2 className="text-base font-semibold text-ink">Guardian</h2>
          <p className="mt-1 text-sm text-ink-muted">Required for drivers under 18.</p>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="use_account_holder_as_guardian" defaultChecked />
            Use account holder as guardian
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="guardian_first_name" placeholder="Guardian first name" defaultValue={guardianPerson?.first_name ?? ""} className={accountInputClass} />
            <input name="guardian_last_name" placeholder="Guardian last name" defaultValue={guardianPerson?.last_name ?? ""} className={accountInputClass} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="guardian_email" type="email" placeholder="Guardian email" defaultValue={guardianPerson?.email ?? ""} className={accountInputClass} />
            <input name="guardian_phone" type="tel" placeholder="Guardian phone" defaultValue={guardianPerson?.phone ?? ""} className={accountInputClass} />
          </div>
          <input name="guardian_street_address" placeholder="Guardian street address" defaultValue={guardianPerson?.street_address ?? ""} className={cn(accountInputClass, "mt-4")} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="guardian_occupation" placeholder="Guardian occupation" defaultValue={guardianPerson?.occupation ?? ""} className={accountInputClass} />
            <select name="guardian_relationship_type" defaultValue="guardian" className={accountSelectClass}>
              <option value="guardian">Guardian</option>
              <option value="parent">Parent</option>
              <option value="caregiver">Caregiver</option>
            </select>
          </div>
        </div>
      ) : null}

      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-emerald-700">Person saved.</p> : null}

      <button type="submit" disabled={pending} className={cn(btnPrimary, focusRing, tapTarget, "rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60")}>
        {pending ? "Saving..." : person ? "Update person" : "Add person"}
      </button>
    </form>
  );
}
