# Nationwide discovery

Public radius search supports any US location using the existing PostGIS query. ZIP search and device location need no additional geocoding credential; production city-name search requires OPEN_METEO_API_KEY.

The review page imports recruiting ClinicalTrials.gov studies across the United States. Every geocoded US facility is considered, including Alaska and Hawaii. Compensation remains null. New records stay pending review. Requests save at most 20 facility records and return a continuation cursor; the review screen resumes saved progress. Existing approvals are preserved.

The scheduled job uses the existing sync-state row and lock (historical ID `atlanta`) so no SQL migration is required. Its new `us:` cursor prefix prevents reuse of an old Atlanta-only registry cursor. Refresh checks no longer apply the Atlanta radius.

Donation facility discovery supports each of the 50 states, or a sequential all-state pass, using Google Places. Add GOOGLE_PLACES_API_KEY as a sensitive server-only Vercel Production variable and redeploy before using this feature. Enable Places API (New) in Google Cloud and configure billing and quotas. The importer retrieves the first 20 results per category/state; this is a discovery pass, not an exhaustive directory. These records have NEEDS_SOURCE status, null compensation, and remain invisible until original provider terms are added and approved. Existing sourced Atlanta donation programs remain available.

After deployment, open Review listings to start nationwide import. Keep the page open. If the import pauses after 100 requests, click Sync listings to resume. Approve reviewed sources to publish them. More states supported does not mean reviewed listings exist in every ZIP code.
