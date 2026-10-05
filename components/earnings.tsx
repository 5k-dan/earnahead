'use client';
import {useQuery,useQueryClient} from '@tanstack/react-query';
import {useAuth} from './auth-provider';
import {browserDb} from '@/lib/supabase';
import {z} from 'zod';
export function Earnings({notice}:{notice:(s:string)=>void}){
 const {user,loading}=useAuth();const cache=useQueryClient();
 const query=useQuery({queryKey:['earnings',user?.id],enabled:!!user,queryFn:async()=>{const {data,error}=await browserDb().from('earnings').select('id,amount,received_at').eq('user_id',user!.id).order('received_at',{ascending:false});if(error)throw error;return data;}});
 const rows=query.data??[];const total=rows.reduce((sum,r)=>sum+Number(r.amount),0);const fmt=(amount:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(amount);
 if(loading)return <p>Loading account…</p>;if(!user)return <p>Sign in to track payments received from providers.</p>;
 return <><div className="earnings-summary"><span>Total recorded earnings</span><strong>{fmt(total)}</strong><small>{rows.length} provider payments · Self-reported</small></div>{query.isError&&<p role="alert">Could not load earnings. Please refresh.</p>}<form onSubmit={async e=>{e.preventDefault();const form=e.currentTarget;const f=new FormData(form);const parsed=z.object({amount:z.coerce.number().positive().max(1000000),received_at:z.string().regex(/^\d{4}-\d{2}-\d{2}$/)}).safeParse({amount:f.get('amount'),received_at:f.get('date')});if(!parsed.success){notice('Enter a positive amount and valid date.');return;}const {error}=await browserDb().from('earnings').insert({user_id:user.id,...parsed.data});if(error)notice(error.message);else{notice('Payment recorded.');form.reset();void cache.invalidateQueries({queryKey:['earnings']});}}}><h3>Record a provider payment</h3><label>Amount received ($)<input name="amount" type="number" min="0.01" step="0.01" required/></label><label>Date received<input name="date" type="date" required/></label><button className="primary">Add earnings</button></form><h2>Payment history</h2>{!rows.length?<p>No recorded payments yet. Providers pay you directly.</p>:rows.map(row=><article className="listing payment-row" key={row.id}><strong>{fmt(Number(row.amount))}</strong><span>{row.received_at}</span><button onClick={async()=>{const {error}=await browserDb().from('earnings').delete().eq('id',row.id).eq('user_id',user.id);if(error)notice(error.message);else void cache.invalidateQueries({queryKey:['earnings']});}}>Remove entry</button></article>)}</>;
}


