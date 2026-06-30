"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { submitMembershipApplicationAction } from "@/app/account/membership/actions";
import {
  MEMBERSHIP_INTENT_OPTIONS,
  formatMembershipIntent,
  intentRequiresGuardian,
  productsForIntent,
} from "@/lib/account/membership-intents";
import { formatCurrency } from "@/lib/account/format";
import type {
  MembershipIntent,
  MembershipProduct,
  OptionValue,
  Person,
  Profile,
  TermsVersion,
} from "@/types/database";
import { cn, btnPrimary, cardBase, focusRing, tapTarget } from "@/lib/cn";
import { accountInputClass, accountLabelClass, accountSectionClass, accountSelectClass } from "@/components/account/formFields";

interface MembershipWizardProps {
  profile: Profile | null;
  people: Person[];
  products: MembershipProduct[];
  terms: TermsVersion | null;
  classOptions: OptionValue[];
  licenceTypeOptions: OptionValue[];
  licenceRatingOptions: OptionValue[];
  clubOptions: OptionValue[];
  seasonLabel: string;
}

type FormState = { error?: string } | null;

const STEPS = [
  "Application type",
  "Account holder",
  "Member / participant",
  "Driver details",
  "Guardian",
  "Membership product",
  "Terms & submit",
];

async function wizardAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return submitMembershipApplicationAction(formData);
}

export function MembershipWizard({
  profile,
  people,
  products,
  terms,
  classOptions,
  licenceTypeOptions,
  licenceRatingOptions,
  clubOptions,
  seasonLabel,
}: MembershipWizardProps) {
  const [state, action, pending] = useActionState(wizardAction, null);
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<MembershipIntent | "">("");
  const [applicantDob, setApplicantDob] = useState("");
  const [sameAsHolder, setSameAsHolder] = useState(false);
  const [guardianSameAsHolder, setGuardianSameAsHolder] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState("");

  const intentConfig = MEMBERSHIP_INTENT_OPTIONS.find((o) => o.value === intent);
  const filteredProducts = useMemo(
    () => (intent ? productsForIntent(intent, products) : []),
    [intent, products],
  );

  const requiresDriving = intentConfig?.requiresDriving ?? false;
  const requiresGuardian = intent ? intentRequiresGuardian(intent, applicantDob || null) : false;
  const showFamilyFields = intent === "additional_family_racing_member";

  function goNext() {
    setStep((s) => Math.min(s + 1, STEPS.length));
    if (filteredProducts.length === 1 && !selectedProductId) {
      setSelectedProductId(filteredProducts[0].id);
    }
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="season_label" value={seasonLabel} />
      <input type="hidden" name="membership_intent" value={intent} />
      <input type="hidden" name="requires_driving" value={requiresDriving ? "on" : ""} />
      {terms ? <input type="hidden" name="terms_version_id" value={terms.id} /> : null}
      {selectedProductId ? <input type="hidden" name="selected_product_id" value={selectedProductId} /> : null}
      <input type="hidden" name="applicant_same_as_holder" value={sameAsHolder ? "on" : ""} />
      <input type="hidden" name="guardian_same_as_holder" value={guardianSameAsHolder ? "on" : ""} />

      <div className="flex flex-wrap gap-2">
        {STEPS.map((label, index) => {
          const n = index + 1;
          const active = n === step;
          const done = n < step;
          return (
            <span
              key={label}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                active ? "bg-brand/10 text-brand" : done ? "bg-emerald-50 text-emerald-800" : "bg-surface-alt text-ink-muted",
              )}
            >
              {n}. {label}
            </span>
          );
        })}
      </div>

      {step === 1 ? (
        <div className={accountSectionClass}>
          <h2 className="text-base font-semibold text-ink">Choose application type</h2>
          <ul className="mt-4 space-y-2">
            {MEMBERSHIP_INTENT_OPTIONS.map((option) => (
              <li key={option.value}>
                <label className={cn(cardBase, "flex cursor-pointer gap-3 p-4", intent === option.value && "ring-2 ring-brand/30")}>
                  <input
                    type="radio"
                    name="intent_choice"
                    value={option.value}
                    checked={intent === option.value}
                    onChange={() => {
                      setIntent(option.value);
                      setSelectedProductId("");
                    }}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium text-ink">{option.label}</span>
                    <span className="mt-1 block text-sm text-ink-muted">{option.description}</span>
                    {!option.isFullMembership ? (
                      <span className="mt-1 block text-xs text-amber-800">Not a full AKL-MTW membership</span>
                    ) : null}
                    {!option.requiresDriving ? (
                      <span className="mt-1 block text-xs text-ink-muted">Non-driving membership</span>
                    ) : null}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {step === 2 ? (
        <div className={accountSectionClass}>
          <h2 className="text-base font-semibold text-ink">Account holder details</h2>
          <p className="mt-1 text-sm text-ink-muted">These are the login owner details for this account.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="holder_first_name" required defaultValue={profile?.first_name ?? ""} placeholder="First name" className={accountInputClass} />
            <input name="holder_last_name" required defaultValue={profile?.last_name ?? ""} placeholder="Last name" className={accountInputClass} />
            <input name="holder_phone" defaultValue={profile?.phone ?? ""} placeholder="Phone" className={accountInputClass} />
            <input name="holder_occupation" defaultValue={profile?.occupation ?? ""} placeholder="Occupation" className={accountInputClass} />
          </div>
          <input name="holder_street_address" defaultValue={profile?.street_address ?? ""} placeholder="Street address" className={cn(accountInputClass, "mt-4")} />
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <input name="holder_suburb" defaultValue={profile?.suburb ?? ""} placeholder="Suburb" className={accountInputClass} />
            <input name="holder_town_city" defaultValue={profile?.town_city ?? ""} placeholder="Town / city" className={accountInputClass} />
            <input name="holder_postcode" defaultValue={profile?.postcode ?? ""} placeholder="Postcode" className={accountInputClass} />
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className={accountSectionClass}>
          <h2 className="text-base font-semibold text-ink">Member / participant details</h2>
          <p className="mt-1 text-sm text-ink-muted">
            The person this application is for
            {intent ? ` (${formatMembershipIntent(intent)})` : ""}.
          </p>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={sameAsHolder} onChange={(e) => setSameAsHolder(e.target.checked)} />
            Applicant is the same as account holder
          </label>
          {!sameAsHolder ? (
            <>
              {people.length ? (
                <div className="mt-4">
                  <label className={accountLabelClass}>Or select existing person</label>
                  <select name="applicant_person_id" className={accountSelectClass}>
                    <option value="">Add new person below</option>
                    {people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input name="applicant_first_name" required={!sameAsHolder} placeholder="First name" className={accountInputClass} />
                <input name="applicant_last_name" required={!sameAsHolder} placeholder="Last name" className={accountInputClass} />
                <input
                  name="applicant_date_of_birth"
                  type="date"
                  value={applicantDob}
                  onChange={(e) => setApplicantDob(e.target.value)}
                  className={accountInputClass}
                />
                <input name="applicant_phone" placeholder="Phone" className={accountInputClass} />
              </div>
              <input name="applicant_email" type="email" placeholder="Email" className={cn(accountInputClass, "mt-4")} />
            </>
          ) : null}
        </div>
      ) : null}

      {step === 4 && requiresDriving ? (
        <div className={accountSectionClass}>
          <h2 className="text-base font-semibold text-ink">Driver details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={accountLabelClass}>Primary class</label>
              <select name="primary_class_id" required className={accountSelectClass}>
                <option value="">Select…</option>
                {classOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={accountLabelClass}>Secondary class (optional)</label>
              <select name="secondary_class_id" className={accountSelectClass}>
                <option value="">None</option>
                {classOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <input name="kart_number" placeholder="Kart number" className={accountInputClass} />
            <input name="race_number" placeholder="Race number" className={accountInputClass} />
            <input name="transponder_number" placeholder="Transponder" className={accountInputClass} />
          </div>
          <input name="licence_number" placeholder="KSNZ licence number" className={cn(accountInputClass, "mt-4")} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <select name="licence_type_id" className={accountSelectClass}>
              <option value="">Licence type</option>
              {licenceTypeOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            <select name="licence_rating_id" className={accountSelectClass}>
              <option value="">Licence rating</option>
              {licenceRatingOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
          <select name="issuing_club_id" className={cn(accountSelectClass, "mt-4")}>
            <option value="">Club</option>
            {clubOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="licence_confirmed_green" />
            Licence confirmed green
          </label>
        </div>
      ) : null}

      {step === 4 && !requiresDriving ? (
        <div className={accountSectionClass}>
          <p className="text-sm text-ink-muted">Driver details are not required for this application type.</p>
        </div>
      ) : null}

      {step === 5 && requiresGuardian ? (
        <div className={accountSectionClass}>
          <h2 className="text-base font-semibold text-ink">Guardian details</h2>
          <p className="mt-1 text-sm text-ink-muted">Required because the participant is under 18.</p>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={guardianSameAsHolder} onChange={(e) => setGuardianSameAsHolder(e.target.checked)} />
            Guardian is the account holder
          </label>
          {!guardianSameAsHolder ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input name="guardian_first_name" placeholder="Guardian first name" className={accountInputClass} />
              <input name="guardian_last_name" placeholder="Guardian last name" className={accountInputClass} />
              <input name="guardian_email" type="email" placeholder="Guardian email" className={accountInputClass} />
              <input name="guardian_phone" type="tel" placeholder="Guardian phone" className={accountInputClass} />
              <input name="guardian_street_address" placeholder="Street address" className={accountInputClass} />
              <input name="guardian_occupation" placeholder="Occupation" className={accountInputClass} />
              <select name="guardian_relationship_type" className={accountSelectClass}>
                <option value="guardian">Guardian</option>
                <option value="parent">Parent</option>
                <option value="caregiver">Caregiver</option>
              </select>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 5 && !requiresGuardian ? (
        <div className={accountSectionClass}>
          <p className="text-sm text-ink-muted">Guardian details are not required for this application type.</p>
        </div>
      ) : null}

      {step === 6 ? (
        <div className={accountSectionClass}>
          <h2 className="text-base font-semibold text-ink">Membership product</h2>
          {showFamilyFields ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input name="primary_family_member_first_name" required placeholder="Primary family member first name" className={accountInputClass} />
              <input name="primary_family_member_last_name" required placeholder="Primary family member last name" className={accountInputClass} />
            </div>
          ) : null}
          {filteredProducts.length ? (
            <ul className="mt-4 space-y-2">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <label className={cn(cardBase, "flex cursor-pointer items-center justify-between gap-4 p-4", selectedProductId === product.id && "ring-2 ring-brand/30")}>
                    <span>
                      <span className="font-medium text-ink">{product.name}</span>
                      {product.description ? <span className="mt-1 block text-sm text-ink-muted">{product.description}</span> : null}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-semibold text-ink">{formatCurrency(Number(product.price))}</span>
                      <input
                        type="radio"
                        name="product_choice"
                        checked={selectedProductId === product.id}
                        onChange={() => setSelectedProductId(product.id)}
                      />
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">No membership product required for this application type.</p>
          )}
          <input name="volunteer_interest" placeholder="Volunteer interest (optional)" className={cn(accountInputClass, "mt-4")} />
        </div>
      ) : null}

      {step === 7 ? (
        <div className={accountSectionClass}>
          <h2 className="text-base font-semibold text-ink">Terms & submit</h2>
          {terms ? (
            <div className="mt-4 max-h-48 overflow-y-auto rounded-lg border border-border bg-white p-4 text-sm text-ink-muted">
              <p className="font-medium text-ink">{terms.title}</p>
              <p className="mt-2 whitespace-pre-wrap">{terms.body}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">Placeholder membership terms apply until confirmed by the club.</p>
          )}
          <label className="mt-4 flex items-start gap-2 text-sm text-ink">
            <input type="checkbox" name="terms_accepted" required className="mt-0.5" />
            I accept the membership terms and conditions.
          </label>
          <p className="mt-4 text-sm text-ink-muted">
            Application submitted. Payment is handled separately by the club.
          </p>
        </div>
      ) : null}

      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}

      <div className="flex flex-wrap gap-3">
        {step > 1 ? (
          <button type="button" onClick={goBack} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-surface-alt">
            Back
          </button>
        ) : null}
        {step < STEPS.length ? (
          <button
            type="button"
            onClick={goNext}
            disabled={step === 1 && !intent}
            className={cn(btnPrimary, focusRing, tapTarget, "rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60")}
          >
            Continue
          </button>
        ) : (
          <button type="submit" disabled={pending} className={cn(btnPrimary, focusRing, tapTarget, "rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60")}>
            {pending ? "Submitting..." : "Submit application"}
          </button>
        )}
      </div>

      <p className="text-sm text-ink-muted">
        Need to add people first?{" "}
        <Link href="/account/people" className="font-medium text-brand hover:text-brand-hover">
          Manage people & drivers
        </Link>
      </p>
    </form>
  );
}
