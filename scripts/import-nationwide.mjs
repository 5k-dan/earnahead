import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {registryListings} from '../lib/registry-import.ts';

process.loadEnvFile('.env.local');
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Local service role key required.');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const cache='node_modules/.cache/nationwide-import.json';
await mkdir('node_modules/.cache',{recursive:true});
let state;
try {state=JSON.parse(await readFile(cache,'utf8'));} catch {state={pageToken:null,pages:0,imported:0,existing:0,states:{},complete:false};}
const check=result=>{if(result.error)throw new Error(result.error.message+' '+(result.error.details??''));return result.data;};
const organizations=new Map();
for(let offset=0;;offset+=1000){const rows=check(await db.from('organizations').select('id,name').range(offset,offset+999));for(const r of rows)organizations.set(r.name,r.id);if(rows.length<1000)break;}
const pageBudget=Number(process.argv[2]??20);
if(!Number.isInteger(pageBudget)||pageBudget<1||pageBudget>1000)throw new Error('Pass a page budget between 1 and 1000.');
const endPage=state.pages+pageBudget;
while(!state.complete&&state.pages<endPage){
 const url=new URL('https://clinicaltrials.gov/api/v2/studies');
 url.searchParams.set('filter.overallStatus','RECRUITING');url.searchParams.set('query.locn','United States');url.searchParams.set('pageSize','100');
 if(state.pageToken)url.searchParams.set('pageToken',state.pageToken);
 const response=await fetch(url,{signal:AbortSignal.timeout(60000)});if(!response.ok)throw new Error(`Registry HTTP ${response.status}`);
 const page=await response.json();const rows=[...new Map((page.studies??[]).flatMap(s=>registryListings(s)).map(r=>[r.external,r])).values()];
 for(let offset=0;offset<rows.length;offset+=100){
  const batch=rows.slice(offset,offset+100);
  const found=[];
  for(let start=0;;){const part=check(await db.from('opportunities').select('external_id').eq('data_source','CLINICALTRIALS_GOV').in('external_id',batch.map(r=>r.external)).order('external_id').range(start,start+99));found.push(...part);if(!part.length)break;start+=part.length;}
  const known=new Set(found.map(r=>r.external_id));const fresh=batch.filter(r=>!known.has(r.external));state.existing+=batch.length-fresh.length;
  for(const name of new Set(fresh.map(r=>r.organization)))if(!organizations.has(name)){const org=check(await db.from('organizations').insert({name}).select('id').single());organizations.set(name,org.id);}
  const locations=fresh.map(r=>({id:randomUUID(),organization_id:organizations.get(r.organization),name:r.facility,address:r.address,position:`SRID=4326;POINT(${r.lon} ${r.lat})`}));
  if(!fresh.length)continue;
  check(await db.from('locations').insert(locations));
  const listings=fresh.map((r,i)=>({id:randomUUID(),organization_id:organizations.get(r.organization),location_id:locations[i].id,title:r.title,opportunity_type:r.type,minimum_age:r.min,maximum_age:r.max,compensation_min:null,compensation_max:null,data_source:'CLINICALTRIALS_GOV',external_id:r.external,source_url:r.source,review_status:'PENDING_REVIEW',active:false,verified:false,source_checked_at:new Date().toISOString()}));
  try{
   check(await db.from('opportunities').insert(listings));
   const requirements=fresh.flatMap((r,i)=>r.requirements?[{opportunity_id:listings[i].id,published_requirement:r.requirements}]:[]);
   if(requirements.length)check(await db.from('eligibility_requirements').insert(requirements));
  }catch(error){await db.from('opportunities').delete().in('id',listings.map(r=>r.id));await db.from('locations').delete().in('id',locations.map(r=>r.id));throw error;}
  state.imported+=fresh.length;
 }
 for(const study of page.studies??[])for(const location of study.protocolSection?.contactsLocationsModule?.locations??[]){if(location.country==='United States'&&location.geoPoint&&(!location.status||location.status==='RECRUITING'))state.states[location.state??'Unspecified']=(state.states[location.state??'Unspecified']??0)+1;}
 state.pages++;state.pageToken=page.nextPageToken??null;state.complete=!page.nextPageToken;await writeFile(cache,JSON.stringify(state));
 console.log(JSON.stringify({pages:state.pages,imported:state.imported,existing:state.existing,states:Object.keys(state.states).length,complete:state.complete}));
}
console.log(state.complete?'Registry pass complete.':'Page budget reached. Run this script again to resume the saved cursor.');
console.log('New listings remain pending review; compensation is not published.');
