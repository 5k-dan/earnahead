import type {SupabaseClient} from '@supabase/supabase-js';

// Only maintained, original provider pages are fetched. Listing text never becomes a URL.
const providers=[
 {name:'CSL Plasma',match:/^CSL Plasma(?:\s|$)/i,age:'https://www.cslplasma.com/faq',payment:'https://www.cslplasma.com/faq',range:/between the ages of (18) to (74)/i},
 {name:'BioLife Plasma Services',match:/^BioLife Plasma(?: Services)?(?:\s|$)/i,age:'https://www.biolifeplasma.com/donation-process/who-can-donate',payment:'https://www.biolifeplasma.com/donation-process/faqs',range:/(18) years old or older/i},
];
export function providerFor(title:string,type:string){return type==='PLASMA'?providers.find(p=>p.match.test(title)):undefined;}
export function publishedProviderTerms(title:string,type:string,ageHTML:string,paymentHTML:string){
 const provider=providerFor(title,type);if(!provider)return null;
 const text=(html:string)=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ');
 const age=text(ageHTML),payment=text(paymentHTML);const match=age.match(provider.range);
 // A live source must still identify the provider and explicitly describe donor payment.
 if(!match||!new RegExp(provider.name.startsWith('CSL')?'CSL Plasma':'BioLife','i').test(age)||!/(?:paid|payment|compensation|money|debit card)/i.test(payment))return null;
 return {source_url:provider.age,minimum_age:Number(match[1]),maximum_age:match[2]?Number(match[2]):null,compensation_min:null,compensation_max:null,compensation_basis:null,
  requirements:`${provider.name} publishes a minimum age of ${match[1]}${match[2]?` and maximum age of ${match[2]}`:''}. Additional provider screening and requirements apply; read ${provider.age}. Provider payment information: ${provider.payment}. No facility-specific compensation figure was extracted. Final eligibility is determined by the medical provider.`};
}
async function page(url:string){
 const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(10000),cache:'no-store'});
 if(!response.ok)throw new Error('Provider page unavailable');
 if(Number(response.headers.get('content-length')??0)>2000000)throw new Error('Provider page too large');
 const html=await response.text();if(html.length>2000000)throw new Error('Provider page too large');return html;
}
export async function sourceFacilityBatch(db:SupabaseClient,after?:string){
 let query=db.from('opportunities').select('id,title,opportunity_type').eq('data_source','GOOGLE_PLACES').eq('review_status','NEEDS_SOURCE').is('source_url',null).order('id').limit(100);
 if(after)query=query.gt('id',after);
 const {data,error}=await query;if(error)throw new Error(error.message);
 const rows=data??[];let sourced=0,skipped=0;const pages=new Map<string,Promise<string>>();
 const get=(url:string)=>{if(!pages.has(url))pages.set(url,page(url));return pages.get(url)!;};
 for(const row of rows){const provider=providerFor(row.title,row.opportunity_type);if(!provider){skipped++;continue;}
  let terms;try{terms=publishedProviderTerms(row.title,row.opportunity_type,await get(provider.age),await get(provider.payment));}catch{skipped++;continue;}if(!terms){skipped++;continue;}
  const {requirements,...fields}=terms;
  const requirement=await db.from('eligibility_requirements').insert({opportunity_id:row.id,published_requirement:requirements}).select('id').single();
  if(requirement.error)throw new Error(requirement.error.message);
  const result=await db.from('opportunities').update({...fields,review_status:'PENDING_REVIEW',active:false,verified:false,source_checked_at:new Date().toISOString()}).eq('id',row.id).eq('review_status','NEEDS_SOURCE').is('source_url',null).select('id');
  if(result.error||!result.data?.length){await db.from('eligibility_requirements').delete().eq('id',requirement.data.id);if(result.error)throw new Error(result.error.message);skipped++;}else sourced++;
 }
 return {sourced,skipped,nextCursor:rows.length===100?rows.at(-1)!.id:null};
}
