-- Run once in Supabase's SQL Editor only if this project contains your sole account.
-- Authorizes that account to review listings, not any new accounts.
begin;
do $$
declare account_id uuid;
begin
 if (select count(*) from auth.users) <> 1 then
   raise exception 'Expected exactly one account. Select your own account explicitly before granting admin access.';
 end if;
 select id into account_id from auth.users limit 1;
 update auth.users set raw_app_meta_data=coalesce(raw_app_meta_data,'{}'::jsonb)||'{"role":"admin"}'::jsonb where id=account_id;
 insert into public.users(id) values(account_id) on conflict do nothing;
end $$;
commit;
