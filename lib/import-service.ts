import {NextResponse} from 'next/server';
import type {SupabaseClient} from '@supabase/supabase-js';
import {z} from 'zod';
import {registryListings} from '@/lib/registry-import';
import programs from '@/supabase/donation-programs-sources.json';
const input=z.object({source:z.enum(['trials','donations']),lat:z.number().min(-90).max(90).default(33.749),lon:z.number().min(-180).max(180).default(-84.388),pageToken:z.string().max(2000).optional()}).strict();
export async function importPage(db:SupabaseClient,body:unknown){
 const parsed=input.safeParse(body);if(!parsed.success)return NextResponse.json({error:'Invalid import settings.'},{status:400});
 let imported=0,existing=0;const errors:string[]=[];
 try{
  let nextPageToken:string|undefined;
  let rows;
  if(parsed.data.source==='trials'){
   const url=new URL('https://clinicaltrials.gov/api/v2/studies');url.searchParams.set('filter.overallStatus','RECRUITING');url.searchParams.set('filter.geo',`distance(${parsed.data.lat},${parsed.data.lon},50mi)`);url.searchParams.set('pageSize','10');if(parsed.data.pageToken)url.searchParams.set('pageToken',parsed.data.pageToken);
   const res=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!res.ok)throw new Error(`Registry unavailable (${res.status}). Try again later.`);const page=await res.json();nextPageToken=page.nextPageToken;
   rows=(page.studies??[]).flatMap((study:unknown)=>registryListings(study,parsed.data.lat,parsed.data.lon));
  }else rows=programs.map(p=>({...p,external:`${p.source}:${p.facility}`}));
  const source=parsed.data.source==='trials'?'CLINICALTRIALS_GOV':'PROVIDER';
  for(const row of rows){
   const lookup=await db.from('opportunities').select('id').eq('data_source',source).eq('external_id',row.external).maybeSingle();if(lookup.error)throw lookup.error;if(lookup.data){existing++;continue;}
   const organization=await db.from('organizations').select('id').eq('name',row.organization).limit(1).maybeSingle();if(organization.error)throw organization.error;let orgId=organization.data?.id;
   if(!orgId){const result=await db.from('organizations').insert({name:row.organization}).select('id').single();if(result.error)throw result.error;orgId=result.data.id;}
   const location=await db.from('locations').insert({organization_id:orgId,name:row.facility,address:row.address,position:`SRID=4326;POINT(${row.lon} ${row.lat})`}).select('id').single();if(location.error)throw location.error;
   const record={organization_id:orgId,location_id:location.data.id,title:row.title,opportunity_type:row.type,minimum_age:row.min,maximum_age:row.max,compensation_min:null,compensation_max:row.payMax,...(row.basis?{compensation_basis:row.basis}:{}),data_source:source,external_id:row.external,source_url:row.source,review_status:'PENDING_REVIEW',active:false,verified:false,source_checked_at:source==='CLINICALTRIALS_GOV'?new Date().toISOString():'2026-10-05T00:00:00Z'};
   const listing=await db.from('opportunities').insert(record).select('id').single();if(listing.error){await db.from('locations').delete().eq('id',location.data.id);if(listing.error.code==='23505'){existing++;continue;}throw listing.error;}
   if(row.requirements){const requirements=await db.from('eligibility_requirements').insert({opportunity_id:listing.data.id,published_requirement:row.requirements});if(requirements.error){await db.from('opportunities').delete().eq('id',listing.data.id);await db.from('locations').delete().eq('id',location.data.id);throw requirements.error;}}
   imported++;
  }
  return NextResponse.json({imported,existing,nextPageToken,errors});
 }catch(error){const message=error instanceof Error?error.message:(error as {message?:string})?.message??'Import failed.';return NextResponse.json({error:message.includes('source_checked_at')||message.includes('compensation_basis')?'Database setup is incomplete. Apply supabase/migrations/003_launch.sql in the Supabase SQL Editor, then click Sync listings.':message,imported,existing},{status:500});}
}
