# Automatic provider sources

Donation imports now run an official-source pass afterward. Review listings also has a **Find provider sources** button for existing imports. The first adapters support CSL Plasma and BioLife Plasma Services. Unknown providers, missing age/payment evidence, inaccessible pages, and changed page formats remain hidden for manual review.

The process fetches only fixed HTTPS provider URLs, rejects redirects, and never fetches a listing-controlled URL. It requires current provider identity, explicit published age evidence, and donor payment evidence. It stores source links and a preliminary-requirement summary, keeps monetary figures null, and never generalizes location-specific promotional rates. No health data about users is collected.

Successful records become PENDING_REVIEW, not active or verified. An administrator reviews them and uses Approve all to publish. Existing approved, rejected, or manually sourced records are preserved. The lookup is paginated in batches of 100; provider responses are reused within each request. No extra Google Places requests are needed.

Sources: [CSL FAQ](https://www.cslplasma.com/faq), [BioLife requirements](https://www.biolifeplasma.com/donation-process/who-can-donate), [BioLife payment FAQ](https://www.biolifeplasma.com/donation-process/faqs). Additional brands need provider-specific adapters and validation before being enabled.
