begin;
create table if not exists public.activity_preferences(user_id uuid primary key references auth.users(id) on delete cascade,enabled boolean not null default false);
alter table public.activity_preferences enable row level security;
revoke all on public.activity_preferences from anon,authenticated;
grant select on public.activity_preferences to authenticated;
drop policy if exists activity_preference_own on public.activity_preferences;
create policy activity_preference_own on public.activity_preferences for select to authenticated using(user_id=auth.uid());
create table if not exists public.activity_events(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,event text not null check(event in ('ACCOUNT_CREATED','EXPLORE_OPENED','OPPORTUNITY_OPENED','SAVE_CLICKED','PROVIDER_LINK_CLICKED','APPLICATION_TRACK_CLICKED')),created_at timestamptz not null default now());
create index if not exists activity_events_recent on public.activity_events(created_at desc,id);
create index if not exists activity_events_actor on public.activity_events(user_id,created_at desc);
create unique index if not exists activity_one_signup on public.activity_events(user_id) where event='ACCOUNT_CREATED';
alter table public.activity_events enable row level security;
revoke all on public.activity_events from anon,authenticated;
grant select on public.activity_events to authenticated;
drop policy if exists activity_admin_read on public.activity_events;
create policy activity_admin_read on public.activity_events for select to authenticated using(public.is_admin());
create or replace function public.set_activity_consent(allow_tracking boolean) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,4));
 insert into public.activity_preferences(user_id,enabled)values(auth.uid(),allow_tracking)on conflict(user_id)do update set enabled=excluded.enabled;
 if not allow_tracking then delete from public.activity_events where user_id=auth.uid() and event<>'ACCOUNT_CREATED';end if;
end;$$;
create or replace function public.record_activity_event(event_name text) returns boolean language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 if event_name not in ('EXPLORE_OPENED','OPPORTUNITY_OPENED','SAVE_CLICKED','PROVIDER_LINK_CLICKED','APPLICATION_TRACK_CLICKED') then raise exception 'Invalid event';end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,4));
 if not exists(select 1 from public.activity_preferences where user_id=auth.uid() and enabled) then return false;end if;
 if (select count(*) from public.activity_events where user_id=auth.uid() and created_at>now()-interval '1 minute' and event<>'ACCOUNT_CREATED')>=20 then return false;end if;
 insert into public.activity_events(user_id,event)values(auth.uid(),event_name);return true;
end;$$;
create or replace function public.log_account_creation() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.activity_events(user_id,event,created_at)values(new.id,'ACCOUNT_CREATED',new.created_at)on conflict do nothing;
 return new;
exception when others then
 raise warning 'Account creation logging unavailable';return new;
end;$$;
drop trigger if exists earnahead_account_creation_log on auth.users;
create trigger earnahead_account_creation_log after insert on auth.users for each row execute function public.log_account_creation();
insert into public.activity_events(user_id,event,created_at)select id,'ACCOUNT_CREATED',created_at from auth.users where created_at>now()-interval '90 days' on conflict do nothing;
create or replace function public.prune_activity_events() returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.role() is distinct from 'service_role' then raise exception 'Service access required';end if;
 delete from public.activity_events where created_at<now()-interval '90 days';
end;$$;
revoke all on function public.log_account_creation() from public,anon,authenticated;
revoke all on function public.record_activity_event(text) from public,anon;
revoke all on function public.set_activity_consent(boolean) from public,anon;
grant execute on function public.record_activity_event(text),public.set_activity_consent(boolean) to authenticated;
revoke all on function public.prune_activity_events() from public,anon,authenticated;
grant execute on function public.prune_activity_events() to service_role;
notify pgrst,'reload schema';
commit;
