-- Phase 1: KartSport Auckland Mt Wellington platform schema

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.membership_status as enum (
  'unknown',
  'pending',
  'active',
  'expired',
  'social',
  'non_member',
  'life_member'
);

create type public.payment_status as enum (
  'not_required',
  'pending_external_payment',
  'paid_external',
  'unpaid',
  'refunded',
  'cancelled'
);

create type public.registration_status as enum (
  'draft',
  'submitted',
  'cancelled',
  'withdrawn'
);

create type public.track_availability_status as enum (
  'practice_open',
  'race_day',
  'closed',
  'private_hire',
  'maintenance',
  'to_confirm'
);

create type public.terms_context as enum (
  'membership',
  'practice',
  'race_entry'
);

-- ---------------------------------------------------------------------------
-- Shared triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Option sets (before drivers FK references)
-- ---------------------------------------------------------------------------

create table public.option_sets (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label text not null,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.option_values (
  id uuid primary key default gen_random_uuid(),
  option_set_id uuid not null references public.option_sets(id) on delete cascade,
  value text not null,
  label text not null,
  description text,
  sort_order integer not null default 0,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (option_set_id, value)
);

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  street_address text,
  suburb text,
  town_city text,
  postcode text,
  occupation text,
  membership_status public.membership_status not null default 'unknown',
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Drivers and related
-- ---------------------------------------------------------------------------

create table public.drivers (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  email text,
  phone text,
  street_address text,
  suburb text,
  town_city text,
  postcode text,
  is_primary_driver boolean not null default false,
  is_active boolean not null default true,
  default_class_id uuid references public.option_values(id),
  default_kart_number text,
  default_race_number text,
  default_transponder_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guardians (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.drivers(id) on delete cascade,
  guardian_number integer not null default 1,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  street_address text,
  occupation text,
  relationship text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.driver_licences (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.drivers(id) on delete cascade,
  licence_type_id uuid references public.option_values(id),
  licence_rating_id uuid references public.option_values(id),
  licence_number text,
  issuing_club_id uuid references public.option_values(id),
  licence_confirmed_green boolean not null default false,
  expires_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.driver_karts (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.drivers(id) on delete cascade,
  kart_number text,
  transponder_number text,
  class_id uuid references public.option_values(id),
  notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Membership
-- ---------------------------------------------------------------------------

create table public.membership_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  driver_id uuid references public.drivers(id),
  season_label text not null,
  is_junior boolean not null default false,
  primary_family_member_first_name text,
  primary_family_member_last_name text,
  primary_class_id uuid references public.option_values(id),
  secondary_class_id uuid references public.option_values(id),
  applicant_occupation text,
  volunteer_interest text,
  status public.registration_status not null default 'submitted',
  payment_status public.payment_status not null default 'pending_external_payment',
  amount_due numeric(10, 2) not null default 0,
  external_payment_reference text,
  payment_note text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.membership_application_items (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.membership_applications(id) on delete cascade,
  product_id uuid references public.membership_products(id),
  product_name_snapshot text not null,
  unit_price_snapshot numeric(10, 2) not null,
  quantity integer not null default 1,
  line_total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Practice
-- ---------------------------------------------------------------------------

create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  availability_status public.track_availability_status not null default 'practice_open',
  registration_open boolean not null default true,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.practice_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.practice_registrations (
  id uuid primary key default gen_random_uuid(),
  practice_session_id uuid not null references public.practice_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  driver_id uuid not null references public.drivers(id) on delete cascade,
  class_id uuid references public.option_values(id),
  kart_number text,
  licence_type_id uuid references public.option_values(id),
  licence_number text,
  licence_confirmed_green boolean not null default false,
  under_16_school_day boolean not null default false,
  school_notice_file_path text,
  status public.registration_status not null default 'submitted',
  payment_status public.payment_status not null default 'pending_external_payment',
  amount_due numeric(10, 2) not null default 0,
  external_payment_reference text,
  payment_note text,
  terms_accepted boolean not null default false,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.practice_registration_items (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.practice_registrations(id) on delete cascade,
  product_id uuid references public.practice_products(id),
  product_name_snapshot text not null,
  unit_price_snapshot numeric(10, 2) not null,
  quantity integer not null default 1,
  line_total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Race
-- ---------------------------------------------------------------------------

create table public.race_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  starts_at timestamptz,
  ends_at timestamptz,
  registration_open boolean not null default true,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.race_entry_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.race_entries (
  id uuid primary key default gen_random_uuid(),
  race_event_id uuid not null references public.race_events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  driver_id uuid not null references public.drivers(id) on delete cascade,
  class_id uuid references public.option_values(id),
  race_number text,
  ksnz_licence_number text,
  licence_rating_id uuid references public.option_values(id),
  club_id uuid references public.option_values(id),
  transponder_number text,
  transponder_hire_required boolean not null default false,
  status public.registration_status not null default 'submitted',
  payment_status public.payment_status not null default 'pending_external_payment',
  amount_due numeric(10, 2) not null default 0,
  external_payment_reference text,
  payment_note text,
  terms_accepted boolean not null default false,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.race_entry_items (
  id uuid primary key default gen_random_uuid(),
  race_entry_id uuid not null references public.race_entries(id) on delete cascade,
  product_id uuid references public.race_entry_products(id),
  product_name_snapshot text not null,
  unit_price_snapshot numeric(10, 2) not null,
  quantity integer not null default 1,
  line_total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Terms and admin
-- ---------------------------------------------------------------------------

create table public.terms_versions (
  id uuid primary key default gen_random_uuid(),
  context public.terms_context not null,
  version_label text not null,
  title text not null,
  body text not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (context, version_label)
);

create table public.accepted_terms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  driver_id uuid references public.drivers(id) on delete cascade,
  terms_version_id uuid not null references public.terms_versions(id),
  related_table text,
  related_id uuid,
  accepted_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

create table public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin', 'race_admin', 'practice_admin', 'membership_admin', 'read_only')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and is_admin = true
  )
  or exists (
    select 1
    from public.admin_roles
    where user_id = auth.uid() and active = true
  );
$$;

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_option_sets_updated_at before update on public.option_sets
  for each row execute function public.set_updated_at();
create trigger set_option_values_updated_at before update on public.option_values
  for each row execute function public.set_updated_at();
create trigger set_drivers_updated_at before update on public.drivers
  for each row execute function public.set_updated_at();
create trigger set_guardians_updated_at before update on public.guardians
  for each row execute function public.set_updated_at();
create trigger set_driver_licences_updated_at before update on public.driver_licences
  for each row execute function public.set_updated_at();
create trigger set_driver_karts_updated_at before update on public.driver_karts
  for each row execute function public.set_updated_at();
create trigger set_membership_products_updated_at before update on public.membership_products
  for each row execute function public.set_updated_at();
create trigger set_membership_applications_updated_at before update on public.membership_applications
  for each row execute function public.set_updated_at();
create trigger set_practice_sessions_updated_at before update on public.practice_sessions
  for each row execute function public.set_updated_at();
create trigger set_practice_products_updated_at before update on public.practice_products
  for each row execute function public.set_updated_at();
create trigger set_practice_registrations_updated_at before update on public.practice_registrations
  for each row execute function public.set_updated_at();
create trigger set_race_events_updated_at before update on public.race_events
  for each row execute function public.set_updated_at();
create trigger set_race_entry_products_updated_at before update on public.race_entry_products
  for each row execute function public.set_updated_at();
create trigger set_race_entries_updated_at before update on public.race_entries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.drivers enable row level security;
alter table public.guardians enable row level security;
alter table public.driver_licences enable row level security;
alter table public.driver_karts enable row level security;
alter table public.option_sets enable row level security;
alter table public.option_values enable row level security;
alter table public.membership_products enable row level security;
alter table public.membership_applications enable row level security;
alter table public.membership_application_items enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.practice_products enable row level security;
alter table public.practice_registrations enable row level security;
alter table public.practice_registration_items enable row level security;
alter table public.race_events enable row level security;
alter table public.race_entry_products enable row level security;
alter table public.race_entries enable row level security;
alter table public.race_entry_items enable row level security;
alter table public.terms_versions enable row level security;
alter table public.accepted_terms enable row level security;
alter table public.admin_roles enable row level security;

-- profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_select_admin" on public.profiles for select using (public.is_admin());
create policy "profiles_update_admin" on public.profiles for update using (public.is_admin());

-- drivers
create policy "drivers_all_own" on public.drivers for all
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());
create policy "drivers_select_admin" on public.drivers for select using (public.is_admin());
create policy "drivers_update_admin" on public.drivers for update using (public.is_admin());

-- guardians
create policy "guardians_all_own" on public.guardians for all
  using (exists (select 1 from public.drivers d where d.id = driver_id and d.owner_user_id = auth.uid()))
  with check (exists (select 1 from public.drivers d where d.id = driver_id and d.owner_user_id = auth.uid()));
create policy "guardians_admin" on public.guardians for all using (public.is_admin()) with check (public.is_admin());

-- driver_licences
create policy "driver_licences_all_own" on public.driver_licences for all
  using (exists (select 1 from public.drivers d where d.id = driver_id and d.owner_user_id = auth.uid()))
  with check (exists (select 1 from public.drivers d where d.id = driver_id and d.owner_user_id = auth.uid()));
create policy "driver_licences_admin" on public.driver_licences for all using (public.is_admin()) with check (public.is_admin());

-- driver_karts
create policy "driver_karts_all_own" on public.driver_karts for all
  using (exists (select 1 from public.drivers d where d.id = driver_id and d.owner_user_id = auth.uid()))
  with check (exists (select 1 from public.drivers d where d.id = driver_id and d.owner_user_id = auth.uid()));
create policy "driver_karts_admin" on public.driver_karts for all using (public.is_admin()) with check (public.is_admin());

-- option_sets / option_values
create policy "option_sets_select_active" on public.option_sets for select using (true);
create policy "option_sets_admin" on public.option_sets for all using (public.is_admin()) with check (public.is_admin());
create policy "option_values_select_active" on public.option_values for select using (active = true);
create policy "option_values_admin" on public.option_values for all using (public.is_admin()) with check (public.is_admin());

-- products
create policy "membership_products_select" on public.membership_products for select using (active = true);
create policy "membership_products_admin" on public.membership_products for all using (public.is_admin()) with check (public.is_admin());
create policy "practice_products_select" on public.practice_products for select using (active = true);
create policy "practice_products_admin" on public.practice_products for all using (public.is_admin()) with check (public.is_admin());
create policy "race_entry_products_select" on public.race_entry_products for select using (active = true);
create policy "race_entry_products_admin" on public.race_entry_products for all using (public.is_admin()) with check (public.is_admin());

-- membership applications
create policy "membership_applications_select_own" on public.membership_applications for select using (user_id = auth.uid());
create policy "membership_applications_insert_own" on public.membership_applications for insert with check (user_id = auth.uid());
create policy "membership_applications_update_own" on public.membership_applications for update
  using (user_id = auth.uid() and status in ('draft', 'cancelled'))
  with check (user_id = auth.uid());
create policy "membership_applications_admin" on public.membership_applications for all using (public.is_admin()) with check (public.is_admin());

create policy "membership_application_items_select_own" on public.membership_application_items for select
  using (exists (select 1 from public.membership_applications a where a.id = application_id and a.user_id = auth.uid()));
create policy "membership_application_items_insert_own" on public.membership_application_items for insert
  with check (exists (select 1 from public.membership_applications a where a.id = application_id and a.user_id = auth.uid()));
create policy "membership_application_items_admin" on public.membership_application_items for all using (public.is_admin()) with check (public.is_admin());

-- practice sessions / registrations
create policy "practice_sessions_select" on public.practice_sessions for select using (active = true);
create policy "practice_sessions_admin" on public.practice_sessions for all using (public.is_admin()) with check (public.is_admin());

create policy "practice_registrations_select_own" on public.practice_registrations for select using (user_id = auth.uid());
create policy "practice_registrations_insert_own" on public.practice_registrations for insert with check (user_id = auth.uid());
create policy "practice_registrations_admin" on public.practice_registrations for all using (public.is_admin()) with check (public.is_admin());

create policy "practice_registration_items_select_own" on public.practice_registration_items for select
  using (exists (select 1 from public.practice_registrations r where r.id = registration_id and r.user_id = auth.uid()));
create policy "practice_registration_items_insert_own" on public.practice_registration_items for insert
  with check (exists (select 1 from public.practice_registrations r where r.id = registration_id and r.user_id = auth.uid()));
create policy "practice_registration_items_admin" on public.practice_registration_items for all using (public.is_admin()) with check (public.is_admin());

-- race events / entries
create policy "race_events_select" on public.race_events for select using (active = true);
create policy "race_events_admin" on public.race_events for all using (public.is_admin()) with check (public.is_admin());

create policy "race_entries_select_own" on public.race_entries for select using (user_id = auth.uid());
create policy "race_entries_insert_own" on public.race_entries for insert with check (user_id = auth.uid());
create policy "race_entries_admin" on public.race_entries for all using (public.is_admin()) with check (public.is_admin());

create policy "race_entry_items_select_own" on public.race_entry_items for select
  using (exists (select 1 from public.race_entries e where e.id = race_entry_id and e.user_id = auth.uid()));
create policy "race_entry_items_insert_own" on public.race_entry_items for insert
  with check (exists (select 1 from public.race_entries e where e.id = race_entry_id and e.user_id = auth.uid()));
create policy "race_entry_items_admin" on public.race_entry_items for all using (public.is_admin()) with check (public.is_admin());

-- terms
create policy "terms_versions_select_active" on public.terms_versions for select using (active = true);
create policy "terms_versions_admin" on public.terms_versions for all using (public.is_admin()) with check (public.is_admin());

create policy "accepted_terms_select_own" on public.accepted_terms for select using (user_id = auth.uid());
create policy "accepted_terms_insert_own" on public.accepted_terms for insert with check (user_id = auth.uid());
create policy "accepted_terms_admin" on public.accepted_terms for select using (public.is_admin());

-- admin_roles
create policy "admin_roles_admin" on public.admin_roles for all using (public.is_admin()) with check (public.is_admin());

-- Indexes for common lookups
create index drivers_owner_user_id_idx on public.drivers (owner_user_id);
create index guardians_driver_id_idx on public.guardians (driver_id);
create index practice_registrations_session_id_idx on public.practice_registrations (practice_session_id);
create index practice_registrations_user_id_idx on public.practice_registrations (user_id);
create index race_entries_event_id_idx on public.race_entries (race_event_id);
create index race_entries_user_id_idx on public.race_entries (user_id);
create index option_values_set_id_idx on public.option_values (option_set_id);
