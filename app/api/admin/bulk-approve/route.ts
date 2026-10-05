import {NextResponse} from 'next/server';
import {serverDb} from '@/lib/server';
import {reviewSchema} from '@/lib/validation';
export async function POST(){
 const db=await serverDb();const {data:{user}}=await db.auth.getUser();if(!user||user.app_metadata.role!=='admin')return NextResponse.json({error:'Administrator access required.'},{status:403});
 const {data,error}=await db.from('opportunities').select('*').in('review_status',['PENDING_REVIEW','NEEDS_SOURCE']).limit(1000);if(error)return NextResponse.json({error:error.message},{status:500});
 const reviewable=(data??[]).filter(row=>row.review_status==='PENDING_REVIEW'&&reviewSchema.safeParse(row).success);
 const ids=reviewable.map(r=>r.id);if(!ids.length)return NextResponse.json({approved:0,skipped:data?.length??0});
 const result=await db.from('opportunities').update({review_status:'APPROVED',active:true,verified:true,source_checked_at:new Date().toISOString()}).in('id',ids).eq('review_status','PENDING_REVIEW').select('id');
 if(result.error)return NextResponse.json({error:result.error.message},{status:500});
 return NextResponse.json({approved:result.data?.length??0,skipped:(data?.length??0)-ids.length});
}
