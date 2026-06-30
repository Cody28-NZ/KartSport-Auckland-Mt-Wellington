# Backend Phase 1 — Supabase foundation

This phase adds Supabase authentication, database schema, seed data, RLS policies and account/membership models. It does **not** include payments, full admin UI, or public practice/race registration flows yet.

## Important: schema reset required

The account model was refactored from a driver-first model to a **people / person** model. The old `drivers`, `guardians`, and `driver_karts` tables were removed from `001_initial_platform_schema.sql`.

If you previously applied the old schema to Supabase, **reset the database** and rerun migrations:

1. Supabase Dashboard → Project Settings → Database → Reset database (or drop and recreate the project for local dev)
2. Run migrations in order:
   - `supabase/migrations/001_initial_platform_schema.sql`
   - `supabase/migrations/002_seed_options_and_products.sql`

There is no production member data to preserve at this stage.

## Data model overview

### Account holder (`profiles`)

- One row per Supabase auth user (login owner)
- Parents/guardians typically own the login for junior drivers
- `/account/profile` edits these details only

### People (`people`)

- Any person attached to an account: adult driver, junior driver, parent/guardian, social member, pit member, visiting driver
- `is_driver` indicates whether they drive on track
- `is_account_holder` can mirror the login owner as a person record
- `person_type` enum describes the role

### Relationships (`person_relationships`)

- Links people together (e.g. parent/guardian → junior driver)
- Used so guardian details prefill for future practice/race entry
- `relationship_type`: parent, guardian, caregiver, account_holder_for, family_member

### Driver profiles (`driver_profiles`)

- Only for people who drive (`is_driver = true`)
- Kart class, numbers, transponder, default club

### Licences (`driver_licences`)

- References `person_id` (not a separate drivers table)
- **Day licence** is a licence rating option, not a membership product

### Memberships (`memberships`)

- Current membership records per person (admin-populated after approval/payment later)
- Created from applications via `created_from_application_id`

### Membership applications (`membership_applications`)

- Applies to a **person** via `applicant_person_id`
- `membership_intent` enum: racing member, family member, social, pit, life/honorary, visiting driver, parent/guardian only
- `primary_driver_person_id` when the applicant drives
- Social and pit are **non-driving**
- Visiting driver is **not** full AKL-MTW membership

### Practice / race (prepared, UI not built)

- `practice_registrations` and `race_entries` reference `person_id` and optional `driver_profile_id`
- Support visiting drivers and club members

## Supabase setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy the project URL and anon public key.
3. Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run migrations (see reset note above).
5. Configure Auth site URL and redirect URLs (`http://localhost:3000`).
6. Promote an admin user after first registration:

```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```

## Tables

- `profiles` — auth account holder
- `people`, `person_relationships`, `driver_profiles`, `driver_licences`
- `memberships`, `membership_products`, `membership_applications`, `membership_application_items`
- `option_sets`, `option_values`
- `practice_sessions`, `practice_registrations`, `practice_products`, `practice_registration_items`
- `race_events`, `race_entries`, `race_entry_products`, `race_entry_items`
- `terms_versions`, `accepted_terms`
- `admin_roles`

## RLS summary

- Users manage people, relationships, driver profiles and licences where `owner_user_id = auth.uid()`
- Users insert/select their own membership applications, practice registrations and race entries
- Active options, products, sessions, events and terms are publicly readable
- Admin access via `public.is_admin()`
- Membership records (`memberships`) are read-only for users; admin manages status

## App routes

| Route | Purpose |
|-------|---------|
| `/become-a-member` | Public membership/visitor landing |
| `/login` | Member login |
| `/register` | Create account → membership application |
| `/account` | Dashboard |
| `/account/profile` | Account holder details |
| `/account/people` | People & drivers management |
| `/account/drivers` | Redirects to `/account/people` |
| `/account/membership` | Application list/status |
| `/account/membership/new` | Membership application wizard |
| `/account/onboarding` | Setup guide |

## Code locations

- Supabase: `lib/supabase/`
- People data: `lib/data/people.ts`
- Membership intents: `lib/account/membership-intents.ts`
- Person utils: `lib/people/utils.ts`
- Types: `types/database.ts`

## Future phases

1. Practice registration UI (prefill from people/guardians)
2. Race entry UI
3. Admin dashboard and membership approval
4. External payment handoff

## Manual checks after reset

- Register → redirected to `/account/membership/new`
- Complete wizard for junior member → guardian relationship created
- Add social/pit person under `/account/people` without driver fields
- Confirm `/account/drivers` redirects to `/account/people`
