# Nationwide discovery

The October 5, 2026 coverage pass saved actual clinical-trial facility records in all 50 states and DC. See `nationwide-coverage.json` for the database counts. Newly imported records remain pending review, and registry compensation remains null. Donation coverage is a separate provider-source task; nationwide study coverage does not establish nationwide donation inventory.

For a controlled local continuation, put the service role key in the ignored `.env.local` and run `node scripts/import-nationwide.mjs 20`. It resumes an ignored local checkpoint, processes at most 20 registry pages, preserves existing records, and does not publish listings. Never commit the key.

City coordinates come from the [2025 Census Gazetteer](https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2025.html), bundled in `lib/data/us-places.json`. They represent places, not exact facility addresses. City searches never substitute ZIP or city centroids for imported medical facility coordinates.

Public radius search supports any US location using the existing PostGIS query. ZIP search and device location need no additional geocoding credential; city-name search uses the official 2025 US Census Places Gazetteer across all 50 states plus DC, without an API key. OPEN_METEO_API_KEY is optional for additional place matches.

The review page imports recruiting ClinicalTrials.gov studies across the United States. Every geocoded US facility is considered, including Alaska and Hawaii. Compensation remains null. New records stay pending review. Requests save at most 20 facility records and return a continuation cursor; the review screen resumes saved progress. Existing approvals are preserved.

The scheduled job uses the existing sync-state row and lock (historical ID `atlanta`) so no SQL migration is required. Its new `us:` cursor prefix prevents reuse of an old Atlanta-only registry cursor. Refresh checks no longer apply the Atlanta radius.

Donation facility discovery supports each of the 50 states, or a sequential all-state pass, using Google Places. Add GOOGLE_PLACES_API_KEY as a sensitive server-only Vercel Production variable and redeploy before using this feature. Enable Places API (New) in Google Cloud and configure billing and quotas. The importer retrieves the first 20 results per category/state; this is a discovery pass, not an exhaustive directory. These records have NEEDS_SOURCE status, null compensation, and remain invisible until original provider terms are added and approved. Existing sourced Atlanta donation programs remain available.

After deployment, open Review listings to start nationwide import. Keep the page open. If the import pauses after 100 requests, click Sync listings to resume. Approve reviewed sources to publish them. More states supported does not mean reviewed listings exist in every ZIP code.
