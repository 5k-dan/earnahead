import {createClient} from '@supabase/supabase-js';
if(!process.env.IMPORTER_ACCESS_TOKEN)throw new Error('An admin importer access token is required.');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{global:{headers:{Authorization:`Bearer ${process.env.IMPORTER_ACCESS_TOKEN}`}}});
const listings=[];
for(let offset=0;;offset+=1000){const {data,error}=await db.from('opportunities').select('id,external_id').eq('data_source','CLINICALTRIALS_GOV').range(offset,offset+999);if(error)throw error;listings.push(...data);if(data.length<1000)break;}
const ids=[...new Set(listings.map(l=>l.external_id.split(':')[0]))];
let archived=0;
for(let start=0;start<ids.length;start+=100){const chunk=ids.slice(start,start+100);const url=new URL('https://clinicaltrials.gov/api/v2/studies');url.searchParams.set('filter.ids',chunk.join(','));url.searchParams.set('pageSize','100');const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw new Error(`Registry returned ${response.status}. Existing listings unchanged for this batch.`);const page=await response.json();const status=new Map((page.studies??[]).map(s=>[s.protocolSection.identificationModule.nctId,s.protocolSection.statusModule.overallStatus]));
 for(const l of listings.filter(l=>chunk.includes(l.external_id.split(':')[0]))){const value=status.get(l.external_id.split(':')[0]);if(value&&value!=='RECRUITING'){const {error}=await db.from('opportunities').update({active:false,last_seen_at:new Date().toISOString()}).eq('id',l.id);if(error)throw error;archived++;}}
}
console.log(`Archived ${archived} listings whose studies are no longer recruiting. Review individual facility status separately.`);
