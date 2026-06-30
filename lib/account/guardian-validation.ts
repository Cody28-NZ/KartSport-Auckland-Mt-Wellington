export interface AccountHolderGuardianFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ManualGuardianFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const ACCOUNT_HOLDER_GUARDIAN_INCOMPLETE_MESSAGE =
  "Please complete the parent/guardian account holder details before continuing.";

export const MANUAL_GUARDIAN_INCOMPLETE_MESSAGE =
  "Please enter guardian first name, last name, email and phone.";

export function isAccountHolderGuardianComplete(fields: AccountHolderGuardianFields): boolean {
  return Boolean(fields.firstName && fields.lastName && fields.email && fields.phone);
}

export function isManualGuardianComplete(fields: ManualGuardianFields): boolean {
  return Boolean(fields.firstName && fields.lastName && fields.email && fields.phone);
}

export function readAccountHolderGuardianFromFormData(formData: FormData, email: string): AccountHolderGuardianFields {
  const formEmail = String(formData.get("holder_email") ?? "").trim();
  return {
    firstName: String(formData.get("holder_first_name") ?? "").trim(),
    lastName: String(formData.get("holder_last_name") ?? "").trim(),
    email: formEmail || email.trim(),
    phone: String(formData.get("holder_phone") ?? "").trim(),
  };
}

export function readManualGuardianFromFormData(formData: FormData): ManualGuardianFields {
  return {
    firstName: String(formData.get("guardian_first_name") ?? "").trim(),
    lastName: String(formData.get("guardian_last_name") ?? "").trim(),
    email: String(formData.get("guardian_email") ?? "").trim(),
    phone: String(formData.get("guardian_phone") ?? "").trim(),
  };
}
