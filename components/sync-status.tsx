'use client';
import {useQuery} from '@tanstack/react-query';
import {browserDb} from '@/lib/supabase';
export function SyncStatus({userId}:{userId:string}){
 const query=useQuery({queryKey:['sync-status',userId],refetchInterval:60000,queryFn:async()=>{const result=await browserDb().from('sync_state').select('status,last_completed_at,imported,archived').eq('id','atlanta').maybeSingle();if(result.error)throw result.error;return result.data;}});
 return <div className="sync-status"><h3>Background job</h3>{query.isError?<p>Install the launch migration and configure hosting to enable background-job status.</p>:query.data?.status==='FAILED'?<p role="alert">Last background job failed. Check hosting logs and retry the scheduled job.</p>:!query.data?.last_completed_at?<p>No completed background run yet.</p>:<p role="status">Status: {query.data.status} · Last completion: {new Date(query.data.last_completed_at).toLocaleString()} · Imported: {query.data.imported} · Archived: {query.data.archived}</p>}</div>;
}
