import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
import {serverDb} from '@/lib/server';
import {reviewSchema} from '@/lib/validation';
export async function POST(req:NextRequest){
 const db=await serverDb();const {data:{user}}=await db.auth.getUser();if(!user||user.app_metadata.role!=='admin')return NextResponse.json({error:'Administrator access required.'},{status:403});
 const body=await req.json().catch(()=>null);const id=z.string().uuid().safeParse(body?.id);if(!id.success)return NextResponse.json({error:'Invalid listing ID.'},{status:400});
 if(!['approve','draft','reject'].includes(body?.action))return NextResponse.json({error:'Choose a valid review action.'},{status:400});
 const {data:existing,error:lookupError}=await db.from('opportunities').select('opportunity_type,data_source').eq('id',id.data).single();if(lookupError||!existing)return NextResponse.json({error:'Listing not found.'},{status:404});
 if(body.action==='reject'){const {error}=await db.from('opportunities').update({review_status:'REJECTED',active:false,verified:false}).eq('id',id.data);return NextResponse.json(error?{error:error.message}:{ok:true},{status:error?400:200});}
 if(body.action==='approve'&&existing.data_source==='GOOGLE_PLACES')return NextResponse.json({error:'This location uses restricted Google Places data. Independently source and verify its location before publishing.'},{status:409});
 const parsed=reviewSchema.safeParse({...body.terms,opportunity_type:existing.opportunity_type});if(!parsed.success)return NextResponse.json({error:parsed.error.issues.map(i=>i.message).join(' ')},{status:400});
 const {opportunity_type,...terms}=parsed.data;const changes=body.action==='draft'?terms:{...terms,review_status:'APPROVED',active:true,verified:true,source_checked_at:new Date().toISOString()};const {error}=await db.from('opportunities').update(changes).eq('id',id.data);return NextResponse.json(error?{error:error.message}:{ok:true},{status:error?400:200});
}
