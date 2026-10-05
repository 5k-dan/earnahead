import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {timingSafeEqual} from 'node:crypto';
import {importPage} from '@/lib/import-service';
import {refreshRegistry} from '@/lib/registry-refresh';
import {sourceFacilityBatch} from '@/lib/provider-source';
export const maxDuration=60;
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const secret=process.env.CRON_SECRET;const expected=Buffer.from('Bearer '+(secret??''));const actual=Buffer.from(req.headers.get('authorization')??'');
 if(!secret||secret.length<32||actual.length!==expected.length||!timingSafeEqual(actual,expected))return NextResponse.json({error:'Unauthorized'},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return NextResponse.json({error:'Background sync is not configured.'},{status:503});
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});const lock=await db.rpc('claim_sync');if(lock.error)return NextResponse.json({error:'Sync database setup is required.'},{status:503});if(!lock.data)return NextResponse.json({skipped:true});
 try{await db.rpc('prune_activity_events');const state=await db.from('sync_state').select('*').eq('id','atlanta').single();if(state.error)throw state.error;
  const imported=await importPage(db,{source:'donations'});const result=await imported.json();if(!imported.ok)throw new Error('Donation source import failed');
  const sourced=await sourceFacilityBatch(db,state.data.cursor?.startsWith('donor:')?state.data.cursor.slice(6):undefined);
  // Maintain existing research freshness without automatically expanding its inventory.
  const refreshed=await refreshRegistry(db,state.data.refresh_offset);const update=await db.from('sync_state').update({cursor:sourced.nextCursor?'donor:'+sourced.nextCursor:null,refresh_offset:refreshed.nextOffset,last_completed_at:new Date().toISOString(),status:'OK',imported:result.imported,archived:refreshed.archived}).eq('id','atlanta');if(update.error)throw update.error;
  const log=await db.from('sync_runs').insert({status:'OK',imported:result.imported,archived:refreshed.archived});if(log.error)throw log.error;
  return NextResponse.json({imported:result.imported,sourced:sourced.sourced,archived:refreshed.archived,morePages:!!sourced.nextCursor});
 }catch{await db.from('sync_state').update({status:'FAILED'}).eq('id','atlanta');await db.from('sync_runs').insert({status:'FAILED'});console.error('EarnAhead background sync failed; inspect sync_state and registry availability.');return NextResponse.json({error:'Sync failed.'},{status:500});}
}
