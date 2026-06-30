# Backend Phase 1 — Supabase foundation

This phase adds Supabase authentication, database schema, seed data, RLS policies and backend-ready models. It does **not** include payments, full admin UI, or public practice/race registration flows yet.

## Supabase setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy the project URL and anon public key.
3. Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run migrations manually in the Supabase SQL editor (in order):
   - `supabase/migrations/001_initial_platform_schema.sql`
   - `supabase/migrations/002_seed_options_and_products.sql`

Alternatively, link the Supabase CLI and run `supabase db push` when the CLI is configured.

5. In Supabase Auth settings, configure site URL and redirect URLs for local development (`http://localhost:3000`).

6. Promote an admin user after first registration:

```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```

Or insert into `admin_roles`:

```sql
insert into public.admin_roles (user_id, role, active)
select id, 'admin', true from public.profiles where email = 'you@example.com';
```

## Environment variables

| Variable | Where used | Notes |
|----------|------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | Public |

Never expose the service role key in the browser.

## Tables created

- `profiles` — one row per auth user
- `drivers`, `guardians`, `driver_licences`, `driver_karts`
- `option_sets`, `option_values`
- `membership_products`, `membership_applications`, `membership_application_items`
- `practice_sessions`, `practice_products`, `practice_registrations`, `practice_registration_items`
- `race_events`, `race_entry_products`, `race_entries`, `race_entry_items`
- `terms_versions`, `accepted_terms`
- `admin_roles`

## Seed data

Migration `002_seed_options_and_products.sql` seeds:

- Kart classes, KSNZ licence types/ratings, clubs, volunteer roles (TODO: confirm volunteer values)
- Membership, practice and race entry products
- Placeholder active terms for membership, practice and race entry

## RLS summary

- Users manage their own profile, drivers, guardians, licences and karts
- Users insert/select their own membership applications, practice registrations and race entries
- Active option values, products, sessions, events and terms are publicly readable
- Admin write access uses `public.is_admin()` (profile flag or active `admin_roles` row)
- `admin_roles` is admin-only

## App routes added

| Route | Purpose |
|-------|---------|
| `/login` | Email/password sign in |
| `/register` | Create account |
| `/account` | Protected account summary |
| `/account/drivers` | Manage drivers |
| `/admin/exports/practice` | Admin CSV export (protected) |
| `/admin/exports/race-entries` | Admin CSV export (protected) |

If Supabase env vars are missing, auth pages show a developer setup notice and the public site continues to work.

## CSV exports

Admin-only route handlers return CSV downloads:

- `/admin/exports/practice`
- `/admin/exports/race-entries`

Requires an authenticated admin user.

## Code locations

- Supabase clients: `lib/supabase/`
- Auth helpers: `lib/supabase/auth.ts`
- Data helpers: `lib/data/`
- CSV helpers: `lib/export/csv.ts`
- TypeScript interfaces: `types/database.ts` (replace with generated types later)

## Future phases

1. Practice registration UI wired to `practice_sessions` and `practice_registrations`
2. Race entry UI wired to `race_events` and `race_entries`
3. Membership application UI
4. Admin dashboard (events, sessions, exports, payment status)
5. Form builder / dynamic fields (if needed)
6. External payment handoff integration (Stripe, Windcave, Xero, Sporty, etc.)

## Manual checks after setup

- Register a test user and confirm a `profiles` row is created
- Add a driver under `/account/drivers`
- For a junior DOB, confirm guardian fields are required
- Confirm admin CSV routes return 403 for non-admin users
