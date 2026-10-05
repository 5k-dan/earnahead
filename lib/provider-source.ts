import type {SupabaseClient} from '@supabase/supabase-js';

// Only maintained, original provider pages are fetched. Listing text never becomes a URL.
const providers=[
 {type:'PLASMA',name:'CSL Plasma',identity:/CSL Plasma/i,match:/^CSL Plasma(?:\s|$)/i,age:'https://www.cslplasma.com/faq',payment:'https://www.cslplasma.com/faq',range:/between the ages of (18) to (74)/i},
 {type:'PLASMA',name:'BioLife Plasma Services',identity:/BioLife/i,match:/^BioLife Plasma(?: Services)?(?:\s|$)/i,age:'https://www.biolifeplasma.com/donation-process/who-can-donate',payment:'https://www.biolifeplasma.com/donation-process/faqs',range:/(18) years old or older/i},
 {type:'PLASMA',name:'Octapharma Plasma',identity:/Octapharma/i,match:/^Octapharma Plasma(?:\s|$)/i,age:'https://www.octapharmaplasma.com/new-donors/',payment:'https://www.octapharmaplasma.com/new-donors/',range:/between (18) and (70) years old/i},
 {type:'PLASMA',name:'Grifols',identity:/Grifols/i,match:/^(?:Grifols (?:Biomat|Talecris|Plasma)|Biomat USA|Talecris Plasma Resources)(?:\s|$)/i,age:'https://www.grifolsplasma.com/en/first-donation/are-you-eligible',payment:'https://www.grifolsplasma.com/en/first-donation/faqs',range:/between the ages of (18) and (69)/i},
 {type:'SPERM',name:'Fairfax Cryobank',identity:/Fairfax Cryobank/i,match:/^Fairfax Cryobank(?:\s|$)/i,age:'https://fairfaxcryobank.com/become-a-donor',payment:'https://fairfaxcryobank.com/become-a-donor',range:/between the ages of (18)\s*-\s*(39)/i,fee:/getting paid \$(150) per donation visit/i,basis:'PER_VISIT'},
 {type:'EGG',name:'Fairfax EggBank',identity:/Fairfax EggBank/i,match:/^Fairfax EggBank(?:\s|$)/i,age:'https://www.fairfaxeggbank.com/egg-donor-requirements/',payment:'https://www.fairfaxeggbank.com/egg-donor-faqs/',range:/between (19) and (30) years old/i},
 {type:'EGG',name:'ConceiveAbilities',identity:/ConceiveAbilities/i,match:/^ConceiveAbilities(?:\s|$)/i,age:'https://www.conceiveabilities.com/egg-donors/faq/',payment:'https://www.conceiveabilities.com/egg-donors/egg-donor-pay/',range:/between (18|21) (?:and|to) (28)/i},
];
export function providerFor(title:string,type:string){return providers.find(p=>p.type===type&&p.match.test(title));}
export function publishedProviderTerms(title:string,type:string,ageHTML:string,paymentHTML:string){
 const provider=providerFor(title,type);if(!provider)return null;
 const text=(html:string)=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<img\b[^>]*alt=["']([^"']*)["'][^>]*>/gi,' $1 ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&ndash;|&mdash;|&#8211;|&#8212;|[–—]/g,'-').replace(/\s+/g,' ');
 const age=text(ageHTML),payment=text(paymentHTML);const match=age.match(provider.range);
 // A live source must still identify the provider and explicitly describe donor payment.
 if(!match||!provider.identity.test(age)||!/(?:paid|payment|compensation|money|debit card|reimbursement)/i.test(payment))return null;
 // Only an explicit, maintained per-visit fee is extracted. Promotional caps and
 // multi-cycle egg totals are never treated as a single donation payment.
 const fee='fee' in provider?payment.match(provider.fee!):null;const cycle=provider.name==='ConceiveAbilities'&&/ConceiveAbilities/i.test(payment)&&/compensation covers the entire egg donation cycle/i.test(payment)?payment.match(/\$(10,000|10000) is our starting egg donor pay/i):null;const amount=cycle?10000:fee?Number(fee[1]):null;
 return {source_url:cycle?provider.payment:provider.age,minimum_age:Math.max(type==='EGG'?21:18,Number(match[1])),maximum_age:match[2]?Number(match[2]):null,compensation_min:amount,compensation_max:cycle?null:amount,compensation_basis:cycle?'TOTAL_PROGRAM':amount!==null&&'basis' in provider?provider.basis:null,
  requirements:`${provider.name} publishes ages ${match[1]}${match[2]?` to ${match[2]}`:' and older'}.${type==='EGG'?' EarnAhead requires age 21 or older for egg programmes.':''} Additional provider screening and requirements apply; read ${provider.age}. Provider payment information: ${provider.payment}.${cycle?' Published starting pay: $10,000 for the entire egg donation cycle, including retrieval. Individual compensation is confirmed at consultation; acceptance and provider conditions apply.':amount!==null?` Published fee: $${amount} per donation visit; acceptance and provider conditions apply.`:' No universally applicable single-donation compensation figure was extracted; promotional and multi-cycle caps are not presented as guaranteed pay.'} Programme offices may arrange screening or donation at another clinic; confirm the actual appointment location with the provider. Final eligibility is determined by the medical provider.`};
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
