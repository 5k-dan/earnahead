-- Test harness ONLY: run against an empty, disposable local Postgres database.
-- Never run against Supabase or a production database.
create role anon;
create role authenticated;
create role service_role;
create schema auth;
create table auth.users(id uuid primary key,email text,created_at timestamptz not null default now());
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid;$$;
create function auth.role() returns text language sql stable as $$select current_setting('request.jwt.claims',true)::jsonb->>'role';$$;
create function public.is_admin() returns boolean language sql stable as $$select coalesce((current_setting('request.jwt.claims',true)::jsonb->'app_metadata'->>'role')='admin',false);$$;
grant usage on schema auth to anon,authenticated,service_role;
