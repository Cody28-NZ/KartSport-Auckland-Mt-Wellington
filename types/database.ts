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

export type PersonType =
  | "account_holder"
  | "adult_driver"
  | "junior_driver"
  | "parent_guardian"
  | "social_member"
  | "pit_member"
  | "visiting_driver"
  | "other";

export type RelationshipType =
  | "parent"
  | "guardian"
  | "caregiver"
  | "account_holder_for"
  | "family_member";

export type MembershipIntent =
  | "racing_practising_member"
  | "additional_family_racing_member"
  | "social_member"
  | "pit_member"
  | "life_honorary_member"
  | "visiting_driver"
  | "parent_guardian_only";

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

export interface Person {
  id: string;
  owner_user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  email: string | null;
  phone: string | null;
  street_address: string | null;
  suburb: string | null;
  town_city: string | null;
  postcode: string | null;
  occupation: string | null;
  person_type: PersonType;
  is_driver: boolean;
  is_account_holder: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonRelationship {
  id: string;
  owner_user_id: string;
  from_person_id: string;
  to_person_id: string;
  relationship_type: RelationshipType;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface DriverProfile {
  id: string;
  person_id: string;
  default_class_id: string | null;
  default_kart_number: string | null;
  default_race_number: string | null;
  default_transponder_number: string | null;
  default_club_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DriverLicence {
  id: string;
  person_id: string;
  licence_type_id: string | null;
  licence_rating_id: string | null;
  licence_number: string | null;
  issuing_club_id: string | null;
  licence_confirmed_green: boolean;
  expires_on: string | null;
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
  person_id: string;
  driver_profile_id: string | null;
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
  person_id: string;
  driver_profile_id: string | null;
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

export interface Membership {
  id: string;
  person_id: string;
  membership_product_id: string | null;
  season_label: string;
  status: MembershipStatus;
  starts_on: string | null;
  ends_on: string | null;
  created_from_application_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MembershipApplication {
  id: string;
  user_id: string;
  applicant_person_id: string | null;
  primary_driver_person_id: string | null;
  membership_intent: MembershipIntent;
  season_label: string;
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
