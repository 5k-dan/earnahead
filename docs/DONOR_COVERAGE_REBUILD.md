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

## Remaining-state recruitment and nationwide travel — October 5, 2026
Published 19 reviewed egg recruitment service areas: CT 5, NH 4, VT 9, HI 1. Colchester VT lacks a unique city match and was skipped. NAFG's original CT/NH/VT state pages name these recruitment areas, publish first-time ages 21–29 and $15,000 cycle compensation. NAFG is an agency, not a medical clinic; medical visits may require travel. FIH's original donor page recruits Oahu residents ages 21–28 and publishes $4,000–$6,000 per treatment cycle. City coordinates remain approximate and excluded from clinic map pins.

Sources: https://assistedfertility.com/be-an-egg-donor/connecticut/ ; https://assistedfertility.com/be-an-egg-donor/new-hampshire/ ; https://assistedfertility.com/be-an-egg-donor/vermont/ ; https://www.ivfcenterhawaii.com/3rd-party/become-an-egg-donor/

The separate nationwide travel section links https://www.fairfaxeggbank.com/egg-donor-travel-program/ . The provider recruits across the US, including applicants far from retrieval clinics. No fake Alaska facility, map pin, nearby distance or inferred single-cycle compensation is inserted. Display respects egg category and unknown-pay filters and expires November 5 until manually re-reviewed. All 50 states have an applicant pathway through travel; local facilities or all three donor categories are NOT established in every state. The regional database has facilities or explicit city recruitment coverage in 49 states.

## Published compensation offers — October 5, 2026
Checked 240 original BioLife center URLs. Confirmed center-specific first-month new-donor offers at 239; Webster returned HTTP 308 without a Location header and remains unpublished. Use the explicit center sentence describing first-month pay, not the global up-to-$800 banner or referral bonus. Values are saved with source URLs, check dates and seven-day expiry. API/detail requests recheck these allowlisted center pages daily using a cached server fetch; failed refreshes fall back only while the reviewed offer is unexpired.

Octapharma original new-donor FAQ advertises up to $750 in the first 35 days, explicitly variable by location. Cards label this as provider-wide advertising requiring center confirmation; no numeric per-visit/monthly rate is inserted. Fairfax EggBank's original FAQ advertises up to $60,000 across multiple cycles; this remains separate from single-cycle pay and is not sorted against individual cycle payments. These manually reviewed provider-wide statements expire pending review. Source links appear beside the conditions.

Fairfax sperm $150 per donation visit and California Cryobank $100–$300 per vial-yielding donation remain the published rates. NAFG $15,000 first-time cycle, FIH $4,000–$6,000 cycle and ConceiveAbilities starting $10,000 cycle retain their actual published payment periods. CSL public pages do not confirm a universal or local current rate; no estimate is manufactured.

Sources: https://www.octapharmaplasma.com/new-donors/ ; https://www.fairfaxeggbank.com/egg-donor-faqs/ ; https://fairfaxcryobank.com/become-a-donor ; https://www.spermbank.com/about/faqs ; individual BioLife sources are in lib/data/provider-offers.json.
