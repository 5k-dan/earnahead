# LinkedIn early-access launch

Share https://earnahead.vercel.app/landing . Root and landing share the branded 1200 × 630 PNG preview, headline and accurate description. The social preview was generated in the production build and visually inspected on October 5, 2026.

Implemented: growing nationwide coverage notice; explicit local availability and travel differences; early-access label; feedback link in the desktop/mobile footer and email action on support. Feedback is user-initiated email, not an automatic message or health-information form.

Automated checks: account authentication, initial profile submission, saved activities, search/location/radius, password recovery and source links tested by the existing suite. All 215 Vitest tests and five rules tests passed. Production build passed. Mobile CSS was reviewed for single-column cards, readable search inputs, controls, navigation and feedback spacing.

Remaining manual checks on a real phone: browse signed out, search your city, open a provider link, sign up/confirm email, submit a profile, save a listing, sign out, and complete password recovery. Automated tests use mocks and do not verify email delivery or actual phone rendering. Browser automation was unavailable under the session's settings, so no interactive device check is claimed.

Suggested post: “I’m opening early access to EarnAhead, a site for finding plasma, sperm and egg donor programs and comparing published compensation and provider terms. Local availability varies, and some programs require travel. Applications, screening and payments are handled directly by providers. Try it and let me know what could be better.”
