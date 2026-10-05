import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {timingSafeEqual} from 'node:crypto';
import {importPage} from '@/lib/import-service';
import {refreshRegistry} from '@/lib/registry-refresh';
export const maxDuration=60;
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const secret=process.env.CRON_SECRET;const expected=Buffer.from('Bearer '+(secret??''));const actual=Buffer.from(req.headers.get('authorization')??'');
 if(!secret||secret.length<32||actual.length!==expected.length||!timingSafeEqual(actual,expected))return NextResponse.json({error:'Unauthorized'},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return NextResponse.json({error:'Background sync is not configured.'},{status:503});
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});const lock=await db.rpc('claim_sync');if(lock.error)return NextResponse.json({error:'Sync database setup is required.'},{status:503});if(!lock.data)return NextResponse.json({skipped:true});
 try{const state=await db.from('sync_state').select('*').eq('id','atlanta').single();if(state.error)throw state.error;
  const imported=await importPage(db,{source:'trials',pageToken:state.data.cursor??undefined});const result=await imported.json();if(!imported.ok)throw new Error('Registry import failed');
  const refreshed=await refreshRegistry(db,state.data.refresh_offset);const update=await db.from('sync_state').update({cursor:result.nextPageToken??null,refresh_offset:refreshed.nextOffset,last_completed_at:new Date().toISOString(),status:'OK',imported:result.imported,archived:refreshed.archived}).eq('id','atlanta');if(update.error)throw update.error;
  const log=await db.from('sync_runs').insert({status:'OK',imported:result.imported,archived:refreshed.archived});if(log.error)throw log.error;
  return NextResponse.json({imported:result.imported,archived:refreshed.archived,morePages:!!result.nextPageToken});
 }catch{await db.from('sync_state').update({status:'FAILED'}).eq('id','atlanta');await db.from('sync_runs').insert({status:'FAILED'});console.error('EarnAhead background sync failed; inspect sync_state and registry availability.');return NextResponse.json({error:'Sync failed.'},{status:500});}
}
