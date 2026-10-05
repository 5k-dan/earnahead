// Manual source review 2026-10-05: NAFG state recruitment pages and FIH donor terms.
// These are city recruitment service areas, NOT clinic pins.
import {readFile} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const reviewedAt='2026-10-05T21:10:00Z';
if(Date.now()-Date.parse(reviewedAt)>30*86400000)throw Error('Re-review the original egg provider sources before publishing this manual snapshot.');
const apply=process.argv.includes('--apply');
const stateNames={CT:'connecticut',NH:'new-hampshire',VT:'vermont'};

const cities={CT:['Stamford','New Haven','Hartford','Greenwich','West Hartford'],NH:['Manchester','Nashua','Durham','Hanover'],VT:['Burlington','Winooski','Colchester','Middlebury','Montpelier','Bennington','Brattleboro','Northfield','Rutland','Castleton'],HI:['Honolulu']};
// Require a unique Census city match; do not guess coordinates.
const places=JSON.parse(await readFile('lib/data/us-places.json','utf8'));
const normalize=s=>s.replace(/ (city and borough|city|town|village|borough|CDP|municipality)$/i,'').toLowerCase();
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const check=r=>{if(r.error)throw Error(r.error.message);return r.data;};
let published=0;const skipped=[];
for(const [state,names]of Object.entries(cities))for(const city of names){
 const hawaii=state==='HI';const provider=hawaii?'Fertility Institute of Hawaii':'Northeast Assisted Fertility Group';const source=hawaii?'https://www.ivfcenterhawaii.com/3rd-party/become-an-egg-donor/':'https://assistedfertility.com/be-an-egg-donor/'+stateNames[state]+'/';
 let org=check(await db.from('organizations').select('id').eq('name',provider).limit(1));if(!org.length&&apply)org=[check(await db.from('organizations').insert({name:provider,website:new URL(source).origin}).select('id').single())];
 const matches=places.filter(p=>p[1]===state&&normalize(p[0])===(city==='Honolulu'?'urban honolulu':city.toLowerCase()));if(matches.length!==1){skipped.push(`${city}, ${state}`);continue;}
 const [,,lat,lon]=matches[0];const external=`official-service-area:reviewed-state-donors:${city}:${state}`;
 if(!apply){published++;continue;}
 if(check(await db.from('opportunities').select('id').eq('data_source','PROVIDER').eq('external_id',external).maybeSingle())){published++;continue;}
 const loc=check(await db.from('locations').insert({organization_id:org[0].id,name:`${city}, ${state} service area · confirm clinic`,address:'City-level service area, not an appointment address. The provider confirms the actual medical clinic and any travel after screening.',position:`SRID=4326;POINT(${lon} ${lat})`}).select('id').single());
 const o=check(await db.from('opportunities').insert({organization_id:org[0].id,location_id:loc.id,title:`${provider} egg donor recruitment · ${city}, ${state}`,opportunity_type:'EGG',minimum_age:21,maximum_age:hawaii?28:29,compensation_min:hawaii?4000:15000,compensation_max:hawaii?6000:null,compensation_basis:'TOTAL_PROGRAM',data_source:'PROVIDER',source_url:source,external_id:external,review_status:'APPROVED',active:true,verified:true,source_checked_at:reviewedAt}).select('id').single());
 check(await db.from('eligibility_requirements').insert({opportunity_id:o.id,published_requirement:`Original provider source: ${source}. Provider recruits in ${city}, ${state}. This is a city recruitment service area, not a confirmed appointment address; Census coordinates are approximate. Confirm the medical clinic and travel directly. ${hawaii?'Must reside on Oahu; ages 21–28; published stipend $4,000–$6,000 per treatment cycle, awarded at cycle end.':'First-time donors ages 21–29; published first-time compensation $15,000 for the donation cycle, subject to matching and provider terms. Agency is not a medical clinic; appointments may require travel.'} Medical screening and additional provider requirements apply; acceptance and payment are not guaranteed.`}));published++;
}
console.log(JSON.stringify({published,skipped,mode:apply?'published':'dry-run'}));
