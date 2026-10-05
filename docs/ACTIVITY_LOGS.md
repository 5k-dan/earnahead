# Admin account and activity logs

The admin Review listings screen includes registered accounts and recent activity. Account information is fetched server-side through Supabase's admin API only after authenticating an administrator. Responses allowlist ID, email, creation time, and email verification status. Passwords, auth metadata, phone numbers, and user health/profile data are not returned.

Run `supabase/migrations/004_activity_logs.sql` once in Supabase's SQL Editor. It installs the account-creation trigger, backfills creation events for accounts created within 90 days, enables RLS, and installs consent-aware event functions. Migration is rerunnable. The app shows account information independently of the migration; event tracking fails closed until it is applied.

Optional analytics default off. Users can enable or revoke consent in Profile. Revoking consent deletes their previous optional action events. Actions record only account ID, allowlisted action, and timestamp. No listing IDs, titles, categories, URLs, search strings, coordinates, IP addresses, or form text are recorded. Click signals are client-reported, not a security audit or proof of a completed application.

Database functions derive identity from the authenticated session and reject fabricated signup events. Users have no direct insert/update/delete access to logs. RLS restricts reads to admins. The database serializes consent and logging per account and accepts at most 20 optional actions per minute. Account deletion cascades to logs and consent records.

The dashboard only shows the last 90 days. The configured daily cron job deletes older events; if the job stops, physical deletion is delayed until it runs again. Account information remains in Supabase Auth while the account exists. Account-creation event failures do not block signup. Historical click activity before consent/installation cannot be reconstructed.

Verification: API tests cover authorization, forged identities and metadata, preference validation, pagination, and output redaction. Browser-component tests check opt-in, opt-out, and omission of private listing data. The migration was applied twice successfully in an isolated local Postgres database, and `supabase/tests/activity-security.sql` passed signup-trigger, RLS, consent, rate-limit, and deletion assertions there. Run that rollback-only integration check against the configured Supabase database after the migration as well; the local harness does not validate production configuration.
