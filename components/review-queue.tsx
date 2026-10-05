'use client';
import {StaleListings} from './stale-listings';
import {SyncStatus} from './sync-status';
import {ReportQueue} from './report-queue';
import {ImportControls} from './import-controls';
import {useState} from 'react';
import {useQuery,useQueryClient} from '@tanstack/react-query';
import {CheckCheck,ExternalLink,Search,ShieldCheck} from 'lucide-react';
import {useAuth} from './auth-provider';
import {browserDb} from '@/lib/supabase';
import {ReviewForm} from './review-form';
import {opportunityLabels} from '@/lib/opportunities';
import {reviewSchema} from '@/lib/validation';
export function ReviewQueue({notice}:{notice:(s:string)=>void}){
 const {user,loading}=useAuth();const cache=useQueryClient();const [busy,setBusy]=useState(false);const [search,setSearch]=useState('');
 const query=useQuery({queryKey:['review-queue',user?.id],enabled:!!user&&user.app_metadata.role==='admin',queryFn:async()=>{const {data,error}=await browserDb().from('opportunities').select('*').in('review_status',['NEEDS_SOURCE','PENDING_REVIEW']).order('last_seen_at',{ascending:false});if(error)throw error;return data;}});
 if(loading)return <p>Loading account…</p>;if(!user||user.app_metadata.role!=='admin')return <p>Sign in with your reviewer account to manage listings.</p>;
 const rows=query.data??[];const ready=rows.filter(r=>r.review_status==='PENDING_REVIEW'&&reviewSchema.safeParse(r).success).length;
 return <section className="review-workspace"><ImportControls key={user.id} userId={user.id}/><ReportQueue userId={user.id}/><SyncStatus userId={user.id}/><StaleListings userId={user.id} notice={notice}/><div className="review-toolbar"><div><h2>{rows.length} listings waiting</h2><p>{ready} with valid sources and terms · {rows.length-ready} need attention</p></div><button className="primary" disabled={!ready||busy} onClick={async()=>{setBusy(true);try{const response=await fetch('/api/admin/bulk-approve',{method:'POST'});const result=await response.json();if(!response.ok)throw new Error(result.error);notice(`Approved ${result.approved} listings. ${result.skipped} incomplete listings remain hidden.`);void cache.invalidateQueries({queryKey:['review-queue']});void cache.invalidateQueries({queryKey:['opportunities']});}catch(error){notice(error instanceof Error?error.message:'Bulk approval failed.');}finally{setBusy(false);}}}><CheckCheck size={18}/>{busy?'Approving…':'Approve all'} {ready>0&&`(${ready})`}</button></div><div className="review-guidance"><ShieldCheck size={18}/><span>Approve all publishes the sourced listings using their saved terms. Missing-source listings stay hidden. Unpublished compensation stays blank.</span></div><label className="review-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title or category"/></label>{query.isError&&<p role="alert">The review queue could not load. Refresh and try again.</p>}{!rows.length&&!query.isPending?<div className="empty-state"><CheckCheck size={28}/><h3>You’re all caught up.</h3><p>New imported listings will appear here for review.</p></div>:rows.filter(r=>`${r.title} ${r.opportunity_type}`.toLowerCase().includes(search.toLowerCase())).map(row=><details className="review-item" key={row.id}><summary><span className={`review-type type-${String(row.opportunity_type).toLowerCase()}`}>{opportunityLabels[row.opportunity_type]}</span><h3>{row.title}</h3><span className="review-status">{row.review_status==='NEEDS_SOURCE'?'Source needed':'Ready for review'}</span><ExternalLink size={16}/></summary><ReviewForm record={row} notice={notice}/></details>)}</section>;
}

