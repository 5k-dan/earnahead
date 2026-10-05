# Donation discovery and provider sources

Explore defaults to plasma, sperm, and egg programmes. Research has its own tab; the preference is remembered. Clinical imports are manual batches of at most 10 registry pages. The scheduled job prepares donation sources and refreshes already imported studies without continuously adding new clinical studies.

Maintained adapters support CSL, BioLife, Octapharma, Grifols, Fairfax Cryobank, Fairfax EggBank, and ConceiveAbilities. They fetch fixed original provider URLs and require provider identity, explicit age requirements and payment evidence. Inaccessible pages or unsupported providers remain hidden. Egg listings have a platform minimum age of 21. Fairfax Cryobank's explicit $150 per donation visit and ConceiveAbilities' published starting $10,000 for a full egg cycle are extracted; the egg starting amount is a lower bound, not a fixed guarantee. The existing TOTAL_PROGRAM field stores the complete cycle, and egg cards label it full cycle; promotional caps and multi-cycle egg totals are never used as single-donation payments.

Prepared records stay PENDING_REVIEW, inactive and unverified until an administrator approves. Existing approved and manually sourced records are preserved. Programme offices can arrange appointments elsewhere: users must confirm the donation location with the provider. No user medical data is collected.

Manual source checks can prepare records when official websites block automated fetches. The egg websites currently return HTTP 403 to the server; their official terms need manual review until automated access becomes available.
