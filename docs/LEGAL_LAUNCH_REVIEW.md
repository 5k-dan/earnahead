# EarnAhead public launch review — October 5, 2026

Operator: Daniel Ladipo, Georgia, United States. Public contact: danielladipo@gmail.com. No monetization or paid referrals are currently enabled. This is an engineering review, not legal clearance.

## Implemented

- Public privacy, terms, support and separate consumer health data notice; homepage/footer link.
- Account-related health interests accurately disclosed even without medical questionnaires.
- Named operator and contact; optional analytics remain off by default; no ad pixels introduced.
- Signup adult attestation and explicit terms confirmation; email signup metadata records the version/date. This is self-attestation, not verified identity or legal consent certification.
- Profile API rejects under-18 birth dates. Existing application age and ownership controls remain.
- Clinical availability does not imply paid participation; no guaranteed acceptance, income, safety or provider endorsement claims.
- Google Places importer paused; public API/detail routes exclude Places-derived records, approval handlers refuse them. Existing active Places-derived records quarantined rather than deleted. Historical location fields still require a retention/remediation decision.

## Outstanding before paid promotion or broad public advertising

1. Replace Google Places-derived facility names/addresses/coordinates with independently researched original provider directories and permitted geocoding, recording provenance. Do not simply relabel data_source or attach a payment URL: that does not independently source the address. Remove restricted historical content according to the applicable Google agreement, while preserving permitted place IDs if appropriate. Current implementation must not be presented as a compliant nationwide Google directory.
2. Have a U.S. privacy/health-data lawyer assess Washington and other applicable state consumer health-data laws: requested-service processing, location/interest collection, rights/appeals, vendor contracts, backups/deletion and exact response deadlines. A privacy notice alone is not compliance. Review Georgia sole-proprietor/trade-name and local licensing requirements for the operator. An LLC is not treated here as a universal website requirement.
3. Confirm service-provider retention and request handling in practice (Supabase/Vercel and backups), test the live deletion route and scheduled purge, and maintain an incident response contact/process. Additional backup handling may be needed for consumer health-data requests. Do not claim HIPAA compliance or assume HIPAA is the only applicable privacy law.
4. Advertising platforms have their own reproductive-health and targeting policies. Review the chosen platform before launching a campaign; use broad contextual/geographic audiences rather than inferred medical-interest lists. Do not upload account emails or saved medical listings as advertising audiences.

## Advertising copy prepared for review

“Explore plasma, sperm and egg donor programs near you. Compare published provider terms and connect directly with providers. For adults 18+. Provider screening applies; acceptance, compensation and availability vary.”

For a specific published amount, identify the provider and payment period beside it, and include meaningful conditions in the same ad. Never imply EarnAhead pays users, that all studies pay, or that advertised maximums are typical/guaranteed. Do not use provider logos or claim partnerships without permission.

## Primary sources reviewed

- FTC truthful/substantiated advertising: https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business
- Washington consumer health data: https://www.atg.wa.gov/protecting-washingtonians-personal-health-data-and-privacy
- California privacy policies: https://oag.ca.gov/sites/all/files/agweb/pdfs/cybersecurity/making_your_privacy_practices_public.pdf
- HIPAA scope: https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html
- Google Places storage/map/attribution requirements: https://developers.google.com/maps/documentation/places/web-service/policies

These sources inform the engineering changes; a lawyer must determine applicability to the actual business and data practices. No legal sign-off has been obtained.
