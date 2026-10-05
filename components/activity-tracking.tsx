'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import {useAuth} from './auth-provider';
import {browserDb,configured} from '@/lib/supabase';
import {activityInput} from '@/lib/activity-events';
export function useActivityPreference(){const {user}=useAuth();return useQuery({queryKey:['activity-preference',user?.id],enabled:configured&&!!user,retry:false,queryFn:async()=>{const result=await browserDb().from('activity_preferences').select('enabled').eq('user_id',user!.id).maybeSingle();if(result.error)throw result.error;return result.data?.enabled??false;}});}
export function ActivityTracking(){
 const {user}=useAuth();const preference=useActivityPreference();const pathname=usePathname();
 useEffect(()=>{if(!user||preference.data!==true)return;
  const send=(event:string)=>{const parsed=activityInput.safeParse({event});if(parsed.success)void fetch('/api/activity',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(parsed.data),keepalive:true}).catch(()=>{});};
  if(pathname==='/explore'||pathname==='/')send('EXPLORE_OPENED');else if(pathname?.startsWith('/opportunity/'))send('OPPORTUNITY_OPENED');
  const clicked=(event:MouseEvent)=>{const target=event.target instanceof Element?event.target.closest<HTMLElement>('[data-activity]'):null;if(target&&!target.hasAttribute('disabled'))send(target.dataset.activity??'');};
  document.addEventListener('click',clicked);return()=>document.removeEventListener('click',clicked);
 },[user?.id,preference.data,pathname]);
 return null;
}
