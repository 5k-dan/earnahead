-- Transactional integration tests: all test accounts and fixtures are rolled back.
-- Run in the Supabase SQL Editor after setup. Success means assertions passed.
begin;
create function pg_temp.assert_true(result boolean,message text) returns void language plpgsql as $$ begin if result is distinct from true then raise exception 'TEST FAILED: %',message;end if;end;$$;
insert into auth.users(id,email)values('ea000000-0000-4000-8000-000000000001','earnahead-test-a@example.invalid'),('ea000000-0000-4000-8000-000000000002','earnahead-test-b@example.invalid');
insert into public.user_profiles(user_id,name,dob,city)values('ea000000-0000-4000-8000-000000000001','Rollback test A',current_date-interval '17 years','Atlanta'),('ea000000-0000-4000-8000-000000000002','Rollback test B',current_date-interval '21 years','Atlanta');
insert into public.opportunities(id,title,opportunity_type,minimum_age,data_source,source_url,review_status,active)values('ea000000-0000-4000-8000-000000000010','ROLLBACK TEST ONLY','PLASMA',18,'PROVIDER','https://clinicaltrials.gov/','APPROVED',true),('ea000000-0000-4000-8000-000000000011','ROLLBACK TEST ONLY','EGG',21,'PROVIDER','https://clinicaltrials.gov/','APPROVED',true),('ea000000-0000-4000-8000-000000000012','ROLLBACK TEST ONLY','PLASMA',18,'GOOGLE_PLACES',null,'NEEDS_SOURCE',false);
do $$ begin
 begin insert into public.opportunities(title,opportunity_type,minimum_age,data_source,review_status,active)values('ROLLBACK TEST ONLY','PLASMA',18,'PROVIDER','APPROVED',true);raise exception 'TEST FAILED: missing source accepted';exception when check_violation then null;end;
 begin insert into public.opportunities(title,opportunity_type,minimum_age,data_source)values('ROLLBACK TEST ONLY','EGG',20,'PROVIDER');raise exception 'TEST FAILED: egg minimum below 21 accepted';exception when check_violation then null;end;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','ea000000-0000-4000-8000-000000000001',true);
select set_config('request.jwt.claims','{"sub":"ea000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
select pg_temp.assert_true((select count(*) from public.user_profiles)=1,'profiles must be private');
select pg_temp.assert_true((select count(*) from public.opportunities where id='ea000000-0000-4000-8000-000000000012')=0,'NEEDS_SOURCE listing must be hidden');
do $$ begin
 begin insert into public.applications(user_id,opportunity_id)values(auth.uid(),'ea000000-0000-4000-8000-000000000010');raise exception 'TEST FAILED: underage application accepted';exception when raise_exception then if SQLERRM like 'TEST FAILED:%' then raise;end if;if SQLERRM not like 'A saved date of birth%' then raise;end if;end;
end $$;
reset role;
update public.user_profiles set dob=current_date-interval '18 years' where user_id='ea000000-0000-4000-8000-000000000001';
set local role authenticated;
insert into public.applications(user_id,opportunity_id)values(auth.uid(),'ea000000-0000-4000-8000-000000000010');
do $$ begin
 begin insert into public.applications(user_id,opportunity_id)values(auth.uid(),'ea000000-0000-4000-8000-000000000011');raise exception 'TEST FAILED: egg application below 21 accepted';exception when raise_exception then if SQLERRM like 'TEST FAILED:%' then raise;end if;if SQLERRM not like 'A saved date of birth%' then raise;end if;end;
 begin insert into public.earnings(user_id,amount,received_at)values('ea000000-0000-4000-8000-000000000002',10,current_date);raise exception 'TEST FAILED: another user earnings write accepted';exception when insufficient_privilege then null;end;
end $$;
insert into public.saved_opportunities(user_id,opportunity_id)values(auth.uid(),'ea000000-0000-4000-8000-000000000010');
insert into public.earnings(user_id,amount,received_at)values(auth.uid(),10,current_date);
insert into public.listing_reports(opportunity_id,reporter_id,reason)values('ea000000-0000-4000-8000-000000000010',auth.uid(),'SOURCE');
select set_config('request.jwt.claim.sub','ea000000-0000-4000-8000-000000000002',true);
select set_config('request.jwt.claims','{"sub":"ea000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
select pg_temp.assert_true((select count(*) from public.applications)=0,'applications must be private');
select pg_temp.assert_true((select count(*) from public.saved_opportunities)=0,'saves must be private');
select pg_temp.assert_true((select count(*) from public.earnings)=0,'earnings must be private');
select pg_temp.assert_true((select count(*) from public.listing_reports)=0,'reports must be private');
insert into public.applications(user_id,opportunity_id)values(auth.uid(),'ea000000-0000-4000-8000-000000000011');
select public.delete_own_account();
reset role;
select pg_temp.assert_true((select count(*) from auth.users where id='ea000000-0000-4000-8000-000000000002')=0,'self-deletion must remove own account');
select pg_temp.assert_true((select count(*) from auth.users where id='ea000000-0000-4000-8000-000000000001')=1,'self-deletion must preserve other accounts');
select pg_temp.assert_true((select count(*) from public.user_profiles where user_id='ea000000-0000-4000-8000-000000000002')=0,'self-deletion must remove own profile');
rollback;
select 'Security assertions passed; all test data rolled back.' as result;
