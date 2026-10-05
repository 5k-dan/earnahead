// Manual source review 2026-10-05: original Fairfax EggBank donor directory,
// requirements and payment FAQs. These are city service areas, NOT clinic pins.
import {readFile} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const reviewedAt='2026-10-05T21:10:00Z';
if(Date.now()-Date.parse(reviewedAt)>30*86400000)throw Error('Re-review the original egg provider sources before publishing this manual snapshot.');
const apply=process.argv.includes('--apply');
const directory='https://www.fairfaxeggbank.com/locations/';
const source='https://www.fairfaxeggbank.com/egg-donor-requirements/';
const cities={AZ:['Scottsdale'],CA:['Carlsbad','Encino','Foster City','Fullerton','La Jolla','Los Angeles','Mission Viejo','Newport Beach','Pasadena','Rancho Cucamonga'],CO:['Colorado Springs','Denver','Greenwood Village'],FL:['Tampa'],GA:['Atlanta','Sandy Springs'],IL:['Chicago','Naperville','Oak Brook','Skokie'],MD:['Rockville','Towson'],MA:['Braintree','Woburn'],MI:['Grand Rapids'],MN:['Woodbury'],NC:['Asheville','Raleigh'],PA:['Philadelphia'],RI:['Providence'],SC:['Columbia','Greenville','Mount Pleasant','Spartanburg','Summerville'],TN:['Nashville'],TX:['Austin','Dallas','Webster'],UT:['Sandy'],VA:['Fairfax','Leesburg','Woodbridge']};
// Ambiguous "South Florida" and neighborhoods absent from Census are not assigned
// guessed coordinates. A verified street address is needed before adding them.
const places=JSON.parse(await readFile('lib/data/us-places.json','utf8'));
const normalize=s=>s.replace(/ (city and borough|city|town|village|borough|CDP|municipality)$/i,'').toLowerCase();
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const check=r=>{if(r.error)throw Error(r.error.message);return r.data;};
let org=check(await db.from('organizations').select('id').eq('name','Fairfax EggBank').limit(1));if(!org.length&&apply)org=[check(await db.from('organizations').insert({name:'Fairfax EggBank',website:'https://www.fairfaxeggbank.com'}).select('id').single())];
let published=0;const skipped=[];
for(const [state,names]of Object.entries(cities))for(const city of names){
 const matches=places.filter(p=>p[1]===state&&normalize(p[0])===city.toLowerCase());if(matches.length!==1){skipped.push(`${city}, ${state}`);continue;}
 const [,,lat,lon]=matches[0];const external=`official-service-area:fairfax-eggbank:${city}:${state}`;
 if(!apply){published++;continue;}
 if(check(await db.from('opportunities').select('id').eq('data_source','PROVIDER').eq('external_id',external).maybeSingle())){published++;continue;}
 const loc=check(await db.from('locations').insert({organization_id:org[0].id,name:`${city}, ${state} service area · confirm clinic`,address:'City-level service area, not an appointment address. The provider confirms the actual partner clinic after screening.',position:`SRID=4326;POINT(${lon} ${lat})`}).select('id').single());
 const o=check(await db.from('opportunities').insert({organization_id:org[0].id,location_id:loc.id,title:`Fairfax egg donor program · ${city}, ${state}`,opportunity_type:'EGG',minimum_age:21,maximum_age:30,compensation_min:null,compensation_max:null,compensation_basis:null,data_source:'PROVIDER',source_url:source,external_id:external,review_status:'APPROVED',active:true,verified:true,source_checked_at:reviewedAt}).select('id').single());
 check(await db.from('eligibility_requirements').insert({opportunity_id:o.id,published_requirement:`Provider lists ${city}, ${state} as an egg donor partner-clinic service area at ${directory}. Coordinates are the US Census city representative point, not a clinic address; distance is approximate. Confirm the actual clinic, travel and appointments directly. Provider publishes ages 19–30 (21–30 in Colorado); EarnAhead requires 21+. Other screening, work eligibility and medical requirements apply: ${source}. Compensation depends on the location and donor; the multi-cycle reimbursement maximum is not a per-cycle fee. Payment FAQ: https://www.fairfaxeggbank.com/egg-donor-faqs/. Acceptance and payment are not guaranteed.`}));published++;
}
console.log(JSON.stringify({published,skipped,mode:apply?'published':'dry-run'}));
