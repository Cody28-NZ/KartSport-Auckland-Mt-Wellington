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
- Default kart class, **kart number**, transponder, default club
- **Kart number** is the club-facing racing number used on membership and driver forms
- There is no separate saved “race number” on driver profiles; an earlier `default_race_number` field was removed during development

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
- `race_entries.kart_number` stores the kart number for the entry (not a separate race number field)

## Supabase setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy the project URL and anon public key.
3. Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run migrations (see reset note above).
5. Configure **Auth → URL Configuration** in the Supabase Dashboard:

   - **Site URL** — your primary app URL (e.g. `http://localhost:3000` for local dev, or `https://YOUR-DOMAIN` in production).
   - **Redirect URLs** — must include every URL Supabase may send users to after email confirmation. Add both local and production callback URLs:

   ```
   http://localhost:3000/auth/callback
   https://YOUR-DOMAIN/auth/callback
   ```

   Signup passes `emailRedirectTo` so confirmation emails return users to `/auth/callback?next=/account/membership/new`, which exchanges the auth code and forwards them into the membership application.

   If confirmation emails still land on the homepage, check **Auth → URL Configuration** and confirm `emailRedirectTo` is set in the signup call (`components/auth/RegisterForm.tsx`).

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

### Membership terms

- Current membership terms are stored in `terms_versions` with `context = membership`.
- The active version is shown in the membership application wizard (`/account/membership/new`).
- When an application is submitted, the accepted terms are **snapshotted** into `accepted_terms` (title, body, version label, accepted-by name, applicant name, and application reference).
- `terms_versions` rows that have been accepted should be treated as **immutable** — create a new version (and deactivate the old one) instead of editing wording that may already be on record.
- Current terms version: **2025-26** (`Membership Terms and Conditions 2025/26`). Confirm wording before launch.
- The provided terms reference **Rosebank Rd Domain** and **31 March 2026** — confirm whether these should be updated before go-live.
- Future email notification to the club secretary/admin after submission is planned but **not built yet** (see `lib/notifications/membership.ts`).
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
| `/login` | Member login (`?next=` for safe post-login redirect) |
| `/register` | Create account → membership application |
| `/auth/callback` | Email confirmation handler → membership or login |
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
5. Email notification to club secretary/admin when a membership application is submitted (`lib/notifications/membership.ts`)

## Manual checks after reset

- `/become-a-member` → create account → see “Check your email” (not a login form)
- Confirm email → lands at `/auth/callback` → redirected to `/account/membership/new`
- `/login?next=/account/membership/new` → after login, lands on membership application
- Logged-in user on `/become-a-member` → “Continue application” card
- Complete wizard for junior member → guardian relationship created
- Add social/pit person under `/account/people` without driver fields
- Confirm `/account/drivers` redirects to `/account/people`
