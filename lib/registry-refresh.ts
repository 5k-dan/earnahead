import type {SupabaseClient} from '@supabase/supabase-js';
import {registryListings,registryStudy} from './registry-import';
export async function refreshRegistry(db:SupabaseClient,offset:number){
 const result=await db.from('opportunities').select('id,external_id,title,minimum_age,maximum_age,eligibility_requirements(published_requirement)').eq('data_source','CLINICALTRIALS_GOV').order('id').range(offset,offset+19);if(result.error)throw result.error;
 const listings=result.data??[];if(!listings.length)return {archived:0,nextOffset:0};
 const ids=[...new Set(listings.map(row=>row.external_id.split(':')[0]))];const url=new URL('https://clinicaltrials.gov/api/v2/studies');url.searchParams.set('filter.ids',ids.join(','));url.searchParams.set('pageSize','100');
 const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Registry refresh unavailable');const page=await response.json();let archived=0;
 for(const listing of listings){const raw=(page.studies??[]).find((value:unknown)=>{const parsed=registryStudy.safeParse(value);return parsed.success&&parsed.data.protocolSection.identificationModule.nctId===listing.external_id.split(':')[0];});if(!raw)continue;const study=registryStudy.parse(raw);const valid=registryListings(raw,33.749,-84.388).some(row=>row.external===listing.external_id);const patch=valid?{last_seen_at:new Date().toISOString(),source_checked_at:new Date().toISOString()}:{active:false,verified:false,last_seen_at:new Date().toISOString(),source_checked_at:new Date().toISOString()};
  const current=registryListings(raw,33.749,-84.388).find(row=>row.external===listing.external_id);
  const previousRequirements=(listing.eligibility_requirements??[]).map(row=>row.published_requirement).join('\n');
  const changed=current&&(current.title!==listing.title||current.min!==listing.minimum_age||current.max!==listing.maximum_age||current.requirements!==previousRequirements);
  const update=await db.from('opportunities').update(changed?{...patch,title:current.title,minimum_age:current.min,maximum_age:current.max,active:false,verified:false,review_status:'PENDING_REVIEW'}:patch).eq('id',listing.id);if(update.error)throw update.error;if(!valid&&study.protocolSection.statusModule.overallStatus)archived++;
  if(changed&&current){const removed=await db.from('eligibility_requirements').delete().eq('opportunity_id',listing.id);if(removed.error)throw removed.error;if(current.requirements){const inserted=await db.from('eligibility_requirements').insert({opportunity_id:listing.id,published_requirement:current.requirements});if(inserted.error)throw inserted.error;}}
 }
 return {archived,nextOffset:listings.length<20?0:offset+20};
}
