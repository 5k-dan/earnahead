import {repairText} from '@/lib/text';
import {ReportListing} from '@/components/report-listing';
import {freshnessLabel} from '@/lib/freshness';
import Link from 'next/link';
import { serverDb } from '@/lib/server';
import { configured } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import {publishedCompensation,preliminaryAgeMessage} from '@/lib/rules.mjs';
export default async function Detail({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 if(!configured)return <main className="account-panel"><h1>Opportunity details</h1><p>Connect Supabase to load reviewed opportunities.</p><Link href="/explore">Back to explore</Link></main>;
 const db=await serverDb();const {data}=await db.from('opportunities').select('*,eligibility_requirements(published_requirement),locations(name,address),organizations(name)').eq('id',id).eq('active',true).single();
 if(!data)notFound();
 const {data:{user}}=await db.auth.getUser();const profile=user?(await db.from('user_profiles').select('dob').eq('user_id',user.id).maybeSingle()).data:null;
 return <main className="account-panel"><Link href="/explore">← All opportunities</Link><div className="eyebrow" style={{marginTop:35}}>{data.opportunity_type.replaceAll('_',' ')}</div><h1>{repairText(data.title)}</h1><p>{data.organizations?.name} · {data.locations?.name}<br/>{data.locations?.address}</p><h2>Published compensation</h2><p>{publishedCompensation(data.compensation_min,data.compensation_max,data.compensation_basis,data.opportunity_type)}</p><h2>Published preliminary requirements</h2><p>Minimum age: {data.minimum_age}. {data.maximum_age===null?'No maximum age published.':`Maximum age: ${data.maximum_age}.`}</p><ul>{data.eligibility_requirements?.map((r:{published_requirement:string},i:number)=><li key={i}>{repairText(r.published_requirement)}</li>)}</ul><p>{preliminaryAgeMessage(profile?.dob??null,data.minimum_age,data.maximum_age)}</p><p>Final eligibility is determined by the medical provider.</p><Link className="detail-button" href="/profile">Update your profile →</Link><a className="detail-button" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([data.locations?.name,data.locations?.address].filter(Boolean).join(', ')||data.title)}&travelmode=transit`}>Plan a trip by public transit ↗</a><a data-activity="PROVIDER_LINK_CLICKED" href={data.source_url} className="primary" target="_blank" rel="noreferrer">Read terms and apply with provider ↗</a><p>Providers pay participants directly. EarnAhead does not handle payments.</p><p>{data.opportunity_type==='CLINICAL_TRIAL'&&data.compensation_min===null&&data.compensation_max===null?'Recruiting study · payment is not confirmed.':''}</p><small>{freshnessLabel(data.source_checked_at)}</small><ReportListing id={data.id}/></main>;
}
