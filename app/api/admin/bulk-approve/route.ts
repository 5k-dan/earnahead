import {z} from 'zod';
import {NextRequest,NextResponse} from 'next/server';
import {serverDb} from '@/lib/server';
import {reviewSchema} from '@/lib/validation';
export const maxDuration=60;
export async function POST(req:NextRequest){
 const db=await serverDb();const {data:{user}}=await db.auth.getUser();if(!user||user.app_metadata.role!=='admin')return NextResponse.json({error:'Administrator access required.'},{status:403});
 const input=z.object({after:z.string().uuid().optional()}).strict().safeParse(req?await req.json().catch(()=>({})):{});if(!input.success)return NextResponse.json({error:'Invalid approval cursor.'},{status:400});
 let query=db.from('opportunities').select('*').eq('review_status','PENDING_REVIEW').order('id').limit(1000);if(input.data.after)query=query.gt('id',input.data.after);
 const {data,error}=await query;if(error)return NextResponse.json({error:error.message},{status:500});
 const reviewable=(data??[]).filter(row=>row.review_status==='PENDING_REVIEW'&&reviewSchema.safeParse(row).success);
 const nextCursor=data?.length===1000?data[data.length-1].id:null;
 const ids=reviewable.map(r=>r.id);if(!ids.length)return NextResponse.json({approved:0,skipped:data?.length??0,nextCursor});
 let approved=0;
 // Supabase filters are encoded into the request URL. Hundreds of UUIDs exceed
 // proxy URL limits even though the update body itself is small.
 for(let start=0;start<ids.length;start+=50){
  const result=await db.from('opportunities').update({review_status:'APPROVED',active:true,verified:true,source_checked_at:new Date().toISOString()}).in('id',ids.slice(start,start+50)).eq('review_status','PENDING_REVIEW').select('id');
  if(result.error)return NextResponse.json({error:`Approval stopped after ${approved} listings. Retry to continue. ${result.error.message}`,approved},{status:500});
  approved+=result.data?.length??0;
 }
 return NextResponse.json({approved,skipped:(data?.length??0)-ids.length,nextCursor});
}
