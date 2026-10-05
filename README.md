# EarnAhead

Next.js 15.5.27, strict TypeScript, Tailwind, TanStack Query, Supabase Auth and PostGIS. No invented listings or compensation.

## Run

1. `npm install`
2. Copy `.env.example` to `.env.local` and enter your Supabase URL and anon key.
3. Run both files in `supabase/migrations/` in numerical order in your Supabase SQL editor.
4. Enable email/password and Google authentication. Set your site URL and allow `/auth/callback` as a redirect.
5. `npm run dev`

Without credentials, the interface runs with explicit empty states. Search by US city or ZIP code, use browser geolocation, or enter latitude, longitude. City lookup uses Open-Meteo/GeoNames, ZIP lookup uses Zippopotam.us. The free Open-Meteo endpoint is for development/non-commercial usage; configure a licensed geocoder before commercial launch. Transit directions open Google Maps.

## Finish the connected Atlanta setup

The project now contains `supabase/finish-setup.sql`: it grants admin access only if the project contains exactly one auth account, then imports 84 source-backed Atlanta facility listings from the first 50 recruiting studies returned by ClinicalTrials.gov. They remain PENDING_REVIEW, inactive, with NULL compensation. This is an initial batch, not a complete registry export. It does not establish that any study pays.

Run `Get-Content .\supabase\finish-setup.sql -Raw | Set-Clipboard` in PowerShell, paste the resulting SQL into Supabase's SQL editor, and Run. Sign out/in to refresh admin claims, then open `/admin`. Review each source before approving. Do not rerun `setup.sql` on an initialized project. The Atlanta import skips previously imported records; admin bootstrap stops if multiple accounts exist.

## Import and review

Set `app_metadata.role` to `admin` for a trusted review/import account using the Supabase dashboard (never user metadata). Set `IMPORTER_ACCESS_TOKEN` to that account's short-lived access token, then run `node scripts/import-trials.mjs 40.7128 -74.0060`. ClinicalTrials.gov cursor pagination is supported. Studies enter PENDING_REVIEW and compensation is always NULL. Review at `/admin`.

Google Places: set GOOGLE_PLACES_API_KEY and run node scripts/import-places.mjs with latitude longitude. Facilities enter NEEDS_SOURCE, with no terms URL or compensation. An admin must review provider terms before publication.

Importer scripts read environment variables. On Node 24, use `node --env-file=.env.local scripts/import-trials.mjs 33.749 -84.388` after supplying IMPORTER_ACCESS_TOKEN for an authenticated admin. `scripts/refresh-trials.mjs` deactivates studies whose registry-wide status stops recruiting; individual facility closures must also be reviewed. Import refresh returns changed registry records to human review. `scripts/export-atlanta.mjs` creates a source-backed SQL import without requiring an admin token.

## Security

RLS restricts profiles, saves, applications, and earnings to their owner. Applications have a database trigger that requires a profile DOB and enforces the listing minimum on insert/update. Listings enforce 18+, or 21+ for egg donation. No eligibility result or health questionnaire is stored. Providers determine final eligibility and handle payment.

## Tests

`npm test` runs 86 tests covering actual sidebar rendering, session events, stale auth requests, account cache isolation, geocoding, validation, HTTP authorization, compensation formatting, and birthday boundaries. `npm run typecheck` and `npm run build` pass. Tests cannot guarantee all possible cases.

`node --env-file=.env.local scripts/check-connection.mjs` verifies the live public radius query and anonymous reads. This passed against the user's connected project. Anonymous reads returning no rows are a smoke check, not a full RLS proof.

Run `supabase/tests/security.sql` in Supabase's SQL editor for transactional age and RLS tests. It creates rollback-only fixtures and rolls everything back. These SQL integration tests have not yet been run against the project. If an assertion fails, the transaction must be rolled back before retrying.

## Current limitations

Google OAuth requires Google provider credentials/configuration in Supabase. Google Places requires a Google API key; none is configured by this work. Database imports/admin bootstrap and the transactional SQL tests require the project's SQL editor. Browser preview verification was denied earlier, so visual verification is based on the user's screenshots and DOM component tests. Next.js was upgraded with user approval to 15.5.27; the current dependency audit reports zero vulnerabilities. Study compensation remains unpublished unless a provider source explicitly supplies it.



## Bulk review, donation programs, and autosave
The admin queue includes Approve all for valid PENDING_REVIEW rows. Missing sources, invalid age/payment ranges, and NEEDS_SOURCE rows are skipped. It preserves every saved compensation amount; it never fabricates payment. Review edits and profile edits autosave when valid. Search coordinates and filters persist locally, separately for each account. Bookmark saves remain explicit and are reflected in the card.
Provider import: copy supabase/donation-programs.sql to Supabase SQL Editor and run it. This adds an optional compensation_basis field and five verified-source, Census-geocoded listings: two Xytex offices, CSL Smyrna, BioLife Morrow, and BioLife Duluth. They enter PENDING_REVIEW. Xytex lists up to $1,400/month with a six-month commitment and at least two weekly visits; plasma pay on the cited pages is unpublished. Sources and coordinates are recorded in supabase/donation-programs-sources.json. Study cards group equivalent source/title/age/payment records, with the nearest facility displayed and other locations accessible in details.

### Result layout and payment comparisons
Explore groups donation programs ahead of clinical research, retaining nearest-first ordering within each section. Payment-period filters persist with the account's search preferences. Highest-pay sorting groups listings by published payment period before ranking: monthly amounts never compete with per-visit or total-program amounts. Unknown periods and unpublished compensation remain separate; no hourly rates or estimated earnings are calculated.

### Imports without SQL
Open `/admin` using an administrator account. The Atlanta source-sync panel imports directly with the signed-in admin's Supabase session and existing RLS; it needs no service-role key. It starts on page open when the last successful sync on that browser is over 24 hours old, or through Sync listings. This is page-triggered automation, not a background scheduler: the app server and browser page must remain running during a sync.

ClinicalTrials.gov imports page through the live recruiting registry, filter individual facilities to 50 miles around Atlanta, and keep compensation null. The donation import uses the five previously researched provider records in `supabase/donation-programs-sources.json`; it does not scrape or periodically reverify provider compensation. All new records stay pending/inactive until approval. Existing records are skipped, preserving reviewed terms. Registry pagination saves a local cursor after each completed page; interrupted pages can safely be retried via stable external IDs and the database uniqueness constraint. Payment-period donation imports require the existing compensation_basis column; the connected project has this column.

Validation: 108 passing tests including administrator authorization, pagination, duplicate avoidance, age/radius filtering, daily page-triggered sync, and interruption recovery. Type checking and production build pass. The authenticated live import is triggered from the user's review page; route and UI tests use mocked external responses.

### Production launch preparation
Password recovery/update pages, own-account deletion, categorical listing reports, reviewer report handling, freshness review, safer research payment labels, protected incremental cron sync with closed-facility retirement, persistent job state/history, health checks, private cache headers, security headers, and CI checks are implemented. The cloud launch migration is required before these database features work. See `docs/LAUNCH.md` for the complete owner handoff and limitations. Tests currently cover 133 cases; real database security tests and production browser/email/backup acceptance remain owner-side checks.

Patched CSS tooling uses Tailwind 4 and PostCSS overrides. Next.js 15.5.27 resolves the previously flagged framework findings; the production dependency security CI gate remains enabled. No production deployment or external monitoring subscription has been created.
