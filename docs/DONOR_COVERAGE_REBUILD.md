# Donor coverage rebuild — October 5, 2026

Published independently sourced provider records; historical Google Places records remain quarantined. Their location fields were not reused or relabeled.

Live totals after this pass: 716 plasma center listings, 15 sperm branch listings, 40 egg donor city service areas. The plasma/sperm importer published 713 centers plus 13 branches; five original Atlanta listings remain active. Coverage currently spans 45 states, not every category in all 50 states. No verified listings in this pass for Alaska, Hawaii, Connecticut, New Hampshire or Vermont.

The original CSL Plasma and BioLife sitemaps provide individual center pages; original provider metadata supplies US addresses and coordinates. Octapharma's original directory supplies active center metadata. California Cryobank and Fairfax Cryobank publish branch addresses; US Census address geocoding supplies coordinates. No Google Places or Google geocoding requests are used.

Original sources:

- https://www.cslplasma.com/sitemap.xml and individual /center/ pages; eligibility/payment https://www.cslplasma.com/faq
- https://www.biolifeplasma.com/sitemap.xml and individual /locations/ pages; eligibility /donation-process/who-can-donate and payment /donation-process/faqs
- https://www.octapharmaplasma.com/plasma-donation-centers/ and /new-donors/
- https://www.spermbank.com/locations/ and /about/faqs
- https://fairfaxcryobank.com/locations and /become-a-donor
- https://www.fairfaxeggbank.com/locations/, /egg-donor-requirements/ and /egg-donor-faqs/ reviewed through the source reader; direct HTTP fetches are blocked and were not bypassed.

Fairfax EggBank publishes partner-clinic cities without street addresses. Forty unambiguous Census city representative points are recorded as **service areas**, with approximate distance labels. They are excluded from facility map pins and transit directions. Their actual appointment address must be confirmed with the provider. Ambiguous geographic entries are skipped rather than guessed. No per-cycle payment is inferred from the provider's multi-cycle maximum.

Verified against the live nearby RPC for Harrisburg (40.2732, -76.8867), radius 100 miles: 32 plasma centers, one sperm branch and four egg service areas. Camp Hill BioLife is inside the smaller local radius. Public-site verification is also required to ensure metadata and public access work.

Maintenance scripts: `scripts/publish-provider-directory.mjs` defaults to a dry run; `--apply` publishes validated locations. `--sperm-only` scopes publication to the donor branches. Source cache expires after 24 hours. `scripts/publish-egg-service-areas.mjs --apply` publishes the explicitly reviewed snapshot; the snapshot expires after 30 days and requires a new original-source review. No scheduled automation was added.

These factual source checks do not certify licensing, legal compliance, provider endorsement, clinical eligibility, acceptance or payment. Provider-directory usage and historical restricted-data retention still need the review described in LEGAL_LAUNCH_REVIEW.md.
