-- Run after 004_activity_logs.sql. All fixtures roll back.
begin;
create function pg_temp.assert_activity(result boolean,message text) returns void language plpgsql as $$begin if result is distinct from true then raise exception 'TEST FAILED: %',message;end if;end;$$;
insert into auth.users(id,email,created_at)values('ea400000-0000-4000-8000-000000000001','activity-test@example.invalid',now());
select pg_temp.assert_activity((select count(*)=1 from public.activity_events where user_id='ea400000-0000-4000-8000-000000000001' and event='ACCOUNT_CREATED'),'signup logged by trigger');
set local role authenticated;
select set_config('request.jwt.claim.sub','ea400000-0000-4000-8000-000000000001',true);
select set_config('request.jwt.claims','{"sub":"ea400000-0000-4000-8000-000000000001","role":"authenticated"}',true);
select pg_temp.assert_activity((select count(*)=0 from public.activity_events),'non-admin cannot read logs');
select pg_temp.assert_activity(not public.record_activity_event('SAVE_CLICKED'),'default consent off');
do $$begin
 begin insert into public.activity_events(user_id,event)values(auth.uid(),'ACCOUNT_CREATED');raise exception 'TEST FAILED: direct log insert accepted';exception when insufficient_privilege then null;end;
 begin perform public.record_activity_event('ACCOUNT_CREATED');raise exception 'TEST FAILED: forged signup accepted';exception when raise_exception then if SQLERRM like 'TEST FAILED:%' then raise;end if;end;
end;$$;
select public.set_activity_consent(true);
do $$begin for i in 1..25 loop perform public.record_activity_event('SAVE_CLICKED');end loop;end;$$;
reset role;
select pg_temp.assert_activity((select count(*)=20 from public.activity_events where user_id='ea400000-0000-4000-8000-000000000001' and event='SAVE_CLICKED'),'server rate limit');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"ea400000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{"role":"admin"}}',true);
select pg_temp.assert_activity((select count(*)=21 from public.activity_events where user_id=auth.uid()),'admin can read logs');
select public.set_activity_consent(false);
reset role;
select pg_temp.assert_activity((select count(*)=1 from public.activity_events where user_id='ea400000-0000-4000-8000-000000000001'),'opt-out clears optional logs');
delete from auth.users where id='ea400000-0000-4000-8000-000000000001';
select pg_temp.assert_activity((select count(*)=0 from public.activity_events where user_id='ea400000-0000-4000-8000-000000000001'),'account deletion removes logs');
select pg_temp.assert_activity((select count(*)=0 from public.activity_preferences where user_id='ea400000-0000-4000-8000-000000000001'),'account deletion removes consent');
rollback;
