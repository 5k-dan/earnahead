// Fetch individual original BioLife center offers. Never apply the national banner
// or a referral bonus to a local listing. Snapshot expires after seven days.
import {readFile,writeFile} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const r=await db.from('opportunities').select('external_id').eq('data_source','PROVIDER').eq('active',true).eq('opportunity_type','PLASMA').like('external_id','official-location:https://www.biolifeplasma.com/%');
if(r.error)throw r.error;
const urls=[...new Set(r.data.map(x=>x.external_id.match(/^official-location:(https:\/\/www\.biolifeplasma\.com\/locations\/[^:]+):/)?.[1]).filter(Boolean))];
const output=JSON.parse(await readFile('lib/data/provider-offers.json','utf8'));output.centers={};
let next=0;const failures=[];
await Promise.all(Array.from({length:4},async()=>{while(next<urls.length){const url=urls[next++];try{
 const res=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(25000)});if(!res.ok)throw Error(`HTTP ${res.status}`);
 const html=await res.text();const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ');
 const match=text.match(/New donors can get up to \$([\d,]+) in their first month donating\./i);if(!match)throw Error('No explicit center first-month offer');
 const maximum=Number(match[1].replaceAll(',',''));if(maximum<=0||maximum>2000)throw Error('Unexpected offer amount');
 const checkedAt=new Date().toISOString();output.centers[url]={label:`Up to $${maximum.toLocaleString('en-US')} / first month`,note:'New donors only. First-month promotional total across qualifying donations, not per visit or ongoing monthly pay. Confirm coupon, donation count, deadline and eligibility with this center.',source:url,checkedAt,expiresAt:new Date(Date.now()+7*86400000).toISOString(),maximum,basis:'PER_MONTH',kind:'NEW_DONOR'};
 }catch(e){failures.push({url,error:e.message});}if(next%40===0)console.log('Checked',next,'of',urls.length);}}));
await writeFile('lib/data/provider-offers.json',JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify({checked:urls.length,offers:Object.keys(output.centers).length,failures}));
