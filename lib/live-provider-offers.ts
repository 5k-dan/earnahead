import {unstable_cache} from 'next/cache';
import {providerOffer,ProviderOffer} from './provider-offers';

// Fixed, independently reviewed center URLs only. Recheck current prices daily;
// preserve a recent reviewed snapshot during outages, then hide expired offers.
const refresh=unstable_cache(async(source:string):Promise<ProviderOffer|null>=>{
 try{
  const response=await fetch(source,{redirect:'error',signal:AbortSignal.timeout(5000),cache:'no-store'});
  if(!response.ok)return null;
  const html=await response.text();if(html.length>2000000)return null;
  const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ');
  const match=text.match(/New donors can get up to \$([\d,]+) in their first month donating\./i);
  const maximum=match?Number(match[1].replaceAll(',','')):0;if(maximum<=0||maximum>2000)return null;
  return {kind:'NEW_DONOR',label:`Up to $${maximum.toLocaleString('en-US')} / first month`,note:'New donors only. First-month promotional total across qualifying donations, not per visit or ongoing monthly pay. Confirm coupon, donation count, deadline and eligibility with this center.',source,checkedAt:new Date().toISOString(),expiresAt:new Date(Date.now()+7*86400000).toISOString(),maximum,basis:'PER_MONTH'};
 }catch{return null;}
},['biolife-center-pay'],{revalidate:86400});

export async function liveProviderOffer(externalId:string|null|undefined,sourceUrl:string,type:string){
 const snapshot=providerOffer(externalId,sourceUrl,type,0);
 if(!snapshot)return null;
 if(type==='PLASMA'&&snapshot.source.startsWith('https://www.biolifeplasma.com/locations/')&&Date.now()-Date.parse(snapshot.checkedAt)>86400000)return await refresh(snapshot.source)??providerOffer(externalId,sourceUrl,type);
 return providerOffer(externalId,sourceUrl,type);
}
