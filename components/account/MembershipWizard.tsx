"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { submitMembershipApplicationAction } from "@/app/account/membership/actions";
import { VolunteerHelpSection } from "@/components/account/VolunteerHelpSection";
import {
  ACCOUNT_HOLDER_GUARDIAN_INCOMPLETE_MESSAGE,
  MANUAL_GUARDIAN_INCOMPLETE_MESSAGE,
  isAccountHolderGuardianComplete,
  isManualGuardianComplete,
  type AccountHolderGuardianFields,
} from "@/lib/account/guardian-validation";
import { formatVolunteerInterest } from "@/lib/account/volunteer-options";
import {
  REGISTRATION_PATH_OPTIONS,
  applicantPersonTypeForPath,
  productsForRegistrationPath,
  registrationPathRequiresGuardian,
  resolveMembershipIntent,
  type RegistrationPath,
} from "@/lib/account/membership-intents";
import { formatCurrency } from "@/lib/account/format";
import type {
  MembershipProduct,
  OptionValue,
  Person,
  Profile,
  TermsVersion,
} from "@/types/database";
import { cn, btnPrimary, cardBase, focusRing, tapTarget } from "@/lib/cn";
import { accountHelperTextClass, accountInputClass, accountLabelClass, accountSectionClass, accountSelectClass } from "@/components/account/formFields";

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
  "Who are you registering?",
  "Account holder",
  "Driver or member",
  "Driver details",
  "Guardian",
  "Membership option",
  "Review and submit",
];

async function wizardAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return submitMembershipApplicationAction(formData);
}

function optionLabel(options: OptionValue[], id: string): string {
  if (!id) return "—";
  return options.find((o) => o.id === id)?.label ?? "—";
}

interface DriverFormSnapshot {
  classLabel: string;
  kartNumber: string;
  transponderNumber: string;
  licenceNumber: string;
  licenceTypeLabel: string;
  licenceRatingLabel: string;
  clubLabel: string;
  licenceConfirmedGreen: boolean;
}

const EMPTY_DRIVER_SNAPSHOT: DriverFormSnapshot = {
  classLabel: "—",
  kartNumber: "—",
  transponderNumber: "—",
  licenceNumber: "—",
  licenceTypeLabel: "—",
  licenceRatingLabel: "—",
  clubLabel: "—",
  licenceConfirmedGreen: false,
};

interface ApplicantNameSnapshot {
  firstName: string;
  lastName: string;
}

const EMPTY_APPLICANT_SNAPSHOT: ApplicantNameSnapshot = {
  firstName: "",
  lastName: "",
};

function formatTransponderDisplay(value: string): string {
  const trimmed = value.trim();
  return trimmed || "Not provided";
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>;
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
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [registrationPath, setRegistrationPath] = useState<RegistrationPath | "">("");
  const [applicantDob, setApplicantDob] = useState("");
  const [sameAsHolder, setSameAsHolder] = useState(false);
  const [addressSameAsHolder, setAddressSameAsHolder] = useState(true);
  const [guardianSameAsHolder, setGuardianSameAsHolder] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [volunteerSelected, setVolunteerSelected] = useState<string[]>([]);
  const [driverSnapshot, setDriverSnapshot] = useState<DriverFormSnapshot>(EMPTY_DRIVER_SNAPSHOT);
  const [applicantSnapshot, setApplicantSnapshot] = useState<ApplicantNameSnapshot>(EMPTY_APPLICANT_SNAPSHOT);
  const [highlightHolderFields, setHighlightHolderFields] = useState(false);
  const [holderSnapshot, setHolderSnapshot] = useState<AccountHolderGuardianFields>({
    firstName: profile?.first_name ?? "",
    lastName: profile?.last_name ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
  });

  const pathConfig = REGISTRATION_PATH_OPTIONS.find((o) => o.value === registrationPath);
  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? null;
  const membershipIntent = registrationPath ? resolveMembershipIntent(registrationPath, selectedProduct) : "";
  const filteredProducts = useMemo(
    () => (registrationPath ? productsForRegistrationPath(registrationPath, products) : []),
    [registrationPath, products],
  );

  const requiresDriving = pathConfig?.requiresDriving ?? false;
  const isJuniorPath = registrationPath === "junior_driver";
  const requiresGuardian = registrationPath
    ? registrationPathRequiresGuardian(registrationPath, applicantDob || null)
    : false;
  const showFamilyFields = registrationPath === "additional_family_driver";
  const applicantPersonType = registrationPath
    ? applicantPersonTypeForPath(registrationPath, applicantDob || null, membershipIntent || "racing_practising_member")
    : "";

  const holderStepTitle = isJuniorPath ? "Parent / account holder details" : "Account holder details";
  const holderStepHelp = isJuniorPath
    ? "These are the details of the parent or guardian managing the account."
    : "These are the login owner details for this account.";

  const memberStepTitle =
    registrationPath === "junior_driver"
      ? "Junior driver details"
      : registrationPath === "visiting_driver"
        ? "Visiting driver details"
        : registrationPath === "social_or_pit"
          ? "Member details"
          : "Driver or member details";

  const memberStepHelp =
    registrationPath === "junior_driver"
      ? "This is the person the membership will be created for."
      : "The person this application is for.";

  const termsLabel =
    isJuniorPath || requiresGuardian
      ? "I accept the membership terms and conditions on behalf of the applicant."
      : "I accept the membership terms and conditions.";
  // TODO: confirm visiting driver declaration wording if it differs from full membership terms

  function handlePathChange(path: RegistrationPath) {
    setRegistrationPath(path);
    setSelectedProductId("");
    setSameAsHolder(path === "adult_driver");
    setAddressSameAsHolder(path === "junior_driver");
    setGuardianSameAsHolder(true);
    if (path === "junior_driver") setSameAsHolder(false);
  }

  function stepPanelClass(stepNumber: number, extraHidden = false) {
    return cn(accountSectionClass, (step !== stepNumber || extraHidden) && "hidden");
  }

  function getAccountHolderData(): AccountHolderGuardianFields {
    const fromForm = readHolderFromForm();
    return {
      firstName: fromForm.firstName || holderSnapshot.firstName,
      lastName: fromForm.lastName || holderSnapshot.lastName,
      email: fromForm.email || holderSnapshot.email || profile?.email || "",
      phone: fromForm.phone || holderSnapshot.phone,
    };
  }

  function syncHolderSnapshot() {
    setHolderSnapshot(getAccountHolderData());
  }

  function readApplicantSnapshotFromForm(): ApplicantNameSnapshot {
    const form = formRef.current;
    if (!form) return applicantSnapshot;

    const formData = new FormData(form);
    const personId = String(formData.get("applicant_person_id") ?? "");
    if (personId) {
      const person = people.find((p) => p.id === personId);
      if (person) {
        return { firstName: person.first_name, lastName: person.last_name };
      }
    }

    return {
      firstName: String(formData.get("applicant_first_name") ?? "").trim(),
      lastName: String(formData.get("applicant_last_name") ?? "").trim(),
    };
  }

  function applicantDisplayName(snapshot: ApplicantNameSnapshot): string {
    const name = [snapshot.firstName, snapshot.lastName].filter(Boolean).join(" ").trim();
    return name || "Name not entered";
  }

  function holderDisplayName(holder: AccountHolderGuardianFields): string {
    const name = [holder.firstName, holder.lastName].filter(Boolean).join(" ").trim();
    return name || "Name not entered";
  }

  function holderFieldClass(missing: boolean) {
    return cn(accountInputClass, missing && highlightHolderFields && "border-amber-500 ring-2 ring-amber-200");
  }

  function readDriverSnapshotFromForm(): DriverFormSnapshot {
    const form = formRef.current;
    if (!form) return driverSnapshot;

    const formData = new FormData(form);
    const classId = String(formData.get("primary_class_id") ?? "");
    const licenceTypeId = String(formData.get("licence_type_id") ?? "");
    const licenceRatingId = String(formData.get("licence_rating_id") ?? "");
    const clubId = String(formData.get("issuing_club_id") ?? "");

    return {
      classLabel: optionLabel(classOptions, classId),
      kartNumber: String(formData.get("kart_number") ?? "").trim() || "—",
      transponderNumber: String(formData.get("transponder_number") ?? "").trim(),
      licenceNumber: String(formData.get("licence_number") ?? "").trim() || "—",
      licenceTypeLabel: optionLabel(licenceTypeOptions, licenceTypeId),
      licenceRatingLabel: optionLabel(licenceRatingOptions, licenceRatingId),
      clubLabel: optionLabel(clubOptions, clubId),
      licenceConfirmedGreen: formData.get("licence_confirmed_green") === "on",
    };
  }

  function readHolderFromForm(): AccountHolderGuardianFields {
    const form = formRef.current;
    if (!form) {
      return holderSnapshot;
    }
    const formData = new FormData(form);
    return {
      firstName: String(formData.get("holder_first_name") ?? "").trim(),
      lastName: String(formData.get("holder_last_name") ?? "").trim(),
      email: String(formData.get("holder_email") ?? profile?.email ?? "").trim(),
      phone: String(formData.get("holder_phone") ?? "").trim(),
    };
  }

  function readManualGuardianFromForm() {
    const form = formRef.current;
    if (!form) {
      return { firstName: "", lastName: "", email: "", phone: "" };
    }
    const formData = new FormData(form);
    return {
      firstName: String(formData.get("guardian_first_name") ?? "").trim(),
      lastName: String(formData.get("guardian_last_name") ?? "").trim(),
      email: String(formData.get("guardian_email") ?? "").trim(),
      phone: String(formData.get("guardian_phone") ?? "").trim(),
    };
  }

  function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateAccountHolderFields(holder: AccountHolderGuardianFields): string[] {
    const errors: string[] = [];
    if (!holder.firstName.trim()) errors.push("Account holder first name is required");
    if (!holder.lastName.trim()) errors.push("Account holder last name is required");
    if (!holder.email.trim()) errors.push("Account holder email is required");
    if (!holder.phone.trim()) errors.push("Account holder phone is required");
    return errors;
  }

  function validateApplicantFields(): string[] {
    const errors: string[] = [];
    if (sameAsHolder) return errors;

    const form = formRef.current;
    const formData = form ? new FormData(form) : null;
    const personId = formData ? String(formData.get("applicant_person_id") ?? "") : "";
    if (personId) return errors;

    const applicant = readApplicantSnapshotFromForm();
    if (!applicant.firstName.trim()) errors.push("Member first name is required");
    if (!applicant.lastName.trim()) errors.push("Member last name is required");
    if (registrationPath !== "social_or_pit" && !applicantDob.trim()) {
      errors.push("Member date of birth is required");
    }

    const email = formData ? String(formData.get("applicant_email") ?? "").trim() : "";
    if (email && !isValidEmail(email)) {
      errors.push("Member email must be a valid email address");
    }

    return errors;
  }

  function validateGuardianFields(): string[] {
    if (!requiresGuardian) return [];
    if (guardianSameAsHolder) {
      if (!isAccountHolderGuardianComplete(getAccountHolderData())) {
        return [ACCOUNT_HOLDER_GUARDIAN_INCOMPLETE_MESSAGE];
      }
      return [];
    }
    if (!isManualGuardianComplete(readManualGuardianFromForm())) {
      return [MANUAL_GUARDIAN_INCOMPLETE_MESSAGE];
    }
    return [];
  }

  function validateProductFields(): string[] {
    const errors: string[] = [];
    const form = formRef.current;
    const formData = form ? new FormData(form) : null;

    if (showFamilyFields && formData) {
      if (!String(formData.get("primary_family_member_first_name") ?? "").trim()) {
        errors.push("Primary family member first name is required");
      }
      if (!String(formData.get("primary_family_member_last_name") ?? "").trim()) {
        errors.push("Primary family member last name is required");
      }
    }

    if (filteredProducts.length > 0 && registrationPath !== "visiting_driver" && !selectedProductId) {
      errors.push("Please select a membership product");
    }

    return errors;
  }

  function validateCurrentStep(): string[] {
    switch (step) {
      case 1:
        return registrationPath ? [] : ["Please choose who you are registering."];
      case 2:
        return validateAccountHolderFields(getAccountHolderData());
      case 3:
        return validateApplicantFields();
      case 4:
        return [];
      case 5:
        return validateGuardianFields();
      case 6:
        return validateProductFields();
      default:
        return [];
    }
  }

  function validateSubmit(): string[] {
    const errors: string[] = [];
    if (!registrationPath) errors.push("Please choose who you are registering.");
    errors.push(...validateAccountHolderFields(getAccountHolderData()));
    errors.push(...validateApplicantFields());
    errors.push(...validateGuardianFields());
    errors.push(...validateProductFields());

    const form = formRef.current;
    const termsAccepted = form ? new FormData(form).get("terms_accepted") === "on" : false;
    if (!terms) {
      errors.push("Membership terms have not been configured yet.");
    } else if (!termsAccepted) {
      errors.push("You must accept the membership terms and conditions");
    }

    return errors;
  }

  function goNext() {
    setStepError(null);
    setSubmitErrors([]);

    if (step === 2) {
      syncHolderSnapshot();
      setHighlightHolderFields(false);
    }
    if (step === 3) {
      setApplicantSnapshot(readApplicantSnapshotFromForm());
    }
    if (step === 4 && requiresDriving) {
      setDriverSnapshot(readDriverSnapshotFromForm());
    }

    const errors = validateCurrentStep();
    if (errors.length) {
      setSubmitErrors(errors);
      return;
    }

    if (step === 5 && guardianSameAsHolder) {
      syncHolderSnapshot();
    }
    if (step === 6) {
      syncHolderSnapshot();
      setApplicantSnapshot(readApplicantSnapshotFromForm());
      if (requiresDriving) {
        setDriverSnapshot(readDriverSnapshotFromForm());
      }
    }

    setStep((s) => Math.min(s + 1, STEPS.length));
    if (filteredProducts.length === 1 && !selectedProductId) {
      setSelectedProductId(filteredProducts[0].id);
    }
  }

  function goBack() {
    setStepError(null);
    setSubmitErrors([]);
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmitApplication() {
    setStepError(null);
    syncHolderSnapshot();
    setApplicantSnapshot(readApplicantSnapshotFromForm());
    if (requiresDriving) {
      setDriverSnapshot(readDriverSnapshotFromForm());
    }

    const errors = validateSubmit();
    if (errors.length) {
      setSubmitErrors(errors);
      return;
    }

    setSubmitErrors([]);
    formRef.current?.requestSubmit();
  }

  function goToAccountHolderStep() {
    setStepError(null);
    setSubmitErrors([]);
    setHighlightHolderFields(true);
    setStep(2);
  }

  const accountHolderData = getAccountHolderData();
  const guardianHolderSummary = guardianSameAsHolder ? accountHolderData : holderSnapshot;
  const reviewApplicant = applicantSnapshot.firstName || applicantSnapshot.lastName
    ? applicantSnapshot
    : readApplicantSnapshotFromForm();
  const reviewHolder = accountHolderData;
  const volunteerSummary = formatVolunteerInterest(
    volunteerSelected.length ? volunteerSelected.join(", ") : "",
  );

  return (
    <form ref={formRef} action={action} noValidate className="space-y-6">
      <input type="hidden" name="season_label" value={seasonLabel} />
      <input type="hidden" name="registration_path" value={registrationPath} />
      <input type="hidden" name="membership_intent" value={membershipIntent} />
      <input type="hidden" name="applicant_person_type" value={applicantPersonType} />
      <input type="hidden" name="requires_driving" value={requiresDriving ? "on" : ""} />
      {selectedProductId ? <input type="hidden" name="selected_product_id" value={selectedProductId} /> : null}
      <input type="hidden" name="applicant_same_as_holder" value={sameAsHolder ? "on" : ""} />
      <input type="hidden" name="applicant_address_same_as_holder" value={addressSameAsHolder ? "on" : ""} />
      <input type="hidden" name="guardian_same_as_holder" value={guardianSameAsHolder ? "on" : ""} />

      <input type="hidden" name="holder_email" value={profile?.email ?? ""} />

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2">
          {STEPS.map((label, index) => {
            const n = index + 1;
            const active = n === step;
            const done = n < step;
            return (
              <span
                key={label}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
                  active ? "bg-brand/10 text-brand" : done ? "bg-emerald-50 text-emerald-800" : "bg-surface-alt text-ink-muted",
                )}
              >
                {n}. {label}
              </span>
            );
          })}
        </div>
      </div>

      <div className={stepPanelClass(1)}>
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Who are you registering?</h2>
          <p className="mt-2 text-sm text-ink-muted">Choose the option that best matches who you are registering today.</p>
          <ul className="mt-6 space-y-3">
            {REGISTRATION_PATH_OPTIONS.map((option) => (
              <li key={option.value}>
                <label
                  className={cn(
                    cardBase,
                    "flex cursor-pointer gap-3 p-4 sm:p-5",
                    registrationPath === option.value && "ring-2 ring-brand/30",
                    option.isPrimary && "border-brand/25 bg-brand/[0.02]",
                  )}
                >
                  <input
                    type="radio"
                    name="path_choice"
                    value={option.value}
                    checked={registrationPath === option.value}
                    onChange={() => handlePathChange(option.value)}
                    className="mt-1"
                  />
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{option.label}</span>
                      {option.isPrimary ? (
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-brand">
                          Most common
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-ink-muted">{option.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
      </div>

      <div className={stepPanelClass(2)}>
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{holderStepTitle}</h2>
          <p className="mt-2 text-sm text-ink-muted">{holderStepHelp}</p>
          <FieldGrid>
            <div>
              <label className={accountLabelClass}>First name</label>
              <input
                name="holder_first_name"
                defaultValue={profile?.first_name ?? ""}
                onChange={syncHolderSnapshot}
                className={holderFieldClass(!accountHolderData.firstName)}
              />
            </div>
            <div>
              <label className={accountLabelClass}>Last name</label>
              <input
                name="holder_last_name"
                defaultValue={profile?.last_name ?? ""}
                onChange={syncHolderSnapshot}
                className={holderFieldClass(!accountHolderData.lastName)}
              />
            </div>
            <div>
              <label className={accountLabelClass}>Email</label>
              <input
                type="email"
                readOnly
                value={profile?.email ?? ""}
                className={cn(accountInputClass, "bg-surface-alt text-ink-muted")}
              />
            </div>
            <div>
              <label className={accountLabelClass}>Phone</label>
              <input
                name="holder_phone"
                defaultValue={profile?.phone ?? ""}
                onChange={syncHolderSnapshot}
                className={holderFieldClass(!accountHolderData.phone)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={accountLabelClass}>Occupation</label>
              <input name="holder_occupation" defaultValue={profile?.occupation ?? ""} className={accountInputClass} />
            </div>
          </FieldGrid>
          <div className="mt-4">
            <label className={accountLabelClass}>Street address</label>
            <input name="holder_street_address" defaultValue={profile?.street_address ?? ""} className={accountInputClass} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className={accountLabelClass}>Suburb</label>
              <input name="holder_suburb" defaultValue={profile?.suburb ?? ""} className={accountInputClass} />
            </div>
            <div>
              <label className={accountLabelClass}>Town / city</label>
              <input name="holder_town_city" defaultValue={profile?.town_city ?? ""} className={accountInputClass} />
            </div>
            <div>
              <label className={accountLabelClass}>Postcode</label>
              <input name="holder_postcode" defaultValue={profile?.postcode ?? ""} className={accountInputClass} />
            </div>
          </div>
      </div>

      <div className={stepPanelClass(3)}>
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{memberStepTitle}</h2>
          <p className="mt-2 text-sm text-ink-muted">{memberStepHelp}</p>

          {registrationPath === "adult_driver" ? (
            <label className="mt-4 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={sameAsHolder} onChange={(e) => setSameAsHolder(e.target.checked)} />
              Use my account holder details
            </label>
          ) : null}

          {!sameAsHolder ? (
            <>
              {people.length ? (
                <div className="mt-4">
                  <label className={accountLabelClass}>Or select an existing person</label>
                  <select name="applicant_person_id" className={accountSelectClass}>
                    <option value="">Add new person below</option>
                    {people
                      .filter((p) => !p.is_account_holder)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.first_name} {p.last_name}
                        </option>
                      ))}
                  </select>
                </div>
              ) : null}
              <FieldGrid>
                <div>
                  <label className={accountLabelClass}>First name</label>
                  <input name="applicant_first_name" className={accountInputClass} />
                </div>
                <div>
                  <label className={accountLabelClass}>Last name</label>
                  <input name="applicant_last_name" className={accountInputClass} />
                </div>
                <div>
                  <label className={accountLabelClass}>Date of birth</label>
                  <input
                    name="applicant_date_of_birth"
                    type="date"
                    value={applicantDob}
                    onChange={(e) => setApplicantDob(e.target.value)}
                    className={accountInputClass}
                  />
                </div>
                <div>
                  <label className={accountLabelClass}>Phone {isJuniorPath ? "(optional)" : ""}</label>
                  <input name="applicant_phone" className={accountInputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={accountLabelClass}>Email {isJuniorPath ? "(optional)" : ""}</label>
                  <input name="applicant_email" type="text" inputMode="email" autoComplete="email" className={accountInputClass} />
                </div>
              </FieldGrid>

              {!isJuniorPath ? (
                <>
                  <div className="mt-4">
                    <label className={accountLabelClass}>Street address</label>
                    <input name="applicant_street_address" className={accountInputClass} />
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className={accountLabelClass}>Suburb</label>
                      <input name="applicant_suburb" className={accountInputClass} />
                    </div>
                    <div>
                      <label className={accountLabelClass}>Town / city</label>
                      <input name="applicant_town_city" className={accountInputClass} />
                    </div>
                    <div>
                      <label className={accountLabelClass}>Postcode</label>
                      <input name="applicant_postcode" className={accountInputClass} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <label className="mt-4 flex items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={addressSameAsHolder}
                      onChange={(e) => setAddressSameAsHolder(e.target.checked)}
                    />
                    Address same as parent / account holder
                  </label>
                  {!addressSameAsHolder ? (
                    <>
                      <div className="mt-4">
                        <label className={accountLabelClass}>Street address</label>
                        <input name="applicant_street_address" className={accountInputClass} />
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className={accountLabelClass}>Suburb</label>
                          <input name="applicant_suburb" className={accountInputClass} />
                        </div>
                        <div>
                          <label className={accountLabelClass}>Town / city</label>
                          <input name="applicant_town_city" className={accountInputClass} />
                        </div>
                        <div>
                          <label className={accountLabelClass}>Postcode</label>
                          <input name="applicant_postcode" className={accountInputClass} />
                        </div>
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </>
          ) : null}
      </div>

      <div className={cn(stepPanelClass(4), !requiresDriving && "hidden")}>
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Driver details</h2>
          {isJuniorPath ? (
            <p className="mt-2 text-sm text-ink-muted">These details belong to the junior driver, not the parent or guardian.</p>
          ) : null}
          <FieldGrid>
            <div>
              <label className={accountLabelClass}>Default kart class</label>
              <select name="primary_class_id" className={accountSelectClass}>
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
            <div>
              <label className={accountLabelClass}>Kart number</label>
              <input name="kart_number" className={accountInputClass} />
            </div>
            <div>
              <label className={accountLabelClass}>Transponder number</label>
              <input name="transponder_number" className={accountInputClass} />
              <p className={accountHelperTextClass}>Only enter this if you own your own transponder.</p>
            </div>
            <div>
              <label className={accountLabelClass}>KSNZ licence number</label>
              <input name="licence_number" className={accountInputClass} />
            </div>
            <div>
              <label className={accountLabelClass}>KSNZ licence type</label>
              <select name="licence_type_id" className={accountSelectClass}>
                <option value="">Select…</option>
                {licenceTypeOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={accountLabelClass}>KSNZ licence rating</label>
              <select name="licence_rating_id" className={accountSelectClass}>
                <option value="">Select…</option>
                {licenceRatingOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={accountLabelClass}>Club</label>
              <select name="issuing_club_id" className={accountSelectClass}>
                <option value="">Select…</option>
                {clubOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
          </FieldGrid>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="licence_confirmed_green" />
            Licence confirmed green
          </label>
      </div>

      <div className={cn(stepPanelClass(4), requiresDriving && "hidden")}>
          <p className="text-sm text-ink-muted">Driver details are not required for this application.</p>
      </div>

      <div className={cn(stepPanelClass(5), !requiresGuardian && "hidden")}>
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Guardian details</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Because this driver is under 18, a parent or guardian must be linked to their account.
          </p>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={guardianSameAsHolder}
              onChange={(e) => {
                setGuardianSameAsHolder(e.target.checked);
                setStepError(null);
              }}
            />
            Guardian is the account holder (parent / guardian)
          </label>
          {guardianSameAsHolder ? (
            <div className="mt-4 rounded-lg border border-border bg-surface-alt/50 p-4 text-sm">
              <p className="font-medium text-ink">Using account holder as guardian</p>
              <p className="mt-2 text-ink-muted">
                {holderDisplayName(guardianHolderSummary)}
                {guardianHolderSummary.email ? ` · ${guardianHolderSummary.email}` : ""}
                {guardianHolderSummary.phone ? ` · ${guardianHolderSummary.phone}` : ""}
              </p>
              {!isAccountHolderGuardianComplete(guardianHolderSummary) ? (
                <p className="mt-2 text-amber-800">
                  Please complete the parent/guardian account holder details before continuing.{" "}
                  <button
                    type="button"
                    onClick={goToAccountHolderStep}
                    className="font-medium text-brand hover:text-brand-hover"
                  >
                    Go back to account holder
                  </button>
                </p>
              ) : null}
              <input type="hidden" name="guardian_relationship_type" value="parent" />
            </div>
          ) : (
            <FieldGrid>
              <div>
                <label className={accountLabelClass}>Guardian first name</label>
                <input name="guardian_first_name" className={accountInputClass} />
              </div>
              <div>
                <label className={accountLabelClass}>Guardian last name</label>
                <input name="guardian_last_name" className={accountInputClass} />
              </div>
              <div>
                <label className={accountLabelClass}>Guardian email</label>
                <input name="guardian_email" type="text" inputMode="email" autoComplete="email" className={accountInputClass} />
              </div>
              <div>
                <label className={accountLabelClass}>Guardian phone</label>
                <input name="guardian_phone" type="tel" className={accountInputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={accountLabelClass}>Street address</label>
                <input name="guardian_street_address" className={accountInputClass} />
              </div>
              <div>
                <label className={accountLabelClass}>Occupation</label>
                <input name="guardian_occupation" className={accountInputClass} />
              </div>
              <div>
                <label className={accountLabelClass}>Relationship</label>
                <select name="guardian_relationship_type" defaultValue="parent" className={accountSelectClass}>
                  <option value="parent">Parent / guardian</option>
                  <option value="guardian">Guardian</option>
                  <option value="caregiver">Caregiver</option>
                </select>
              </div>
            </FieldGrid>
          )}
      </div>

      <div className={cn(stepPanelClass(5), requiresGuardian && "hidden")}>
          <p className="text-sm text-ink-muted">Guardian details are not required for this application.</p>
      </div>

      <div className={stepPanelClass(6)}>
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Membership option</h2>
          {isJuniorPath ? (
            <p className="mt-2 text-sm text-ink-muted">
              The membership will be created in the junior driver&apos;s name. The parent or guardian manages the account.
            </p>
          ) : null}
          {registrationPath === "visiting_driver" ? (
            <p className="mt-4 rounded-lg border border-border bg-surface-alt/60 p-4 text-sm text-ink-muted">
              Visiting drivers can create an account and later register for practice or race days without full
              AKL-MTW membership.
            </p>
          ) : null}
          {showFamilyFields ? (
            <FieldGrid>
              <div>
                <label className={accountLabelClass}>Primary family member first name</label>
                <input name="primary_family_member_first_name" className={accountInputClass} />
              </div>
              <div>
                <label className={accountLabelClass}>Primary family member last name</label>
                <input name="primary_family_member_last_name" className={accountInputClass} />
              </div>
            </FieldGrid>
          ) : null}
          <VolunteerHelpSection selected={volunteerSelected} onChange={setVolunteerSelected} />
          {filteredProducts.length ? (
            <ul className="mt-4 space-y-2">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <label
                    className={cn(
                      cardBase,
                      "flex cursor-pointer items-center justify-between gap-4 p-4",
                      selectedProductId === product.id && "ring-2 ring-brand/30",
                    )}
                  >
                    <span>
                      <span className="font-medium text-ink">{product.name}</span>
                      {product.description ? (
                        <span className="mt-1 block text-sm text-ink-muted">{product.description}</span>
                      ) : null}
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
          ) : registrationPath === "visiting_driver" ? null : (
            <p className="mt-4 text-sm text-ink-muted">No membership product required for this application type.</p>
          )}
      </div>

      <div className={stepPanelClass(7)}>
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Review and submit</h2>
          <div className="mt-4 space-y-3 rounded-lg border border-border bg-surface-alt/40 p-4 text-sm">
            {isJuniorPath ? (
              <>
                <p>
                  <span className="text-ink-muted">Account holder / guardian:</span>{" "}
                  <span className="font-medium text-ink">{holderDisplayName(reviewHolder)}</span>
                </p>
                <p>
                  <span className="text-ink-muted">Member / driver:</span>{" "}
                  <span className="font-medium text-ink">{applicantDisplayName(reviewApplicant)}</span>
                </p>
              </>
            ) : (
              <p>
                <span className="text-ink-muted">Application type:</span>{" "}
                <span className="font-medium text-ink">
                  {REGISTRATION_PATH_OPTIONS.find((o) => o.value === registrationPath)?.label}
                </span>
              </p>
            )}
            {selectedProduct ? (
              <p>
                <span className="text-ink-muted">Membership:</span>{" "}
                <span className="font-medium text-ink">
                  {selectedProduct.name} — {formatCurrency(Number(selectedProduct.price))}
                </span>
              </p>
            ) : registrationPath === "visiting_driver" ? (
              <p>
                <span className="text-ink-muted">Membership:</span>{" "}
                <span className="font-medium text-ink">Visiting driver account (no full club membership)</span>
              </p>
            ) : null}
            {requiresDriving ? (
              <>
                <p>
                  <span className="text-ink-muted">Class:</span>{" "}
                  <span className="font-medium text-ink">{driverSnapshot.classLabel}</span>
                </p>
                <p>
                  <span className="text-ink-muted">Kart number:</span>{" "}
                  <span className="font-medium text-ink">{driverSnapshot.kartNumber}</span>
                </p>
                <p>
                  <span className="text-ink-muted">Transponder:</span>{" "}
                  <span className="font-medium text-ink">{formatTransponderDisplay(driverSnapshot.transponderNumber)}</span>
                </p>
                <p>
                  <span className="text-ink-muted">KSNZ licence number:</span>{" "}
                  <span className="font-medium text-ink">{driverSnapshot.licenceNumber}</span>
                </p>
                <p>
                  <span className="text-ink-muted">Licence type / rating:</span>{" "}
                  <span className="font-medium text-ink">
                    {driverSnapshot.licenceTypeLabel} / {driverSnapshot.licenceRatingLabel}
                  </span>
                </p>
                <p>
                  <span className="text-ink-muted">Club:</span>{" "}
                  <span className="font-medium text-ink">{driverSnapshot.clubLabel}</span>
                </p>
                <p>
                  <span className="text-ink-muted">Licence confirmed green:</span>{" "}
                  <span className="font-medium text-ink">{driverSnapshot.licenceConfirmedGreen ? "Yes" : "No"}</span>
                </p>
              </>
            ) : null}
            <p>
              <span className="text-ink-muted">Payment:</span>{" "}
              <span className="font-medium text-ink">Payment handled separately by the club</span>
            </p>
            <p>
              <span className="text-ink-muted">Volunteer help:</span>{" "}
              <span className="font-medium text-ink">{volunteerSummary}</span>
            </p>
          </div>
          <div className="mt-6">
            <h3 className="text-base font-semibold text-ink">Membership terms and declaration</h3>
            {terms ? (
              <>
                <p className="mt-1 text-sm text-ink-muted">Version: {terms.version_label}</p>
                <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-border bg-white p-4 text-sm">
                  <p className="font-medium text-ink">{terms.title}</p>
                  <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink">{terms.body}</p>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-red-800">
                Membership terms have not been configured yet. Please contact the club before submitting.
              </p>
            )}
            <label className="mt-4 flex items-start gap-2 text-sm text-ink">
              <input type="checkbox" name="terms_accepted" className="mt-0.5" disabled={!terms} />
              {termsLabel}
            </label>
          </div>
      </div>

      {submitErrors.length > 0 || state?.error || stepError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          {submitErrors.length > 0 ? (
            <>
              <p className="font-medium">
                {step === STEPS.length
                  ? "Please fix the following before submitting:"
                  : "Please fix the following before continuing:"}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {submitErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </>
          ) : null}
          {stepError && submitErrors.length === 0 ? <p>{stepError}</p> : null}
          {state?.error ? <p className={submitErrors.length > 0 || stepError ? "mt-2" : ""}>{state.error}</p> : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface-alt"
          >
            Back
          </button>
        ) : null}
        {step < STEPS.length ? (
          <button
            type="button"
            onClick={goNext}
            disabled={step === 1 && !registrationPath}
            className={cn(btnPrimary, focusRing, tapTarget, "rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-60")}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitApplication}
            disabled={pending || !terms}
            className={cn(btnPrimary, focusRing, tapTarget, "rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-60")}
          >
            {pending ? "Submitting..." : "Submit application"}
          </button>
        )}
      </div>

      <p className="text-sm text-ink-muted">
        People and drivers are usually created through this application. You can also{" "}
        <Link href="/account/people" className="font-medium text-brand hover:text-brand-hover">
          manage people & drivers
        </Link>{" "}
        separately.
      </p>
    </form>
  );
}
