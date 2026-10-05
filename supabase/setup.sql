begin;
create schema if not exists extensions;
create extension if not exists postgis with schema extensions;
set search_path=public,extensions;
create type opportunity_type as enum ('PLASMA','SPERM','EGG','CLINICAL_TRIAL','RESEARCH_STUDY','OTHER');
create type data_source as enum ('CLINICALTRIALS_GOV','GOOGLE_PLACES','PROVIDER');
create type review_status as enum ('NEEDS_SOURCE','PENDING_REVIEW','APPROVED','REJECTED');
create table public.users(id uuid primary key references auth.users on delete cascade);
create table user_profiles(user_id uuid primary key references public.users on delete cascade,name text not null,dob date not null check(dob<=current_date),city text not null,preferences opportunity_type[] not null default '{}');
create table organizations(id uuid primary key default gen_random_uuid(),owner_id uuid references public.users,name text not null,website text);
create table locations(id uuid primary key default gen_random_uuid(),organization_id uuid references organizations,name text not null,address text,position geography(Point,4326) not null);
create index locations_geo on locations using gist(position);
create table opportunities(id uuid primary key default gen_random_uuid(),organization_id uuid references organizations,location_id uuid references locations,title text not null,opportunity_type opportunity_type not null,compensation_min numeric check(compensation_min>=0),compensation_max numeric check(compensation_max>=0),minimum_age integer not null default 18,maximum_age integer,data_source data_source not null,source_url text,external_id text,review_status review_status not null default 'NEEDS_SOURCE',verified boolean not null default false,active boolean not null default false,last_seen_at timestamptz not null default now(),unique(data_source,external_id),check(minimum_age>=case when opportunity_type='EGG' then 21 else 18 end),check(maximum_age is null or maximum_age>=minimum_age),check(compensation_max is null or compensation_min is null or compensation_max>=compensation_min),check(not active or (review_status='APPROVED' and source_url is not null and source_url ~ '^https?://[^[:space:]]+$')));
create table eligibility_requirements(id uuid primary key default gen_random_uuid(),opportunity_id uuid not null references opportunities on delete cascade,published_requirement text not null);
create table saved_opportunities(user_id uuid references public.users on delete cascade,opportunity_id uuid references opportunities on delete cascade,created_at timestamptz default now(),primary key(user_id,opportunity_id));
create table applications(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.users on delete cascade,opportunity_id uuid not null references opportunities,status text not null default 'TRACKING' check(status in ('TRACKING','CONTACTED','APPLIED','COMPLETED','WITHDRAWN')),created_at timestamptz default now(),unique(user_id,opportunity_id));
create table earnings(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.users on delete cascade,application_id uuid references applications,amount numeric not null check(amount>0),received_at date not null);
create function register_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.users(id) values(new.id);return new;end;$$;
create trigger register_user after insert on auth.users for each row execute function register_user();
create function is_admin() returns boolean language sql stable as $$ select coalesce((auth.jwt()->'app_metadata'->>'role')='admin',false); $$;
create function check_application_age() returns trigger language plpgsql security definer set search_path=public as $$ declare birth date; floor_age integer; is_live boolean; begin select dob into birth from user_profiles where user_id=new.user_id;select minimum_age,active and review_status='APPROVED' into floor_age,is_live from opportunities where id=new.opportunity_id;if birth is null or not coalesce(is_live,false) or extract(year from age(current_date,birth))<floor_age then raise exception 'A saved date of birth and the published minimum age are required to track this opportunity.';end if;return new;end;$$;
create trigger application_age before insert or update on applications for each row execute function check_application_age();
alter table public.users enable row level security;
alter table user_profiles enable row level security;
alter table organizations enable row level security;
alter table locations enable row level security;
alter table opportunities enable row level security;
alter table eligibility_requirements enable row level security;
alter table saved_opportunities enable row level security;
alter table applications enable row level security;
alter table earnings enable row level security;
create policy own_user on public.users for select using(id=auth.uid());
create policy own_profile on user_profiles for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy read_organizations on organizations for select using(true);
create policy manage_organizations on organizations for all using(owner_id=auth.uid() or is_admin()) with check(owner_id=auth.uid() or is_admin());
create policy read_locations on locations for select using(true);
create policy admin_locations on locations for all using(is_admin()) with check(is_admin());
create policy public_opportunities on opportunities for select using((active and review_status='APPROVED' and source_url is not null) or is_admin());
create policy admin_opportunities on opportunities for all using(is_admin()) with check(is_admin());
create policy public_requirements on eligibility_requirements for select using(exists(select 1 from opportunities where id=opportunity_id));
create policy admin_requirements on eligibility_requirements for all using(is_admin()) with check(is_admin());
create policy own_saved on saved_opportunities for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy own_applications on applications for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy own_earnings on earnings for all using(user_id=auth.uid()) with check(user_id=auth.uid() and (application_id is null or exists(select 1 from applications a where a.id=application_id and a.user_id=auth.uid())));
create function nearby_opportunities(search_latitude double precision,search_longitude double precision,radius_miles double precision default 25,kind opportunity_type default null) returns table(id uuid,title text,opportunity_type opportunity_type,compensation_min numeric,compensation_max numeric,source_url text,minimum_age integer,maximum_age integer,distance_miles double precision,latitude double precision,longitude double precision) language sql stable security invoker set search_path=public,extensions as $$ select o.id,o.title,o.opportunity_type,o.compensation_min,o.compensation_max,o.source_url,o.minimum_age,o.maximum_age,ST_Distance(l.position,ST_SetSRID(ST_MakePoint(search_longitude,search_latitude),4326)::geography)/1609.344,ST_Y(l.position::geometry),ST_X(l.position::geometry) from opportunities o join locations l on l.id=o.location_id where o.active and o.review_status='APPROVED' and (kind is null or o.opportunity_type=kind) and ST_DWithin(l.position,ST_SetSRID(ST_MakePoint(search_longitude,search_latitude),4326)::geography,least(greatest(radius_miles,1),100)*1609.344) order by 9; $$;




create function submit_opportunity(org uuid,listing_title text,kind public.opportunity_type,source text,facility_name text,address_text text,latitude double precision,longitude double precision,min_age integer,max_age integer default null) returns uuid language plpgsql security definer set search_path=public,extensions as $$ declare facility uuid; listing uuid;begin
if not exists(select 1 from organizations where id=org and owner_id=auth.uid()) then raise exception 'You must own this organization.';end if;
if source !~ '^https?://[^[:space:]]+$' or length(listing_title)<3 or latitude not between -90 and 90 or longitude not between -180 and 180 then raise exception 'Valid published source, title, and coordinates required.';end if;
insert into locations(organization_id,name,address,position)values(org,facility_name,address_text,ST_SetSRID(ST_MakePoint(longitude,latitude),4326)::geography) returning id into facility;
insert into opportunities(organization_id,location_id,title,opportunity_type,source_url,data_source,minimum_age,maximum_age,review_status,active,verified)values(org,facility,listing_title,kind,source,'PROVIDER',min_age,max_age,'PENDING_REVIEW',false,false) returning id into listing;return listing;end;$$;
revoke all on function submit_opportunity(uuid,text,public.opportunity_type,text,text,text,double precision,double precision,integer,integer) from public;
grant execute on function submit_opportunity(uuid,text,public.opportunity_type,text,text,text,double precision,double precision,integer,integer) to authenticated;
create policy owner_pending_opportunities on opportunities for select using(exists(select 1 from organizations o where o.id=organization_id and o.owner_id=auth.uid()));

commit;
