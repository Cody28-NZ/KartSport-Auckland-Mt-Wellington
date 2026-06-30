# KartSport Auckland Mt Wellington Website

Public brochureware website for **KartSport Auckland Mt Wellington** at Sir Colin Giltrap Raceway, Colin Dale Park.

This is a static Next.js site built from structured TypeScript data files. It is designed for production launch while clearly marking operational details that still need club confirmation.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Static content in `/data`
- No database, CMS, login, bookings or payments in this phase

## What is included

- Full public route structure (Start Karting, Pathway, Practice, Race at Auckland, Track, Calendar, Results, News, Sponsors, Volunteers, Documents, About, Contact, FAQ, Glossary, Search)
- Data-driven pages and reusable components
- Pathway learning hub with 7 levels and 23 articles
- Sample events, notices, news, sponsors and track status content
- Responsive header with mega menus and mobile navigation
- SEO metadata and placeholder SVG images

## What is intentionally not included yet

- Member portal / login
- Practice booking system
- Race entry platform integration
- Payments (Stripe or similar)
- Admin dashboard or CMS
- Supabase or other backend
- Working contact form backend

Future CTA placeholders may reference these features without implying they currently work.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## Content model overview

Shared types live in `/types/content.ts`.

Main data files:

| File | Purpose |
|------|---------|
| `data/pages.ts` | Core page copy and sections |
| `data/navigation.ts` | Header, utility and footer navigation |
| `data/pathway.ts` | Pathway levels and articles |
| `data/guides.ts` | Long-form guide pages |
| `data/faqs.ts` | FAQ content |
| `data/glossary.ts` | Glossary terms |
| `data/checklists.ts` | Practical checklists |
| `data/classes.ts` | Class profile placeholders |
| `data/costs.ts` | Cost category placeholders |
| `data/events.ts` | Sample calendar events |
| `data/notices.ts` | Sample site notices |
| `data/trackStatus.ts` | Track status and closures |
| `data/venue.ts` | Venue facts |
| `data/trackGuide.ts` | Track guide sections |
| `data/sponsors.ts` | Sponsor placeholders |
| `data/documents.ts` | Document and official link placeholders |
| `data/news.ts` | Sample news posts |
| `data/contacts.ts` | Contact routing placeholders |
| `data/ctaCards.ts` | Reusable CTA cards |
| `data/media.ts` | Image registry (paths, alt text, usage, status) |

## Club photography and images

### Folder structure

Approved photos belong in `/public/images/` by section:

| Folder | Use |
|--------|-----|
| `/public/images/hero` | Homepage and page hero images |
| `/public/images/track` | Track, circuit and aerial shots |
| `/public/images/pathway` | Beginner and Pathway content |
| `/public/images/race-day` | Grid, racing and club days |
| `/public/images/practice` | Practice sessions |
| `/public/images/venue` | Colin Dale Park and facilities |
| `/public/images/sponsors` | Approved sponsor logos (when supplied) |
| `/public/images/news` | News and event photography |
| `/public/images/placeholders` | Temporary SVG panels until photos are approved |

### Naming convention

```
kartsport-auckland-mt-wellington-[section]-[description].jpg
```

Examples:

- `kartsport-auckland-mt-wellington-hero-pack-racing.jpg`
- `kartsport-auckland-mt-wellington-track-wide.jpg`
- `kartsport-auckland-mt-wellington-pathway-briefing.jpg`
- `kartsport-auckland-mt-wellington-race-day-grid.jpg`

### Recommended sizes

| Use | Size |
|-----|------|
| Hero | 2400 × 1350 |
| Section wide | 1600 × 900 |
| Cards / news | 1200 × 800 |
| Square / logo | 800 × 800 |

### Replacing a placeholder with a real photo

1. Add the approved `.jpg` or `.webp` file to the correct `/public/images/[section]/` folder using the naming convention above.
2. Open `/data/media.ts` and find the matching record by `id` (e.g. `home-hero-pack-racing`).
3. Update `src` to the new path, e.g. `/images/hero/kartsport-auckland-mt-wellington-hero-pack-racing.jpg`.
4. Update `alt`, `title`, `credit` and set `status` to `"approved"`.
5. Run `npm run build` to verify.

The site reads images through `/data/media.ts` and the `MediaImage` component. Components reference images by `id`, not hardcoded paths.

### Image status values

| Status | Meaning |
|--------|---------|
| `approved` | Club-approved photography in use |
| `placeholder` | SVG or temporary visual |
| `needs-replacement` | Placeholder should be swapped soon |
| `to-confirm` | Awaiting committee approval |

Internal caption text in the registry may note *“Image to be replaced with approved club photography”* - this is not shown on the public site.

## Editing content

1. Update the relevant file in `/data`.
2. Keep `status`, `lastReviewed` and `todos` accurate for content still to confirm.
3. Do not publish exact fees, ages, class rules or operational processes without club approval.
4. Link to KartSport NZ as the source of truth for licences, rules and official forms.

## Legacy placeholder SVGs

Older SVG files remain in `/public/placeholders` for reference. New editorial placeholders live in `/public/images/placeholders` and are registered in `/data/media.ts`.

Replace placeholders with approved club photography when ready.

## TODO checklist before real launch

- [ ] Confirm official KartSport NZ licensing URL
- [ ] Confirm official KartSport NZ manual/rules URL
- [ ] Confirm membership process and fees
- [ ] Confirm practice process, payment and eligibility
- [ ] Confirm race entry platform, fees and deadlines
- [ ] Confirm Sir Colin Giltrap Raceway address, track length, facilities, parking and corner names
- [ ] Confirm active local classes and eligibility
- [ ] Confirm sponsor packages and approved logos
- [ ] Confirm volunteer roles and official training links
- [ ] Confirm contact email routing and privacy wording
- [ ] Replace sample news/events/notices with live content
- [ ] Remove or resolve all `to confirm` operational details

## Future phase notes

The data model includes stable IDs, slugs and optional `clubId` fields so content can later move to a CMS or database. Planned future features:

- Member portal with login
- Online practice bookings
- Race entry and payment flows
- Admin tools for track status, results, documents and sponsors
- Contact form backend and enquiry routing

## Naming conventions

- Public brand: **KartSport Auckland Mt Wellington**
- Learning hub: **Pathway** (`/pathway`)
- Intro programme: **Pathway to Karting** (`/start-karting/pathway-to-karting`)
- Do not use legacy "Academy" naming in public UI or routes
