// TODO: Replace with generated types from Supabase CLI after connecting the project.

export type MembershipStatus =
  | "unknown"
  | "pending"
  | "active"
  | "expired"
  | "social"
  | "non_member"
  | "life_member";

export type PaymentStatus =
  | "not_required"
  | "pending_external_payment"
  | "paid_external"
  | "unpaid"
  | "refunded"
  | "cancelled";

export type RegistrationStatus = "draft" | "submitted" | "cancelled" | "withdrawn";

export type TrackAvailabilityStatus =
  | "practice_open"
  | "race_day"
  | "closed"
  | "private_hire"
  | "maintenance"
  | "to_confirm";

export type TermsContext = "membership" | "practice" | "race_entry";

export interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  street_address: string | null;
  suburb: string | null;
  town_city: string | null;
  postcode: string | null;
  occupation: string | null;
  membership_status: MembershipStatus;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  owner_user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string | null;
  phone: string | null;
  street_address: string | null;
  suburb: string | null;
  town_city: string | null;
  postcode: string | null;
  is_primary_driver: boolean;
  is_active: boolean;
  default_class_id: string | null;
  default_kart_number: string | null;
  default_race_number: string | null;
  default_transponder_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Guardian {
  id: string;
  driver_id: string;
  guardian_number: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  street_address: string | null;
  occupation: string | null;
  relationship: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface OptionValue {
  id: string;
  option_set_id: string;
  value: string;
  label: string;
  description: string | null;
  sort_order: number;
  active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PracticeSession {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  availability_status: TrackAvailabilityStatus;
  registration_open: boolean;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PracticeRegistration {
  id: string;
  practice_session_id: string;
  user_id: string;
  driver_id: string;
  class_id: string | null;
  kart_number: string | null;
  licence_type_id: string | null;
  licence_number: string | null;
  licence_confirmed_green: boolean;
  under_16_school_day: boolean;
  school_notice_file_path: string | null;
  status: RegistrationStatus;
  payment_status: PaymentStatus;
  amount_due: number;
  external_payment_reference: string | null;
  payment_note: string | null;
  terms_accepted: boolean;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface RaceEvent {
  id: string;
  title: string;
  event_date: string;
  starts_at: string | null;
  ends_at: string | null;
  registration_open: boolean;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RaceEntry {
  id: string;
  race_event_id: string;
  user_id: string;
  driver_id: string;
  class_id: string | null;
  race_number: string | null;
  ksnz_licence_number: string | null;
  licence_rating_id: string | null;
  club_id: string | null;
  transponder_number: string | null;
  transponder_hire_required: boolean;
  status: RegistrationStatus;
  payment_status: PaymentStatus;
  amount_due: number;
  external_payment_reference: string | null;
  payment_note: string | null;
  terms_accepted: boolean;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface DriverLicence {
  id: string;
  driver_id: string;
  licence_type_id: string | null;
  licence_rating_id: string | null;
  licence_number: string | null;
  issuing_club_id: string | null;
  licence_confirmed_green: boolean;
  expires_on: string | null;
  created_at: string;
  updated_at: string;
}

export interface DriverKart {
  id: string;
  driver_id: string;
  kart_number: string | null;
  transponder_number: string | null;
  class_id: string | null;
  notes: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface MembershipProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MembershipApplication {
  id: string;
  user_id: string;
  driver_id: string | null;
  season_label: string;
  is_junior: boolean;
  primary_family_member_first_name: string | null;
  primary_family_member_last_name: string | null;
  primary_class_id: string | null;
  secondary_class_id: string | null;
  applicant_occupation: string | null;
  volunteer_interest: string | null;
  status: RegistrationStatus;
  payment_status: PaymentStatus;
  amount_due: number;
  external_payment_reference: string | null;
  payment_note: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface MembershipApplicationItem {
  id: string;
  application_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export interface TermsVersion {
  id: string;
  context: TermsContext;
  version_label: string;
  title: string;
  body: string;
  active: boolean;
  created_at: string;
}
